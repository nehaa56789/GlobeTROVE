const Footer = ({ theme }) => {
  const isDark = theme === "dark";
  return (
    <footer style={{ background: isDark ? "#030710" : "#0f172a", padding: "60px 24px 30px", borderTop: "1px solid rgba(99,102,241,0.2)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈</div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlobeTrove</span>
            </div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 280 }}>
              Curated journeys to the world's most extraordinary places, crafted for the discerning explorer.
            </p>
          </div>
          {[
            { title: "Explore", links: ["Destinations", "Flights", "Hotels", "Map"] },
            { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
            { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#6366f1", marginBottom: 16 }}>{col.title}</p>
              {col.links.map((l) => (
                <p key={l} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 12px", cursor: "pointer" }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>© 2025 GlobeTrove. All rights reserved.</p>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>Made with ♥ for wanderers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;