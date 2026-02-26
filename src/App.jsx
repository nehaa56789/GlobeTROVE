import { useState, useEffect, useRef, useCallback } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { id: 1, city: "Santorini", country: "Greece", desc: "Iconic blue domes perched above the sparkling Aegean Sea.", price: 108000, rating: 4.9, img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", tag: "Romantic" },
  { id: 2, city: "Bali", country: "Indonesia", desc: "Lush rice terraces, ancient temples and legendary sunsets.", price: 74900, rating: 4.8, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tag: "Tropical" },
  { id: 3, city: "Tokyo", country: "Japan", desc: "Where neon-lit modernity meets centuries of tradition.", price: 124900, rating: 4.9, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", tag: "Culture" },
  { id: 4, city: "Amalfi Coast", country: "Italy", desc: "Pastel villages cascade down dramatic Mediterranean cliffs.", price: 98900, rating: 4.7, img: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=800&q=80", tag: "Scenic" },
  { id: 5, city: "Maldives", country: "Indian Ocean", desc: "Crystal-clear lagoons with overwater bungalows.", price: 191500, rating: 5.0, img: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80", tag: "Luxury" },
  { id: 6, city: "Patagonia", country: "Argentina", desc: "Towering granite spires above vast wind-swept steppes.", price: 149900, rating: 4.8, img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", tag: "Adventure" },
  { id: 7, city: "Marrakech", country: "Morocco", desc: "Labyrinthine medinas alive with color, spice and sound.", price: 66500, rating: 4.6, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tag: "Exotic" },
  { id: 8, city: "Kyoto", country: "Japan", desc: "Ethereal bamboo groves and timeless zen gardens.", price: 116500, rating: 4.9, img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", tag: "Culture" },
];

const POPULAR = [
  { id: 1, name: "Paris", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80" },
  { id: 2, name: "New York", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80" },
  { id: 3, name: "Dubai", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" },
  { id: 4, name: "Sydney", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80" },
  { id: 5, name: "Prague", img: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=80" },
  { id: 6, name: "Cape Town", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80" },
  { id: 7, name: "Lisbon", img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80" },
  { id: 8, name: "Bangkok", img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80" },
];

const FLIGHTS = [
  { id: 1, from: "Mumbai", to: "Paris", airline: "Air France", dep: "08:30", arr: "22:15", dur: "7h 45m", price: 54000, stops: 0, class: "Economy" },
  { id: 2, from: "Mumbai", to: "Paris", airline: "IndiGo", dep: "11:00", arr: "01:30+1", dur: "8h 30m", price: 49000, stops: 1, class: "Economy" },
  { id: 3, from: "Delhi", to: "Tokyo", airline: "ANA", dep: "14:00", arr: "18:20+1", dur: "9h 20m", price: 91500, stops: 0, class: "Business" },
  { id: 4, from: "Bangalore", to: "Bali", airline: "Singapore Air", dep: "00:30", arr: "11:15+1", dur: "7h 45m", price: 73200, stops: 1, class: "Economy" },
];

const HOTELS = [
  { id: 1, name: "The Azure Palace", city: "Santorini", stars: 5, price: 35000, rating: 9.6, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80", amenities: ["Pool","Spa","Breakfast","Sea View"] },
  { id: 2, name: "Ubud Jungle Retreat", city: "Bali", stars: 4, price: 15000, rating: 9.2, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", amenities: ["Pool","Yoga","Garden","Bar"] },
  { id: 3, name: "Shinjuku Grand", city: "Tokyo", stars: 5, price: 25800, rating: 9.4, img: "https://images.unsplash.com/photo-1540304453527-62f979142a17?w=800&q=80", amenities: ["Gym","Restaurant","WiFi","City View"] },
  { id: 4, name: "Overwater Villa", city: "Maldives", stars: 5, price: 70800, rating: 9.8, img: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80", amenities: ["Private Pool","Spa","Butler","Beach"] },
];

const BOOKINGS = [
  { id: 1, type: "Flight", dest: "Paris, France", date: "Mar 15, 2025", status: "Confirmed", price: 54000, img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&q=80" },
  { id: 2, type: "Hotel", dest: "The Azure Palace", date: "Apr 2–7, 2025", status: "Pending", price: 175000, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&q=80" },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
let toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "linear-gradient(135deg,#10b981,#059669)" : t.type === "error" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#6366f1,#4f46e5)",
          color: "#fff", padding: "14px 20px", borderRadius: 12, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "slideIn .3s ease",
          display: "flex", alignItems: "center", gap: 10, minWidth: 260,
        }}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton({ h = 20, w = "100%", r = 8 }) {
  return (
    <div style={{ height: h, width: w, borderRadius: r, background: "linear-gradient(90deg,#1e2a3a 25%,#243348 50%,#1e2a3a 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, theme, toggleTheme, user, setUser, wishlistCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" }, { id: "flights", label: "Flights" },
    { id: "hotels", label: "Hotels" }, { id: "map", label: "Explore" },
    { id: "dashboard", label: "My Trips" },
  ];

  const isDark = theme === "dark";

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

        {/* Links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="nav-links">
          {navLinks.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: page === l.id ? "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(6,182,212,0.2))" : "transparent",
              border: page === l.id ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
              color: page === l.id ? "#a5b4fc" : (isDark ? "#94a3b8" : "#475569"),
              padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
            }}>{l.label}</button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Wishlist */}
          <button onClick={() => setPage("wishlist")} style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", fontSize: 20, color: isDark ? "#94a3b8" : "#475569" }}>
            ♡
            {wishlistCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", borderRadius: "50%", width: 16, height: 16, fontSize: 10, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>{wishlistCount}</span>}
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} style={{
            background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "8px 12px",
            cursor: "pointer", fontSize: 16, transition: "all 0.2s",
          }}>{isDark ? "☀️" : "🌙"}</button>

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14 }}>{user.name[0]}</div>
              <button onClick={() => setUser(null)} style={{ background: "transparent", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: isDark ? "#94a3b8" : "#475569", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setPage("auth")} style={{
              background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 8,
              padding: "10px 20px", cursor: "pointer", color: "#fff", fontFamily: "'Outfit',sans-serif",
              fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(99,102,241,0.4)", transition: "all 0.2s",
            }}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=90",
  "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1920&q=90",
];

function Hero({ setPage, showToast }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [from, setFrom] = useState(""); const [to, setTo] = useState(""); const [date, setDate] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx(i => (i + 1) % HERO_IMAGES.length);
      setAnimKey(k => k + 1);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ width: "100%", position: "relative", height: "100vh", minHeight: 700, overflow: "hidden" }}>
      {/* BG */}
      {HERO_IMAGES.map((img, i) => (
        <div key={i} style={{
          
          position: "absolute", inset: 0,
          backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center",
          opacity: heroIdx === i ? 1 : 0, transition: "opacity 1.5s ease",
        }} />
      ))}
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(5,10,30,0.8) 60%, rgba(5,10,30,1) 100%)" }} />

      {/* Dot indicators */}
      <div style={{ position: "absolute", bottom: 150, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 5 }}>
        {HERO_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setHeroIdx(i)} style={{
            width: i === heroIdx ? 28 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer",
            background: i === heroIdx ? "#6366f1" : "rgba(255,255,255,0.4)", transition: "all 0.4s ease",
          }} />
        ))}
      </div>

      {/* Content */}
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
        <div style={{
          background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "20px 24px",
          display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", justifyContent: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)", maxWidth: 760, width: "100%", 
        }}>
          {[{ label: "From", val: from, set: setFrom, placeholder: "City or Airport" },
            { label: "To", val: to, set: setTo, placeholder: "Destination" },
            { label: "Date", val: date, set: setDate, placeholder: "Select date", type: "date" }].map(f => (
            <div key={f.label} style={{ flex: "1 1 160px", minWidth: 140 }}>
              <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#06b6d4", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type || "text"} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{
                width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10, padding: "11px 14px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 15,
                outline: "none", boxSizing: "border-box",
              }} />
            </div>
          ))}
          <button onClick={() => { showToast("Searching flights…", "info"); setTimeout(() => setPage("flights"), 600); }} style={{
            background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12,
            padding: "12px 28px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700,
            fontSize: 15, cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(99,102,241,0.6)"; }}
          onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 4px 20px rgba(99,102,241,0.5)"; }}>
            ✈ Search
          </button>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 16, marginTop: 132 }}>
          {[{ label: "🛫 Search Flights", page: "flights" }, { label: "🏨 Explore Hotels", page: "hotels" }].map(btn => (
            <button key={btn.label} onClick={() => setPage(btn.page)} style={{
              background: btn.label.includes("Flights") ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.1)",
              border: btn.label.includes("Hotels") ? "1px solid rgba(255,255,255,0.3)" : "none",
              borderRadius: 12, padding: "14px 28px", color: "#fff",
              fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer",
              backdropFilter: "blur(10px)", transition: "all 0.2s",
            }}>{btn.label}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DESTINATION CARD ─────────────────────────────────────────────────────────
function DestCard({ d, wishlist, toggleWishlist, showToast, setPage }) {
  const [hovered, setHovered] = useState(false);
  const inWish = wishlist.includes(d.id);
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
      }}>
      <div style={{ height: 220, overflow: "hidden" }}>
        <img src={d.img} alt={d.city} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.12)" : "scale(1)", transition: "transform 0.6s ease" }} />
        <div style={{ position: "absolute", inset: 0, height: 220, background: "linear-gradient(180deg, transparent 50%, rgba(5,10,20,0.9) 100%)" }} />
      </div>
      {/* Tag */}
      <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(99,102,241,0.8)", borderRadius: 8, padding: "4px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#fff", fontWeight: 600 }}>{d.tag}</div>
      {/* Wishlist */}
      <button onClick={e => { e.stopPropagation(); toggleWishlist(d.id); showToast(inWish ? "Removed from wishlist" : `${d.city} saved!`, inWish ? "error" : "success"); }} style={{
        position: "absolute", top: 14, right: 14, background: inWish ? "rgba(239,68,68,0.8)" : "rgba(0,0,0,0.5)",
        border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{inWish ? "♥" : "♡"}</button>
      {/* Info */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 2px" }}>{d.city}</h3>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>{d.country}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#64748b", margin: "0 0 2px" }}>from</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>₹{d.price.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: "10px 0 14px", lineHeight: 1.6 }}>{d.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {"★".repeat(5).split("").map((s, i) => (
              <span key={i} style={{ color: i < Math.floor(d.rating) ? "#f59e0b" : "#374151", fontSize: 13 }}>★</span>
            ))}
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#64748b", marginLeft: 4 }}>{d.rating}</span>
          </div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: hovered ? "#06b6d4" : "#64748b", transition: "color 0.2s" }}>Explore →</span>
        </div>
      </div>
    </div>
  );
}

// ─── DESTINATIONS SECTION ─────────────────────────────────────────────────────
function DestinationsSection({ wishlist, toggleWishlist, showToast, setPage, theme }) {
  const [filter, setFilter] = useState("All");
  const [priceMax, setPriceMax] = useState(200000);
  const [loading, setLoading] = useState(true);
  const tags = ["All", "Romantic", "Tropical", "Culture", "Luxury", "Adventure", "Exotic", "Scenic"];
  const isDark = theme === "dark";

  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);

  const filtered = DESTINATIONS.filter(d => (filter === "All" || d.tag === filter) && d.price <= priceMax);

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
          {tags.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              background: filter === t ? "linear-gradient(135deg,#6366f1,#06b6d4)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
              border: filter === t ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 20, padding: "8px 20px", cursor: "pointer",
              color: filter === t ? "#fff" : (isDark ? "#94a3b8" : "#475569"),
              fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
            }}>{t}</button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 8 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569" }}>Max ₹{priceMax.toLocaleString("en-IN")}</span>
            <input type="range" min={50000} max={200000} step={5000} value={priceMax} onChange={e => setPriceMax(+e.target.value)}
              style={{ accentColor: "#6366f1", width: 120 }} />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 28 }}>
          {loading
            ? Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: isDark ? "#0d1b2a" : "#fff" }}>
                <Skeleton h={220} r={0} /><div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Skeleton h={20} w="60%" /><Skeleton h={14} w="40%" /><Skeleton h={40} />
                </div>
              </div>
            ))
            : filtered.map(d => <DestCard key={d.id} d={d} wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} />)
          }
        </div>
      </div>
    </section>
  );
}

// ─── POPULAR CAROUSEL ─────────────────────────────────────────────────────────
function PopularCarousel({ theme }) {
  const ref = useRef(null);
  const isDark = theme === "dark";
  const scroll = dir => { ref.current.scrollBy({ left: dir * 280, behavior: "smooth" }); };

  return (
    <section style={{ padding: "60px 0 80px", background: isDark ? "#080f1a" : "#f1f5f9", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: 0 }}>Popular Places</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {[-1, 1].map(d => (
              <button key={d} onClick={() => scroll(d)} style={{
                width: 44, height: 44, borderRadius: "50%", background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)", cursor: "pointer", color: "#6366f1", fontSize: 18,
              }}>{d === -1 ? "←" : "→"}</button>
            ))}
          </div>
        </div>
        <div ref={ref} style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {POPULAR.map(p => (
            <div key={p.id} style={{ flexShrink: 0, width: 240, borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.querySelector("img").style.transform = "scale(1.1)"}
              onMouseLeave={e => e.currentTarget.querySelector("img").style.transform = "scale(1)"}>
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

// ─── STATS SECTION ────────────────────────────────────────────────────────────
function StatsSection({ theme }) {
  const isDark = theme === "dark";
  const stats = [
    { val: "500+", label: "Destinations" }, { val: "2M+", label: "Happy Travelers" },
    { val: "98%", label: "Satisfaction" }, { val: "50+", label: "Airlines" },
  ];
  return (
    <section style={{ padding: "80px 24px", background: "linear-gradient(135deg,#0f0c29,#1a0533,#0d1b4b)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, textAlign: "center" }}>
        {stats.map(s => (
          <div key={s.label}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 900, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>{s.val}</p>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ wishlist, toggleWishlist, showToast, setPage, theme }) {
  return (
    <>
      <Hero setPage={setPage} showToast={showToast} />
      <DestinationsSection wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} theme={theme} />
      <PopularCarousel theme={theme} />
      <StatsSection theme={theme} />
    </>
  );
}

// ─── FLIGHTS PAGE ─────────────────────────────────────────────────────────────
function FlightsPage({ showToast, theme }) {
  const [sort, setSort] = useState("price");
  const [classFilter, setClassFilter] = useState("All");
  const [stopsFilter, setStopsFilter] = useState("All");
  const isDark = theme === "dark";

  const sorted = [...FLIGHTS]
    .filter(f => classFilter === "All" || f.class === classFilter)
    .filter(f => stopsFilter === "All" || (stopsFilter === "Direct" && f.stops === 0))
    .sort((a, b) => sort === "price" ? a.price - b.price : a.dur.localeCompare(b.dur));

  const inputStyle = {
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 10, padding: "10px 14px", color: isDark ? "#f1f5f9" : "#0f172a",
    fontFamily: "'Outfit',sans-serif", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", paddingTop: 100, padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>Search Flights</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", marginBottom: 36 }}>Find the best deals on flights worldwide</p>

        {/* Search bar */}
        <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 20, padding: 24, marginBottom: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 16, alignItems: "end" }}>
          {[{ label: "From", ph: "e.g. New York" }, { label: "To", ph: "e.g. Paris" }, { label: "Depart", ph: "", type: "date" }, { label: "Return", ph: "", type: "date" }].map(f => (
            <div key={f.label}>
              <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#6366f1", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type || "text"} placeholder={f.ph} style={inputStyle} />
            </div>
          ))}
          <button onClick={() => showToast("Searching available flights…", "info")} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "12px 24px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>Search</button>
        </div>

        {/* Sort & filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569" }}>Sort by:</span>
          {["price", "duration"].map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              background: sort === s ? "linear-gradient(135deg,#6366f1,#06b6d4)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
              border: "none", borderRadius: 20, padding: "7px 18px", cursor: "pointer",
              color: sort === s ? "#fff" : (isDark ? "#94a3b8" : "#475569"), fontFamily: "'Outfit',sans-serif", fontSize: 13, textTransform: "capitalize",
            }}>{s}</button>
          ))}
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569", marginLeft: 8 }}>Stops:</span>
          {["All", "Direct"].map(s => (
            <button key={s} onClick={() => setStopsFilter(s)} style={{
              background: stopsFilter === s ? "linear-gradient(135deg,#6366f1,#06b6d4)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
              border: "none", borderRadius: 20, padding: "7px 18px", cursor: "pointer",
              color: stopsFilter === s ? "#fff" : (isDark ? "#94a3b8" : "#475569"), fontFamily: "'Outfit',sans-serif", fontSize: 13,
            }}>{s}</button>
          ))}
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sorted.map(f => (
            <FlightCard key={f.id} f={f} showToast={showToast} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FlightCard({ f, showToast, theme }) {
  const [hovered, setHov] = useState(false);
  const isDark = theme === "dark";
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
      border: `1px solid ${hovered ? "rgba(99,102,241,0.4)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
      borderRadius: 16, padding: "20px 24px",
      display: "grid", gridTemplateColumns: "1fr auto 1fr auto auto",
      alignItems: "center", gap: 20,
      boxShadow: hovered ? "0 8px 40px rgba(99,102,241,0.2)" : "none",
      transition: "all 0.3s ease",
    }}>
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
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>₹{f.price.toLocaleString("en-IN")}</p>
        <button onClick={() => showToast(`Flight to ${f.to} booked! ✈`, "success")} style={{
          background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 10,
          padding: "10px 20px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>Book Now</button>
      </div>
    </div>
  );
}

// ─── HOTELS PAGE ──────────────────────────────────────────────────────────────
function HotelsPage({ showToast, theme }) {
  const [sort, setSort] = useState("price");
  const isDark = theme === "dark";
  const sorted = [...HOTELS].sort((a, b) => sort === "price" ? a.price - b.price : b.rating - a.rating);

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>Find Hotels</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", marginBottom: 36 }}>Luxury stays at unbeatable prices</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 32, alignItems: "center" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: isDark ? "#64748b" : "#475569" }}>Sort by:</span>
          {["price", "rating"].map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              background: sort === s ? "linear-gradient(135deg,#6366f1,#06b6d4)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
              border: "none", borderRadius: 20, padding: "7px 18px", cursor: "pointer",
              color: sort === s ? "#fff" : (isDark ? "#94a3b8" : "#475569"), fontFamily: "'Outfit',sans-serif", fontSize: 13, textTransform: "capitalize",
            }}>{s}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(480px,1fr))", gap: 28 }}>
          {sorted.map(h => <HotelCard key={h.id} h={h} showToast={showToast} theme={theme} />)}
        </div>
      </div>
    </div>
  );
}

function HotelCard({ h, showToast, theme }) {
  const [hov, setHov] = useState(false);
  const isDark = theme === "dark";
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: "flex", gap: 0, borderRadius: 20, overflow: "hidden",
      background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
      border: `1px solid ${hov ? "rgba(99,102,241,0.4)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
      boxShadow: hov ? "0 12px 40px rgba(99,102,241,0.2)" : "none",
      transition: "all 0.3s", transform: hov ? "translateY(-4px)" : "none",
    }}>
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
          {h.amenities.map(a => <span key={a} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "3px 10px", color: "#a5b4fc" }}>{a}</span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#64748b", margin: "0 0 2px" }}>per night from</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>₹{h.price.toLocaleString("en-IN")}</p>
          </div>
          <button onClick={() => showToast(`${h.name} booked! 🏨`, "success")} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Book</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAP PAGE ─────────────────────────────────────────────────────────────────
function MapPage({ theme }) {
  const [selected, setSelected] = useState(null);
  const isDark = theme === "dark";
  const pins = [
    { id: 1, name: "Santorini", x: 52, y: 42, dest: DESTINATIONS[0] },
    { id: 2, name: "Tokyo", x: 80, y: 38, dest: DESTINATIONS[2] },
    { id: 3, name: "Bali", x: 76, y: 60, dest: DESTINATIONS[1] },
    { id: 4, name: "Maldives", x: 65, y: 58, dest: DESTINATIONS[4] },
    { id: 5, name: "Patagonia", x: 30, y: 78, dest: DESTINATIONS[5] },
    { id: 6, name: "Marrakech", x: 45, y: 45, dest: DESTINATIONS[6] },
    { id: 7, name: "Amalfi", x: 50, y: 40, dest: DESTINATIONS[3] },
  ];

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: "70vh", minHeight: 500, }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>Interactive Map</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", marginBottom: 36 }}>Click a pin to discover destinations</p>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: 24 }}>
          {/* Map */}
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
            <img src="https://plus.unsplash.com/premium_photo-1712737938807-ecc2650279fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z29vZ2xlJTIwbWFwJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D" alt="World Map" style={{ width: "100%", display: "block", filter: isDark ? "saturate(0.6) brightness(0.5) hue-rotate(220deg)" : "saturate(0.8)" }} />
            <div style={{ position: "absolute", inset: 0, background: isDark ? "rgba(5,10,30,0.4)" : "transparent" }} />
            {pins.map(pin => (
              <button key={pin.id} onClick={() => setSelected(pin.dest)} style={{
                position: "absolute", left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-50%)",
                background: selected?.id === pin.dest.id ? "#6366f1" : "rgba(99,102,241,0.8)",
                border: "2px solid #fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
                boxShadow: "0 0 0 4px rgba(99,102,241,0.3)", animation: "pulse 2s infinite",
                fontSize: 12, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              }}>📍</button>
            ))}
          </div>

          {/* Detail card */}
          {selected && (
            <div style={{ borderRadius: 24, overflow: "hidden", background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, animation: "fadeUp .4s ease" }}>
              <img src={selected.img} alt={selected.city} style={{ width: "100%", height: 200, objectFit: "cover" }} />
              <div style={{ padding: 24 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>{selected.city}</h2>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: "0 0 16px" }}>{selected.country}</p>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: isDark ? "#94a3b8" : "#475569", lineHeight: 1.7, margin: "0 0 20px" }}>{selected.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#64748b", margin: "0 0 2px" }}>Starting from</p>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>₹{selected.price.toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 10, padding: "8px 16px", cursor: "pointer", color: isDark ? "#94a3b8" : "#475569", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>Close ×</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ theme, user, setPage }) {
  const isDark = theme === "dark";
  if (!user) return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 16 }}>Sign in to view your trips</p>
        <button onClick={() => setPage("auth")} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Sign In</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#fff", fontWeight: 700 }}>{user.name[0]}</div>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>Welcome, {user.name}</h1>
            <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b", margin: 0 }}>{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 40 }}>
          {[{ label: "Trips Taken", val: 7 }, { label: "Countries", val: 14 }, { label: "Miles Flown", val: "23,450" }].map(s => (
            <div key={s.label} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, padding: 24, textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>{s.val}</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 20 }}>Your Bookings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {BOOKINGS.map(b => (
            <div key={b.id} style={{ display: "flex", gap: 20, background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, overflow: "hidden" }}>
              <img src={b.img} alt={b.dest} style={{ width: 100, objectFit: "cover" }} />
              <div style={{ padding: "20px 20px 20px 0", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", margin: "0 0 4px" }}>{b.type}</p>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>{b.dest}</p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#64748b", margin: 0 }}>{b.date}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ display: "inline-block", background: b.status === "Confirmed" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", border: `1px solid ${b.status === "Confirmed" ? "rgba(16,185,129,0.4)" : "rgba(245,158,11,0.4)"}`, borderRadius: 20, padding: "4px 14px", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: b.status === "Confirmed" ? "#10b981" : "#f59e0b", marginBottom: 8 }}>{b.status}</span>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>₹{b.price.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ────────────────────────────────────────────────────────────
function WishlistPage({ wishlist, toggleWishlist, showToast, setPage, theme }) {
  const isDark = theme === "dark";
  const items = DESTINATIONS.filter(d => wishlist.includes(d.id));
  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", padding: "100px 24px 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", marginBottom: 8 }}>Your Wishlist ♥</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: isDark ? "#64748b" : "#475569", marginBottom: 40 }}>{items.length} {items.length === 1 ? "destination" : "destinations"} saved</p>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 64, marginBottom: 16 }}>✈️</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: isDark ? "#94a3b8" : "#475569" }}>No saved destinations yet</p>
            <button onClick={() => setPage("home")} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 20 }}>Explore Destinations</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 28 }}>
            {items.map(d => <DestCard key={d.id} d={d} wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ setUser, showToast, setPage, theme }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const isDark = theme === "dark";

  const inputStyle = {
    width: "100%", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, borderRadius: 12,
    padding: "14px 16px", color: isDark ? "#f1f5f9" : "#0f172a", fontFamily: "'Outfit',sans-serif",
    fontSize: 15, outline: "none", boxSizing: "border-box", display: "block",
  };

  const handle = () => {
    if (!email || !pass || (mode === "signup" && !name)) { showToast("Please fill all fields", "error"); return; }
    const user = { name: name || email.split("@")[0], email };
    setUser(user);
    showToast(`Welcome${mode === "signup" ? "" : " back"}, ${user.name}! 🎉`, "success");
    setPage("dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: 440, width: "100%", background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 24, padding: 40, backdropFilter: "blur(20px)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✈</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>{mode === "login" ? "Welcome Back" : "Join GlobeTrove"}</h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>{mode === "login" ? "Sign in to access your trips" : "Start your journey today"}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <div>
              <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
            </div>
          )}
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@globetrove.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </div>
          <button onClick={handle} style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "16px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)", marginTop: 8 }}>
            {mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", marginTop: 24 }}>
          {mode === "login" ? "Don't have an account? " : "Already have one? "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontWeight: 600, fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ theme }) {
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
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 280 }}>Curated journeys to the world's most extraordinary places, crafted for the discerning explorer.</p>
          </div>
          {[{ title: "Explore", links: ["Destinations", "Flights", "Hotels", "Map"] },
            { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
            { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] }].map(col => (
            <div key={col.title}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#6366f1", marginBottom: 16 }}>{col.title}</p>
              {col.links.map(l => <p key={l} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 12px", cursor: "pointer" }}>{l}</p>)}
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
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Outfit', sans-serif; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #050a14; }
    ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 3px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); } 50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); } }
    .nav-links { display: flex; }
    input::placeholder { color: rgba(255,255,255,0.3); }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.5); }
    @media (max-width: 768px) {
      .nav-links { display: none; }
    }
  `}</style>
);

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const { toasts, show: showToast } = useToast();

  const toggleWishlist = id => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const pages = {
    home: <HomePage wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} theme={theme} />,
    flights: <FlightsPage showToast={showToast} theme={theme} />,
    hotels: <HotelsPage showToast={showToast} theme={theme} />,
    map: <MapPage theme={theme} />,
    dashboard: <DashboardPage theme={theme} user={user} setPage={setPage} />,
    wishlist: <WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} showToast={showToast} setPage={setPage} theme={theme} />,
    auth: <AuthPage setUser={setUser} showToast={showToast} setPage={setPage} theme={theme} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: theme === "dark" ? "#050a14" : "#f8fafc" }}>
      <GlobalStyles />
      <Navbar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} user={user} setUser={setUser} wishlistCount={wishlist.length} />
      <main>{pages[page] || pages.home}</main>
      {page !== "auth" && <Footer theme={theme} />}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
