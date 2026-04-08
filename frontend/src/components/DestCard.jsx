import { useState } from "react";

const DestCard = ({ d, wishlist, toggleWishlist, showToast, setPage }) => {
  const [hovered, setHovered] = useState(false);

  // FIX: MongoDB uses _id not id
  const inWish = wishlist.includes(d._id);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { showToast(`Exploring ${d.city}!`, "info"); setPage("flights"); }}
      style={{
        borderRadius: 20, overflow: "hidden", cursor: "pointer", position: "relative",
        border: hovered ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered ? "0 20px 60px rgba(99,102,241,0.3), 0 0 0 1px rgba(99,102,241,0.3)" : "0 4px 20px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
        background: "#0d1b2a",
      }}
    >
      <div style={{ height: 220, overflow: "hidden" }}>
        <img src={d.img} alt={d.city} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.12)" : "scale(1)", transition: "transform 0.6s ease" }} />
        <div style={{ position: "absolute", inset: 0, height: 220, background: "linear-gradient(180deg, transparent 50%, rgba(5,10,20,0.9) 100%)" }} />
      </div>

      {/* Tag */}
      <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(99,102,241,0.8)", borderRadius: 8, padding: "4px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#fff", fontWeight: 600 }}>
        {d.tag}
      </div>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // FIX: pass d._id not d.id
          toggleWishlist(d._id);
          showToast(inWish ? "Removed from wishlist" : `${d.city} saved!`, inWish ? "error" : "success");
        }}
        style={{ position: "absolute", top: 14, right: 14, background: inWish ? "rgba(239,68,68,0.8)" : "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {inWish ? "♥" : "♡"}
      </button>

      {/* Info */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>{d.city}</h3>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>{d.country}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#64748b", margin: "0 0 2px" }}>from</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
              ₹{d.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: "10px 0 14px", lineHeight: 1.6 }}>{d.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {"★★★★★".split("").map((s, i) => (
              <span key={i} style={{ color: i < Math.floor(d.rating) ? "#f59e0b" : "#374151", fontSize: 13 }}>★</span>
            ))}
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#64748b", marginLeft: 4 }}>{d.rating}</span>
          </div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: hovered ? "#06b6d4" : "#64748b", transition: "color 0.2s" }}>Explore →</span>
        </div>
      </div>
    </div>
  );
};

export default DestCard;
