import { useState } from "react";
import { paymentAPI } from "../utils/api";

/**
 * PaymentModal
 *
 * Props:
 *   booking   — the booking object returned after bookFlight / bookHotel
 *   user      — current user (name, email)
 *   theme     — "dark" | "light"
 *   onSuccess — callback(updatedBooking) called after payment verified
 *   onClose   — callback to close the modal
 */
export default function PaymentModal({ booking, user, theme, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dark = theme === "dark";
  const fmt = (p) => `₹${(p / 100).toLocaleString("en-IN")}`;

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create Razorpay order on our backend
      const { data } = await paymentAPI.createOrder(booking._id);

      // 2. Load Razorpay checkout script dynamically if not yet loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
          document.body.appendChild(script);
        });
      }

      // 3. Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "GlobeTrove",
        description: `${booking.type}: ${booking.dest}`,
        order_id: data.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#6366f1" },
        handler: async (response) => {
          try {
            // 4. Verify payment on our backend
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            onSuccess(verifyRes.data.data);
          } catch {
            setError("Payment verification failed. Contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not initiate payment.");
      setLoading(false);
    }
  };

  const overlay = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: "1rem",
  };
  const card = {
    background: dark ? "#0f172a" : "#ffffff",
    border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`,
    borderRadius: "1rem", padding: "2rem", maxWidth: 420, width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  };
  const title = { color: dark ? "#f1f5f9" : "#0f172a", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" };
  const row = { display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" };
  const label = { color: dark ? "#94a3b8" : "#64748b", fontSize: "0.9rem" };
  const value = { color: dark ? "#f1f5f9" : "#0f172a", fontSize: "0.9rem", fontWeight: 600 };
  const divider = { borderTop: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, margin: "1rem 0" };
  const totalRow = { display: "flex", justifyContent: "space-between", alignItems: "center" };
  const totalLabel = { color: dark ? "#94a3b8" : "#64748b", fontSize: "1rem" };
  const totalValue = { color: "#6366f1", fontSize: "1.4rem", fontWeight: 800 };
  const btnPay = {
    width: "100%", padding: "0.85rem", marginTop: "1.5rem",
    background: loading ? "#4338ca" : "linear-gradient(135deg,#6366f1,#818cf8)",
    color: "#fff", border: "none", borderRadius: "0.75rem",
    fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
    transition: "opacity 0.2s",
  };
  const btnCancel = {
    width: "100%", padding: "0.75rem", marginTop: "0.75rem",
    background: "transparent", color: dark ? "#94a3b8" : "#64748b",
    border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
    borderRadius: "0.75rem", fontSize: "0.9rem", cursor: "pointer",
  };
  const errStyle = {
    marginTop: "0.75rem", color: "#ef4444", fontSize: "0.85rem", textAlign: "center",
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={card}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "1.5rem" }}>✈️</div>
            <div style={title}>Complete Payment</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
        </div>

        {/* Booking summary */}
        <div style={row}>
          <span style={label}>Booking Type</span>
          <span style={value}>{booking.type}</span>
        </div>
        <div style={row}>
          <span style={label}>Destination</span>
          <span style={value}>{booking.dest}</span>
        </div>
        <div style={row}>
          <span style={label}>Date</span>
          <span style={value}>{booking.date}</span>
        </div>

        <div style={divider} />

        <div style={totalRow}>
          <span style={totalLabel}>Total Amount</span>
          <span style={totalValue}>{fmt(booking.price)}</span>
        </div>

        <div style={{ marginTop: "0.5rem", ...row }}>
          <span style={label}>Payment Gateway</span>
          <span style={{ color: "#6366f1", fontWeight: 700, fontSize: "0.9rem" }}>Razorpay (Secure)</span>
        </div>

        <button style={btnPay} onClick={handlePay} disabled={loading}>
          {loading ? "Opening Payment..." : `Pay ${fmt(booking.price)}`}
        </button>

        <button style={btnCancel} onClick={onClose}>Cancel</button>

        {error && <div style={errStyle}>{error}</div>}

        <p style={{ textAlign: "center", color: dark ? "#475569" : "#94a3b8", fontSize: "0.75rem", marginTop: "1rem" }}>
          🔒 Payments are secured by Razorpay. Your card details are never stored.
        </p>
      </div>
    </div>
  );
}
