import { useState, useEffect } from "react";
import { flightsAPI } from "../utils/api";
import PaymentModal from "../components/PaymentModal";

function FlightCard({ f, showToast, theme, user, setPage, onBookingCreated }) {
  const [hovered, setHov] = useState(false);
  const [booking, setBooking] = useState(false);
  const isDark = theme === "dark";

  const handleBook = async () => {
    if (!user) {
      showToast("Please sign in to book flights", "error");
      setPage("auth");
      return;
    }
    setBooking(true);
    try {
      const res = await flightsAPI.book(f._id);
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
      style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${hovered ? "rgba(99,102,241,0.4)" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr auto 1fr auto auto", alignItems: "center", gap: 20, boxShadow: hovered ? "0 8px 40px rgba(99,102,241,0.2)" : "none", transition: "all 0.3s ease" }}
    >
      <div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>From</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 2px" }}>{f.dep}</p>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: isDark ? "#94a3b8" : "#475569", margin: 0 }}>{f.from}</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#6366f1", marginBottom: 4 }}>{f.dur}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#6366f1,#06b6d4)", position: "relative" }}>
            {f.stops > 0 && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />}
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4" }} />
        </div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#64748b", marginTop: 4 }}>{f.stops === 0 ? "Direct" : `${f.stops} stop`}</p>
      </div>
      <div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>To</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 2px" }}>{f.arr}</p>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: isDark ? "#94a3b8" : "#475569", margin: 0 }}>{f.to}</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#64748b", marginBottom: 4 }}>{f.airline}</p>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, background: "rgba(99,102,241,0.15)", borderRadius: 6, padding: "3px 10px", color: "#a5b4fc" }}>{f.class}</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
          ₹{f.price.toLocaleString("en-IN")}
        </p>
        <button
          onClick={handleBook}
          disabled={booking}
          style={{ background: booking ? "#334155" : "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, cursor: booking ? "not-allowed" : "pointer", opacity: booking ? 0.7 : 1 }}
        >
          {booking ? "Please wait..." : "Book Now"}
        </button>
      </div>
    </div>
  );
}

const FlightsPage = ({ showToast, theme, user, setPage }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("price");
  const [classFilter, setClassFilter] = useState("All");
  const [stopsFilter, setStopsFilter] = useState("All");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [pendingBooking, setPendingBooking] = useState(null);
  const isDark = theme === "dark";

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (classFilter !== "All") params.class = classFilter;
      if (stopsFilter !== "All") params.stops = stopsFilter;
      if (fromInput) params.from = fromInput;
      if (toInput) params.to = toInput;
      const res = await flightsAPI.getAll(params);
      setFlights(res.data.data);
    } catch {
      showToast("Failed to load flights", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFlights(); }, [sort, classFilter, stopsFilter]); // eslint-disable-line

  const handlePaymentSuccess = (confirmedBooking) => {
    setPendingBooking(null);
    showToast(`Flight to ${confirmedBooking.dest} confirmed! ✈️ Payment successful.`, "success");
  };

  const handlePaymentClose = () => {
    setPendingBooking(null);
    showToast("Payment cancelled. Your booking is saved as Pending in My Trips.", "info");
  };

  const inputStyle = {
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 10, padding: "10px 14px", color: isDark ? "#f1f5f9" : "#0f172a",
    fontFamily: "'Outfit',sans-serif", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>Search Flights</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", marginBottom: 36 }}>Find the best deals on flights worldwide</p>

        {/* Search bar */}
        <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 20, padding: 24, marginBottom: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 16, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#6366f1", marginBottom: 6 }}>From</label>
            <input value={fromInput} onChange={(e) => setFromInput(e.target.value)} placeholder="e.g. Mumbai" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#6366f1", marginBottom: 6 }}>To</label>
            <input value={toInput} onChange={(e) => setToInput(e.target.value)} placeholder="e.g. Paris" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#6366f1", marginBottom: 6 }}>Depart</label>
            <input type="date" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#6366f1", marginBottom: 6 }}>Return</label>
            <input type="date" style={inputStyle} />
          </div>
          <button onClick={fetchFlights} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "12px 24px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
            Search
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569" }}>Sort by:</span>
          {["price", "duration"].map((s) => (
            <button key={s} onClick={() => setSort(s)} style={{ background: sort === s ? "linear-gradient(135deg,#6366f1,#06b6d4)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: "none", borderRadius: 20, padding: "7px 18px", cursor: "pointer", color: sort === s ? "#fff" : isDark ? "#94a3b8" : "#475569", fontFamily: "'Outfit',sans-serif", fontSize: 13, textTransform: "capitalize" }}>
              {s}
            </button>
          ))}
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569", marginLeft: 8 }}>Stops:</span>
          {["All", "Direct"].map((s) => (
            <button key={s} onClick={() => setStopsFilter(s)} style={{ background: stopsFilter === s ? "linear-gradient(135deg,#6366f1,#06b6d4)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: "none", borderRadius: 20, padding: "7px 18px", cursor: "pointer", color: stopsFilter === s ? "#fff" : isDark ? "#94a3b8" : "#475569", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b", textAlign: "center", padding: 40 }}>Loading flights…</p>
        ) : flights.length === 0 ? (
          <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b", textAlign: "center", padding: 40 }}>No flights found. Try different filters.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {flights.map((f) => (
              <FlightCard
                key={f._id}
                f={f}
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

export default FlightsPage;
