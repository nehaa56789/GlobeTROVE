import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { destinationsAPI } from "../utils/api";

// ─── Fix Leaflet default icon broken by Webpack ───────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Tag → colour map ─────────────────────────────────────────────────────────
const TAG_COLORS = {
  Romantic:  "#ef4444",
  Tropical:  "#10b981",
  Culture:   "#f59e0b",
  Luxury:    "#8b5cf6",
  Adventure: "#f97316",
  Exotic:    "#ec4899",
  Scenic:    "#06b6d4",
};

// ─── Known coordinates for seeded destinations ────────────────────────────────
const COORDS = {
  "Santorini":    [36.3932,   25.4615],
  "Bali":         [-8.4095,  115.1889],
  "Tokyo":        [35.6762,  139.6503],
  "Amalfi Coast": [40.6340,   14.6027],
  "Maldives":     [3.2028,    73.2207],
  "Patagonia":    [-51.6230, -69.2168],
  "Marrakech":    [31.6295,   -7.9811],
  "Kyoto":        [35.0116,  135.7681],
};

// ─── Custom SVG pin ───────────────────────────────────────────────────────────
const makePin = (color, selected = false) => {
  const size = selected ? 44 : 34;
  const h    = Math.round(size * 1.32);
  const svg  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="${size}" height="${h}">
    <defs><filter id="ds"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.45)"/></filter></defs>
    <path filter="url(#ds)" fill="${color}" d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z"/>
    <circle fill="${selected ? color : "white"}" cx="16" cy="16" r="7" opacity="${selected ? 0.4 : 1}"/>
    ${selected ? '<circle fill="white" cx="16" cy="16" r="4"/>' : ""}
  </svg>`;
  return L.divIcon({
    html: svg, className: "",
    iconSize:   [size, h],
    iconAnchor: [size / 2, h],
    popupAnchor:[0, -h],
  });
};

// ─── Fly-to helper (must live inside MapContainer) ────────────────────────────
function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 7, { duration: 1.5, easeLinearity: 0.25 });
  }, [coords, map]);
  return null;
}

// ─── All map children in one component (avoids context boundary issues) ────────
function MapInner({ destinations, selected, flyTarget, handlePin }) {
  const dark = false; // passed via closure if needed — kept simple here
  return (
    <>
      {flyTarget && <FlyTo coords={flyTarget} />}
      {destinations.map((dest) => {
        const coords = COORDS[dest.city];
        if (!coords) return null;
        const isSel = selected?.city === dest.city;
        return (
          <Marker
            key={dest._id || dest.city}
            position={coords}
            icon={makePin(TAG_COLORS[dest.tag] || "#6366f1", isSel)}
            eventHandlers={{ click: () => handlePin(dest) }}
            zIndexOffset={isSel ? 1000 : 0}
          >
            <Popup closeButton={false} offset={[0, -34]}>
              <div style={{ fontFamily: "'Outfit',sans-serif", textAlign: "center", minWidth: 120 }}>
                <img
                  src={dest.img}
                  alt=""
                  style={{ width: "100%", height: 70, objectFit: "cover", borderRadius: 6, marginBottom: 6 }}
                />
                <strong style={{ display: "block", fontSize: 13, color: "#0f172a" }}>{dest.city}</strong>
                <span style={{ fontSize: 11, color: "#64748b" }}>{dest.country}</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", marginTop: 3 }}>
                  ₹{dest.price.toLocaleString("en-IN")}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

// ─── Detail side panel ────────────────────────────────────────────────────────
function DetailPanel({ dest, onClose, theme, setPage }) {
  const dark = theme === "dark";
  if (!dest) return null;
  const tagColor = TAG_COLORS[dest.tag] || "#6366f1";
  return (
    <div style={{
      position: "absolute", top: 16, right: 16, zIndex: 1000, width: 300,
      background: dark ? "rgba(10,20,35,0.96)" : "rgba(255,255,255,0.96)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${dark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"}`,
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
      animation: "fadeUp .3s ease",
    }}>
      {/* Photo */}
      <div style={{ position: "relative", height: 165 }}>
        <img src={dest.img} alt={dest.city} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.78) 100%)" }} />
        <span style={{
          position: "absolute", top: 12, left: 12,
          background: tagColor + "cc", color: "#fff", borderRadius: 20,
          padding: "3px 12px", fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 700,
        }}>{dest.tag}</span>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)",
            border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
            color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >×</button>
        <div style={{ position: "absolute", bottom: 12, left: 14 }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1 }}>{dest.city}</p>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.72)", margin: "3px 0 0" }}>{dest.country}</p>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: "14px 16px 16px" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: dark ? "#94a3b8" : "#475569", lineHeight: 1.65, margin: "0 0 12px" }}>{dest.desc}</p>
        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ color: i <= Math.floor(dest.rating) ? "#f59e0b" : "#374151", fontSize: 13 }}>★</span>
          ))}
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#64748b", marginLeft: 3 }}>{dest.rating}</span>
        </div>
        {/* Price + CTA */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#64748b", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>Starting from</p>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800,
              background: "linear-gradient(90deg,#6366f1,#06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0,
            }}>₹{dest.price.toLocaleString("en-IN")}</p>
          </div>
          <button
            onClick={() => setPage("flights")}
            style={{
              background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none",
              borderRadius: 10, padding: "9px 18px", color: "#fff",
              fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13,
              cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
            }}
          >Book Now →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend({ theme }) {
  const dark = theme === "dark";
  return (
    <div style={{
      position: "absolute", bottom: 28, left: 16, zIndex: 1000,
      background: dark ? "rgba(10,20,35,0.92)" : "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
      borderRadius: 12, padding: "10px 14px",
    }}>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b", margin: "0 0 8px" }}>Pin Type</p>
      {Object.entries(TAG_COLORS).map(([tag, color]) => (
        <div key={tag} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: dark ? "#94a3b8" : "#475569" }}>{tag}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const MapPage = ({ theme, setPage }) => {
  const dark = theme === "dark";
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected]         = useState(null);
  const [flyTarget, setFlyTarget]       = useState(null);
  const [loading, setLoading]           = useState(true);

  // Stable tile URL — changing this mid-render would unmount MapContainer
  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const tileAttr = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>';

  useEffect(() => {
    destinationsAPI.getAll()
      .then((r) => setDestinations(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePin = (dest) => {
    setSelected(dest);
    const coords = COORDS[dest.city];
    if (coords) setFlyTarget([...coords]); // new array ref to re-trigger FlyTo
  };

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#050a14" : "#f8fafc", paddingTop: 72 }}>

      {/* Header */}
      <div style={{ padding: "24px 32px 16px" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#6366f1", fontWeight: 600, margin: "0 0 6px" }}>✦ EXPLORE THE WORLD</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, color: dark ? "#f1f5f9" : "#0f172a", margin: "0 0 4px" }}>Interactive Map</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: dark ? "#64748b" : "#475569", margin: 0, fontSize: 14 }}>Click any pin to explore — zoom, pan, and discover</p>
      </div>

      {/* Map wrapper */}
      <div style={{
        position: "relative", margin: "0 32px 32px", borderRadius: 24, overflow: "hidden",
        height: "calc(100vh - 210px)", minHeight: 520,
        border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>

        {loading ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0d1b2a" : "#f1f5f9" }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", color: "#64748b" }}>Loading map…</p>
          </div>
        ) : (
          /* KEY FIX: MapContainer must never remount — give it a stable key.
             All dynamic children go inside MapInner (a proper child component)
             so react-leaflet's context is never confused by conditional rendering. */
          <MapContainer
            key="main-map"
            center={[20, 15]}
            zoom={2}
            minZoom={2}
            maxZoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer url={tileUrl} attribution={tileAttr} />
            <MapInner
              destinations={destinations}
              selected={selected}
              flyTarget={flyTarget}
              handlePin={handlePin}
            />
          </MapContainer>
        )}

        {/* Overlays — rendered outside MapContainer intentionally */}
        {!loading && (
          <DetailPanel
            dest={selected}
            onClose={() => { setSelected(null); setFlyTarget(null); }}
            theme={theme}
            setPage={setPage}
          />
        )}
        {!loading && <Legend theme={theme} />}

        {/* Destination count badge */}
        {!loading && (
          <div style={{
            position: "absolute", top: 16, left: 16, zIndex: 1000,
            background: dark ? "rgba(10,20,35,0.9)" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${dark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)"}`,
            borderRadius: 10, padding: "7px 14px",
          }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: dark ? "#a5b4fc" : "#6366f1", fontWeight: 600 }}>
              🌍 {destinations.length} Destinations
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;