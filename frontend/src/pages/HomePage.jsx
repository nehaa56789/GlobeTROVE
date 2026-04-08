import { useState, useEffect, useRef } from "react";
import DestCard from "../components/DestCard";
import Skeleton from "../components/Skeleton";
import { destinationsAPI } from "../utils/api";

// ─── Hero ──────────────────────────────────────────────────────────────────────
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=90",
  "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1920&q=90",
];

function Hero({ setPage, showToast }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx((i) => (i + 1) % HERO_IMAGES.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ width: "100%", position: "relative", height: "100vh", minHeight: 700, overflow: "hidden" }}>
      {HERO_IMAGES.map((img, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", opacity: heroIdx === i ? 1 : 0, transition: "opacity 1.5s ease" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(5,10,30,0.8) 60%, rgba(5,10,30,1) 100%)" }} />

      {/* Dot indicators */}
      <div style={{ position: "absolute", bottom: 150, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 5 }}>
        {HERO_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setHeroIdx(i)} style={{ width: i === heroIdx ? 28 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === heroIdx ? "#6366f1" : "rgba(255,255,255,0.4)", transition: "all 0.4s ease" }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
        <div key={animKey} style={{ animation: "fadeUp .8s ease both" }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, letterSpacing: 4, textTransform: "uppercase", color: "#06b6d4", fontWeight: 600, marginBottom: 12, marginTop: 25 }}>✦ Discover Your Next Adventure ✦</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,8vw,96px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
            Explore<br />
            <span style={{ background: "linear-gradient(90deg,#6366f1,#06b6d4,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The World</span>
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 18, maxWidth: 540, margin: "0 auto 40px" }}>Curated journeys to the world's most extraordinary destinations, crafted for the discerning traveler.</p>
        </div>

        {/* Quick search */}
        <div style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "20px 24px", display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", justifyContent: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", maxWidth: 760, width: "100%" }}>
          {[
            { label: "From", val: from, set: setFrom, placeholder: "City or Airport" },
            { label: "To", val: to, set: setTo, placeholder: "Destination" },
            { label: "Date", val: date, set: setDate, placeholder: "Select date", type: "date" },
          ].map((f) => (
            <div key={f.label} style={{ flex: "1 1 160px", minWidth: 140 }}>
              <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#06b6d4", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type || "text"} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <button
            onClick={() => { showToast("Searching flights…", "info"); setTimeout(() => setPage("flights"), 600); }}
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "12px 28px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 20px rgba(99,102,241,0.5)", transition: "transform 0.2s, box-shadow 0.2s" }}
          >
            ✈ Search
          </button>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 16, marginTop: 132 }}>
          {[{ label: "🛫 Search Flights", page: "flights" }, { label: "🏨 Explore Hotels", page: "hotels" }].map((btn) => (
            <button key={btn.label} onClick={() => setPage(btn.page)} style={{ background: btn.label.includes("Flights") ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.1)", border: btn.label.includes("Hotels") ? "1px solid rgba(255,255,255,0.3)" : "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.2s" }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Destinations Section ──────────────────────────────────────────────────────
function DestinationsSection({ wishlist, toggleWishlist, showToast, setPage, theme }) {
  const [filter, setFilter] = useState("All");
  const [priceMax, setPriceMax] = useState(200000);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";
  const tags = ["All", "Romantic", "Tropical", "Culture", "Luxury", "Adventure", "Exotic", "Scenic"];

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filter !== "All") params.tag = filter;
        params.maxPrice = priceMax;
        const res = await destinationsAPI.getAll(params);
        setDestinations(res.data.data);
      } catch {
        showToast("Failed to load destinations", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [filter, priceMax]); // eslint-disable-line

  return (
    <section style={{ padding: "100px 24px 80px", background: isDark ? "#050a14" : "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#6366f1", fontWeight: 600, marginBottom: 12 }}>HAND-PICKED FOR YOU</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 16px" }}>Featured Destinations</h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>Journey to places that will reshape your understanding of beauty and wonder.</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 24, alignItems: "center" }}>
          {tags.map((t) => (
            <button key={t} onClick={() => setFilter(t)} style={{ background: filter === t ? "linear-gradient(135deg,#6366f1,#06b6d4)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: filter === t ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 20, padding: "8px 20px", cursor: "pointer", color: filter === t ? "#fff" : isDark ? "#94a3b8" : "#475569", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}>
              {t}
            </button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 8 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569" }}>Max ₹{priceMax.toLocaleString("en-IN")}</span>
            <input type="range" min={50000} max={200000} step={5000} value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} style={{ accentColor: "#6366f1", width: 120 }} />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 28 }}>
          {loading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: isDark ? "#0d1b2a" : "#fff" }}>
                  <Skeleton h={220} r={0} />
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    <Skeleton h={20} w="60%" /><Skeleton h={14} w="40%" /><Skeleton h={40} />
                  </div>
                </div>
              ))
            : destinations.map((d) => (
                <DestCard key={d.id} d={d} wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} />
              ))
          }
        </div>
      </div>
    </section>
  );
}

// ─── Popular Carousel ──────────────────────────────────────────────────────────
function PopularCarousel({ theme }) {
  const ref = useRef(null);
  const [popular, setPopular] = useState([]);
  const isDark = theme === "dark";

  useEffect(() => {
    destinationsAPI.getPopular()
      .then((res) => setPopular(res.data.data))
      .catch(() => {});
  }, []);

  const scroll = (dir) => { ref.current.scrollBy({ left: dir * 280, behavior: "smooth" }); };

  return (
    <section style={{ padding: "60px 0 80px", background: isDark ? "#080f1a" : "#f1f5f9", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: 0 }}>Popular Places</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {[-1, 1].map((d) => (
              <button key={d} onClick={() => scroll(d)} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", cursor: "pointer", color: "#6366f1", fontSize: 18 }}>
                {d === -1 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
        <div ref={ref} style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {popular.map((p) => (
            <div key={p.id} style={{ flexShrink: 0, width: 240, borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.querySelector("img").style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.querySelector("img").style.transform = "scale(1)")}>
              <img src={p.img} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover", transition: "transform 0.5s ease" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />
              <p style={{ position: "absolute", bottom: 16, left: 16, fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ─────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { val: "500+", label: "Destinations" }, { val: "2M+", label: "Happy Travelers" },
    { val: "98%", label: "Satisfaction" }, { val: "50+", label: "Airlines" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: "linear-gradient(135deg,#0f0c29,#1a0533,#0d1b4b)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, textAlign: "center" }}>
        {stats.map((s) => (
          <div key={s.label}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 900, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>{s.val}</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HomePage ──────────────────────────────────────────────────────────────────
const HomePage = ({ wishlist, toggleWishlist, showToast, setPage, theme }) => (
  <>
    <Hero setPage={setPage} showToast={showToast} />
    <DestinationsSection wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} theme={theme} />
    <PopularCarousel theme={theme} />
    <StatsSection />
  </>
);

export default HomePage;