const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Creates a Razorpay order for a given booking
const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, userId: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "This booking is already paid" });
    }

    // Razorpay expects amount in paise (price already stored in paise)
    const options = {
      amount: booking.price, // e.g. 54000 paise = ₹540
      currency: "INR",
      receipt: `receipt_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        type: booking.type,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save the Razorpay order ID on the booking
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
      keyId: process.env.RAZORPAY_KEY_ID,
      userName: req.user.name,
      userEmail: req.user.email,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Payment order creation failed" });
  }
};

// POST /api/payment/verify
// Verifies Razorpay signature and marks booking as paid
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Signature verification
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed: Invalid signature" });
    }

    // Update booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.status = "Confirmed";
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paidAt = new Date();
    await booking.save();

    // Increment user trip stats
    await User.findByIdAndUpdate(booking.userId, { $inc: { tripsCount: 1 } });

    res.json({
      success: true,
      message: "Payment verified! Booking confirmed.",
      data: booking,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// POST /api/payment/refund  (admin only)
const refundPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({ success: false, message: "Booking is not in a paid state" });
    }

    const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
      amount: booking.price, // full refund
    });

    booking.paymentStatus = "refunded";
    booking.status = "Cancelled";
    await booking.save();

    res.json({ success: true, message: "Refund initiated successfully", refund });
  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ success: false, message: "Refund failed" });
  }
};

module.exports = { createOrder, verifyPayment, refundPayment };
