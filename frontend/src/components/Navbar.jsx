import { useState, useEffect } from "react";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "flights", label: "Flights" },
  { id: "hotels", label: "Hotels" },
  { id: "map", label: "Explore" },
  { id: "dashboard", label: "My Trips" },
];

const Navbar = ({ page, setPage, theme, toggleTheme, user, logout, wishlistCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === "dark";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // ── Admin navbar — completely different layout ─────────────────────────────
  if (isAdmin) {
    return (
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(5,10,20,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(239,68,68,0.2)", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo — clicking goes to admin, not home */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlobeTrove</span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#ef4444", marginLeft: 10, fontWeight: 700 }}>Admin</span>
            </div>
          </div>

          {/* Center — admin badge only */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 20, padding: "6px 18px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", boxShadow: "0 0 6px #ef4444" }} />
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: "#ef4444", letterSpacing: 1 }}>ADMIN PANEL</span>
            </div>
          </div>

          {/* Right — user info + back to site + logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#ef4444,#dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>
                {user.name[0]}
              </div>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#94a3b8" }}>{user.name}</span>
            </div>
            <button
              onClick={() => setPage("home")}
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", color: "#a5b4fc", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500 }}
            >
              ← Back to Site
            </button>
            <button
              onClick={logout}
              style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", color: "#ef4444", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // ── Regular user navbar ───────────────────────────────────────────────────
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? (isDark ? "rgba(5,10,20,0.85)" : "rgba(255,255,255,0.85)") : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)"}` : "none",
      transition: "all 0.4s ease", padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlobeTrove</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="nav-links">
          {navLinks.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: page === l.id ? "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(6,182,212,0.2))" : "transparent",
              border: page === l.id ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
              color: page === l.id ? "#a5b4fc" : isDark ? "#94a3b8" : "#475569",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
            }}>{l.label}</button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("wishlist")} style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", fontSize: 20, color: isDark ? "#94a3b8" : "#475569" }}>
            ♡
            {wishlistCount > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", borderRadius: "50%", width: 16, height: 16, fontSize: 10, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>
                {wishlistCount}
              </span>
            )}
          </button>
          <button onClick={toggleTheme} style={{ background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 16, transition: "all 0.2s" }}>
            {isDark ? "☀️" : "🌙"}
          </button>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>
                {user.name[0]}
              </div>
              <button onClick={logout} style={{ background: "transparent", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: isDark ? "#94a3b8" : "#475569", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setPage("auth")} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(99,102,241,0.4)", transition: "all 0.2s" }}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;