import { useState, useEffect } from "react";
import { hotelsAPI } from "../utils/api";
import PaymentModal from "../components/PaymentModal";

function HotelCard({ h, showToast, theme, user, setPage, onBookingCreated }) {
  const [hov, setHov] = useState(false);
  const [booking, setBooking] = useState(false);
  const isDark = theme === "dark";

  const handleBook = async () => {
    if (!user) {
      showToast("Please sign in to book hotels", "error");
      setPage("auth");
      return;
    }
    setBooking(true);
    try {
      const res = await hotelsAPI.book(h._id);
      onBookingCreated(res.data.data); // opens PaymentModal
    } catch (err) {
      showToast(err.response?.data?.message || "Booking failed", "error");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "flex", gap: 0, borderRadius: 20, overflow: "hidden", background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${hov ? "rgba(99,102,241,0.4)" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, boxShadow: hov ? "0 12px 40px rgba(99,102,241,0.2)" : "none", transition: "all 0.3s", transform: hov ? "translateY(-4px)" : "none" }}
    >
      <div style={{ width: 180, flexShrink: 0, overflow: "hidden" }}>
        <img src={h.img} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.1)" : "scale(1)", transition: "transform 0.5s" }} />
      </div>
      <div style={{ padding: 24, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>{h.name}</h3>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>📍 {h.city} · {"★".repeat(h.stars)}</p>
          </div>
          <div style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", borderRadius: 10, padding: "6px 12px", height: "fit-content" }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", margin: 0 }}>{h.rating}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {h.amenities.map((a) => (
            <span key={a} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "3px 10px", color: "#a5b4fc" }}>{a}</span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#64748b", margin: "0 0 2px" }}>per night from</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
              ₹{h.price.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            onClick={handleBook}
            disabled={booking}
            style={{ background: booking ? "#334155" : "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, cursor: booking ? "not-allowed" : "pointer", opacity: booking ? 0.7 : 1 }}
          >
            {booking ? "Please wait..." : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

const HotelsPage = ({ showToast, theme, user, setPage }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("price");
  const [pendingBooking, setPendingBooking] = useState(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await hotelsAPI.getAll({ sort });
        setHotels(res.data.data);
      } catch {
        showToast("Failed to load hotels", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [sort]); // eslint-disable-line

  const handlePaymentSuccess = (confirmedBooking) => {
    setPendingBooking(null);
    showToast(`${confirmedBooking.dest} booked! 🏨 Payment successful.`, "success");
  };

  const handlePaymentClose = () => {
    setPendingBooking(null);
    showToast("Payment cancelled. Your booking is saved as Pending in My Trips.", "info");
  };

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>Find Hotels</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", marginBottom: 36 }}>Luxury stays at unbeatable prices</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 32, alignItems: "center" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569" }}>Sort by:</span>
          {["price", "rating"].map((s) => (
            <button key={s} onClick={() => setSort(s)} style={{ background: sort === s ? "linear-gradient(135deg,#6366f1,#06b6d4)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: "none", borderRadius: 20, padding: "7px 18px", cursor: "pointer", color: sort === s ? "#fff" : isDark ? "#94a3b8" : "#475569", fontFamily: "'Outfit',sans-serif", fontSize: 13, textTransform: "capitalize" }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b", textAlign: "center", padding: 40 }}>Loading hotels…</p>
        ) : hotels.length === 0 ? (
          <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b", textAlign: "center", padding: 40 }}>No hotels found.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(480px,1fr))", gap: 28 }}>
            {hotels.map((h) => (
              <HotelCard
                key={h._id}
                h={h}
                showToast={showToast}
                theme={theme}
                user={user}
                setPage={setPage}
                onBookingCreated={setPendingBooking}
              />
            ))}
          </div>
        )}
      </div>

      {/* Razorpay Payment Modal — opens automatically after booking created */}
      {pendingBooking && (
        <PaymentModal
          booking={pendingBooking}
          user={user}
          theme={theme}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
};

export default HotelsPage;
