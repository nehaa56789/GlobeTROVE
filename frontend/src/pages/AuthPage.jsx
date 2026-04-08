import { useState } from "react";

const AuthPage = ({ login, register, showToast, setPage, theme }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  const inputStyle = {
    width: "100%",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: 12,
    padding: "14px 16px",
    color: isDark ? "#f1f5f9" : "#0f172a",
    fontFamily: "'Outfit',sans-serif",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    display: "block",
  };

  const handle = async () => {
    if (!email || !pass || (mode === "signup" && !name)) {
      showToast("Please fill all fields", "error");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(email, pass);
        showToast(`Welcome back, ${user.name}! 🎉`, "success");
      } else {
        const user = await register(name, email, pass);
        showToast(`Welcome, ${user.name}! Account created 🎉`, "success");
      }
      setPage("dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handle(); };

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#050a14" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: 440, width: "100%", background: isDark ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 24, padding: 40, backdropFilter: "blur(20px)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✈</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", margin: "0 0 8px" }}>
            {mode === "login" ? "Welcome Back" : "Join GlobeTrove"}
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", margin: 0 }}>
            {mode === "login" ? "Sign in to access your trips" : "Start your journey today"}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <div>
              <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} placeholder="Your name" style={inputStyle} />
            </div>
          )}
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="hello@globetrove.com" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1, color: "#6366f1", textTransform: "uppercase", marginBottom: 8 }}>Password</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={handleKeyDown} placeholder="••••••••" style={inputStyle} />
          </div>
          <button
            onClick={handle}
            disabled={loading}
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", border: "none", borderRadius: 12, padding: "16px", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)", marginTop: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#64748b", marginTop: 24 }}>
          {mode === "login" ? "Don't have an account? " : "Already have one? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontWeight: 600, fontFamily: "'Outfit',sans-serif", fontSize: 14 }}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;