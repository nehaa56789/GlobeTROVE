import { useState, useEffect } from "react";
import { bookingsAPI, authAPI } from "../utils/api";

const DashboardPage = ({ theme, user, setPage }) => {
  const isDark = theme === "dark";
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          bookingsAPI.getMine(),
          authAPI.getMe(),
        ]);
        setBookings(bookingsRes.data.data);
        setProfile(profileRes.data.user);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCancel = async (bookingId) => {
    try {
      await bookingsAPI.cancel(bookingId);
      setBookings((b) => b.map((bk) => bk.id === bookingId ? { ...bk, status: "Cancelled" } : bk));
    } catch {
      // silently fail
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 16 }}>Sign in to view your trips</p>
          <button onClick={() => setPage("auth")} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Sign In</button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Trips Taken", val: profile?.tripsCount ?? 0 },
    { label: "Countries", val: profile?.countriesCount ?? 0 },
    { label: "Miles Flown", val: profile?.milesFlown ?? 0 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#fff", fontWeight: 700 }}>
            {user.name[0]}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>Welcome, {user.name}</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b", margin: 0 }}>{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 40 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, padding: 24, textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>{s.val}</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 20 }}>Your Bookings</h2>
        {loading ? (
          <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b", textAlign: "center", padding: 40 }}>Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>✈️</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: isDark ? "#94a3b8" : "#475569" }}>No bookings yet — start exploring!</p>
            <button onClick={() => setPage("flights")} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "12px 24px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 16 }}>
              Search Flights
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {bookings.map((b) => (
              <div key={b.id} style={{ display: "flex", gap: 20, background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, overflow: "hidden" }}>
                <img src={b.img} alt={b.dest} style={{ width: 100, objectFit: "cover" }} />
                <div style={{ padding: "20px 20px 20px 0", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", margin: "0 0 4px" }}>{b.type}</p>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>{b.dest}</p>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>{b.date}</p>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span style={{ display: "inline-block", background: b.status === "Confirmed" ? "rgba(16,185,129,0.15)" : b.status === "Cancelled" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", border: `1px solid ${b.status === "Confirmed" ? "rgba(16,185,129,0.4)" : b.status === "Cancelled" ? "rgba(239,68,68,0.4)" : "rgba(245,158,11,0.4)"}`, borderRadius: 20, padding: "4px 14px", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: b.status === "Confirmed" ? "#10b981" : b.status === "Cancelled" ? "#ef4444" : "#f59e0b" }}>
                      {b.status}
                    </span>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>₹{b.price.toLocaleString("en-IN")}</p>
                    {b.status !== "Cancelled" && (
                      <button onClick={() => handleCancel(b.id)} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, padding: "4px 12px", cursor: "pointer", color: "#ef4444", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;