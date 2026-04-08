import DestCard from "../components/DestCard";

const WishlistPage = ({ wishlist, toggleWishlist, showToast, setPage, theme, destinations }) => {
  const isDark = theme === "dark";
  // FIX: use d._id instead of d.id
  const items = (destinations || []).filter((d) => wishlist.includes(d._id));

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>
          Your Wishlist ♥
        </h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", marginBottom: 40 }}>
          {items.length} {items.length === 1 ? "destination" : "destinations"} saved
        </p>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 64, marginBottom: 16 }}>✈️</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: isDark ? "#94a3b8" : "#475569" }}>No saved destinations yet</p>
            <button
              onClick={() => setPage("home")}
              style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 20 }}
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 28 }}>
            {items.map((d) => (
              // FIX: key uses _id instead of id
              <DestCard key={d._id} d={d} wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;