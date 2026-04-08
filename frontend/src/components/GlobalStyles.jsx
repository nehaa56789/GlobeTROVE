const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
    @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
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
    @media (max-width: 768px) { .nav-links { display: none; } }
    /* Leaflet popup customisation */
    .leaflet-popup-content-wrapper {
      border-radius: 12px !important;
      padding: 0 !important;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25) !important;
    }
    .leaflet-popup-content { margin: 0 !important; }
    .leaflet-popup-tip-container { display: none; }
    .leaflet-control-zoom a {
      background: rgba(13,27,42,0.9) !important;
      color: #a5b4fc !important;
      border-color: rgba(99,102,241,0.3) !important;
    }
    .leaflet-control-zoom a:hover { background: rgba(99,102,241,0.2) !important; }
    .leaflet-control-attribution {
      background: rgba(5,10,20,0.7) !important;
      color: #64748b !important;
      font-size: 10px !important;
    }
    .leaflet-control-attribution a { color: #6366f1 !important; }
  `}</style>
);

export default GlobalStyles;