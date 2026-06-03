import { useState } from "react";
import { loginAdmin } from "../../lib/api";
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck, Activity, Eye, EyeOff, Zap, CheckCircle } from "lucide-react";

const S = {
  bg: "#07071a",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#f8fafc",
  sub: "#94a3b8",
  muted: "#475569",
  violet: "#7c3aed",
  violetLight: "#a78bfa",
  cyan: "#06b6d4",
  emerald: "#10b981",
};

const features = [
  { icon: "👥", label: "User Management",    desc: "Monitor all platform users in real-time" },
  { icon: "💰", label: "Finance Analytics",  desc: "Track income, expenses & net worth"       },
  { icon: "❤️", label: "Health Insights",    desc: "View detailed health & wellness metrics"  },
  { icon: "🧠", label: "Mindset Reports",    desc: "Analyse mindset scores and progress"      },
];

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [error, setError]             = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }
    setIsLoading(true);
    try {
      const session = await loginAdmin(username, password);
      onLoginSuccess(session);
    } catch (err) {
      setError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", height: 52, borderRadius: 14, fontSize: 14,
    color: S.text, background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)", outline: "none",
    fontFamily: "inherit", transition: "all 0.2s ease",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", overflow: "hidden", background: S.bg, fontFamily: "'Inter','DM Sans',sans-serif" }}>

      {/* Animated ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-25%", left: "-15%", width: "65vw", height: "65vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)", animation: "blobPulse 9s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-25%", right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)", animation: "blobPulse 12s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", top: "40%", right: "25%", width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)", animation: "blobPulse 15s ease-in-out infinite" }} />
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      {/* ── LEFT PANEL (branding) ─────────────────────────────────────── */}
      <div style={{ display: "none", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "48px 56px", position: "relative", zIndex: 1 }}
        className="lg-left-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(124,58,237,0.45)" }}>
            <Activity size={19} color="white" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 900, color: S.text, letterSpacing: "-0.02em" }}>HealthWealth</span>
        </div>

        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 30, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)", marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", animation: "dotPulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.12em" }}>Secure Admin Portal</span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, color: S.text, letterSpacing: "-0.04em", marginBottom: 20 }}>
            Command<br />
            <span style={{ background: "linear-gradient(130deg,#a78bfa,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Center</span>
          </h1>
          <p style={{ fontSize: 16, color: S.sub, lineHeight: 1.7, maxWidth: 400, marginBottom: 44 }}>
            Full-spectrum management of users, finance, health &amp; mindset data across the HealthWealth platform.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {features.map(f => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: S.text, marginBottom: 2 }}>{f.label}</p>
                  <p style={{ fontSize: 12, color: S.muted }}>{f.desc}</p>
                </div>
                <CheckCircle size={14} style={{ color: "#34d399", marginLeft: "auto", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#2d3748" }}>© 2024 HealthWealth Inc. All rights reserved.</p>
      </div>

      {/* ── RIGHT PANEL (form) ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, justifyContent: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(124,58,237,0.5)" }}>
              <Activity size={20} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: S.text, letterSpacing: "-0.02em" }}>HealthWealth</span>
          </div>

          {/* Card */}
          <div style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 28, padding: "36px 32px", backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>

            {/* Shield icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 76, height: 76, borderRadius: 24, background: "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(79,70,229,0.12))", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(124,58,237,0.25)" }}>
                  <ShieldCheck size={34} color="#a78bfa" />
                </div>
                <div style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(16,185,129,0.5)" }}>
                  <Zap size={10} color="white" />
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: S.text, letterSpacing: "-0.03em", marginBottom: 8 }}>Welcome Back</h2>
              <p style={{ fontSize: 14, color: S.muted }}>Sign in to access the admin dashboard</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 14, background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.22)", marginBottom: 22 }}>
                <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#f87171", fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Username */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Username</label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                    style={{ ...inputStyle, paddingLeft: 44, paddingRight: 16 }}
                    onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.55)"; e.target.style.background = "rgba(124,58,237,0.06)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: S.muted, pointerEvents: "none" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ ...inputStyle, paddingLeft: 44, paddingRight: 48 }}
                    onFocus={e => { e.target.style.borderColor = "rgba(124,58,237,0.55)"; e.target.style.background = "rgba(124,58,237,0.06)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: S.muted, display: "flex", padding: 4 }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%", height: 52, borderRadius: 14, border: "none",
                  background: isLoading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  color: "white", fontSize: 15, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: isLoading ? "none" : "0 6px 24px rgba(124,58,237,0.38)",
                  fontFamily: "inherit", transition: "all 0.25s ease", marginTop: 6,
                }}
                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(124,58,237,0.5)"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isLoading ? "none" : "0 6px 24px rgba(124,58,237,0.38)"; }}
              >
                {isLoading ? (
                  <div style={{ width: 20, height: 20, border: "2.5px solid rgba(255,255,255,0.25)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Status bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.7)", animation: "dotPulse 2s ease-in-out infinite" }} />
              <p style={{ fontSize: 12, color: S.muted, fontWeight: 500 }}>Secure 256-bit encrypted connection</p>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#1e293b" }}>
            HealthWealth Admin Portal &nbsp;·&nbsp; Authorised Access Only
          </p>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes blobPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.05)} }
        @keyframes dotPulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(min-width:1024px){
          .lg-left-panel{ display:flex !important; }
        }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}
      `}</style>
    </div>
  );
}
