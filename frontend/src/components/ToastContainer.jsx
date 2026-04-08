const ToastContainer = ({ toasts }) => (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
    {toasts.map((t) => (
      <div
        key={t.id}
        style={{
          background:
            t.type === "success"
              ? "linear-gradient(135deg,#10b981,#059669)"
              : t.type === "error"
              ? "linear-gradient(135deg,#ef4444,#dc2626)"
              : "linear-gradient(135deg,#6366f1,#4f46e5)",
          color: "#fff",
          padding: "14px 20px",
          borderRadius: 12,
          fontFamily: "'Outfit',sans-serif",
          fontSize: 14,
          fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "slideIn .3s ease",
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 260,
        }}
      >
        <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
        {t.msg}
      </div>
    ))}
  </div>
);

export default ToastContainer;