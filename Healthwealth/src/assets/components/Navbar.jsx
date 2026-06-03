import { useState, useRef, useEffect } from "react";
import { Bell, Settings, Search, X, ChevronDown, LogOut, User, LayoutDashboard, Wallet, Brain, Dumbbell } from "lucide-react";

const PAGE_LABELS = {
  dashboard: { title: "Dashboard",  sub: "Overview & quick stats"      },
  finance:   { title: "Analytics",  sub: "Income, expenses & loans"    },
  mindset:   { title: "Mindset",    sub: "Mental wellness assessment"   },
  health:    { title: "Wellness",   sub: "Health tracking & vitals"     },
  profile:   { title: "Settings",   sub: "Account & preferences"       },
};

const NOTIFS = [
  { emoji: "💰", title: "Finance Updated",      sub: "Your income data was saved",      time: "Just now", dot: "#10b981" },
  { emoji: "🧠", title: "Mindset Report Ready", sub: "New assessment available",        time: "2h ago",   dot: "#8b5cf6" },
  { emoji: "❤️", title: "Health Reminder",      sub: "Log today's wellness data",       time: "Yesterday",dot: "#ef4444" },
];

function Navbar({ activePage, setActivePage, user, onLogout }) {
  const [searchVal,    setSearchVal]    = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif,    setShowNotif]    = useState(false);

  const menuRef  = useRef(null);
  const notifRef = useRef(null);

  const userName    = user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email?.split("@")[0] || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";
  const userEmail   = user?.email || "";
  const page        = PAGE_LABELS[activePage] || PAGE_LABELS.dashboard;

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current  && !menuRef.current.contains(e.target))  setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── shared micro-styles ── */
  const btn = (active) => ({
    width: 40, height: 40, borderRadius: 11,
    background: active ? "rgba(99,102,241,0.08)" : "#f8fafc",
    border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid #e2e8f0",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: active ? "#6366f1" : "#64748b",
    position: "relative", transition: "all 0.2s", flexShrink: 0,
  });

  return (
    <header
      style={{
        height: 72,
        background: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        gap: 16,
        boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── Left: Page Title ── */}
      <div className="hidden md:block" style={{ minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.16em" }}>
          HealthWealth
        </p>
        <h1 style={{ fontSize: 19, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.1, whiteSpace: "nowrap" }}>
          {page.title}
        </h1>
      </div>

      {/* ── Center: Search ── */}
      <div style={{ flex: 1, maxWidth: 380, position: "relative" }} className="hidden sm:block">
        <Search
          size={15}
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }}
        />
        <input
          type="text"
          placeholder={`Search in ${page.title.toLowerCase()}…`}
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          style={{
            width: "100%",
            height: 42,
            paddingLeft: 40,
            paddingRight: searchVal ? 36 : 14,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 13,
            fontSize: 13.5,
            fontWeight: 500,
            color: "#334155",
            outline: "none",
            fontFamily: "inherit",
            transition: "all 0.25s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
            e.target.style.background  = "white";
            e.target.style.boxShadow   = "0 0 0 3px rgba(99,102,241,0.09)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.background  = "#f8fafc";
            e.target.style.boxShadow   = "none";
          }}
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 2 }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Right: Actions ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            style={btn(showNotif)}
            onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
            onMouseEnter={(e) => { if (!showNotif) { e.currentTarget.style.background = "#f1f5f9"; } }}
            onMouseLeave={(e) => { if (!showNotif) { e.currentTarget.style.background = "#f8fafc"; } }}
          >
            <Bell size={18} />
            <span style={{ position: "absolute", top: 9, right: 9, width: 7, height: 7, borderRadius: "50%", background: "#6366f1", border: "2px solid white", boxShadow: "0 0 5px rgba(99,102,241,0.8)" }} />
          </button>

          {showNotif && (
            <div style={{ position: "absolute", right: 0, top: 50, width: 300, background: "white", border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 24px 64px rgba(0,0,0,0.13)", overflow: "hidden", zIndex: 50 }}>
              <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Notifications</p>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", background: "rgba(99,102,241,0.09)", padding: "2px 9px", borderRadius: 20, border: "1px solid rgba(99,102,241,0.15)" }}>
                  {NOTIFS.length} New
                </span>
              </div>
              {NOTIFS.map((n, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < NOTIFS.length - 1 ? "1px solid #f8fafc" : "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${n.dot}10`, border: `1px solid ${n.dot}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                    {n.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{n.title}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{n.sub}</p>
                  </div>
                  <span style={{ fontSize: 10, color: "#cbd5e1", flexShrink: 0 }}>{n.time}</span>
                </div>
              ))}
              <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
                <button style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings quick-link */}
        <button
          style={btn(activePage === "profile")}
          onClick={() => setActivePage("profile")}
          onMouseEnter={(e) => { if (activePage !== "profile") { e.currentTarget.style.background = "#f1f5f9"; } }}
          onMouseLeave={(e) => { if (activePage !== "profile") { e.currentTarget.style.background = "#f8fafc"; } }}
        >
          <Settings size={18} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 26, background: "#e2e8f0" }} className="hidden md:block" />

        {/* User Menu */}
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "5px 8px 5px 5px",
              borderRadius: 13,
              background: showUserMenu ? "rgba(99,102,241,0.08)" : "transparent",
              border: showUserMenu ? "1px solid rgba(99,102,241,0.22)" : "1px solid transparent",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 900, boxShadow: "0 3px 10px rgba(99,102,241,0.4)", flexShrink: 0 }}>
              {userInitial}
            </div>
            <div className="hidden md:block" style={{ textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{userName}</p>
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Pro Member</span>
            </div>
            <ChevronDown
              size={14}
              color="#94a3b8"
              className="hidden md:block"
              style={{ transition: "transform 0.22s", transform: showUserMenu ? "rotate(180deg)" : "rotate(0)" }}
            />
          </button>

          {showUserMenu && (
            <div style={{ position: "absolute", right: 0, top: 54, width: 210, background: "white", border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.13)", overflow: "hidden", zIndex: 50 }}>
              {/* User info header */}
              <div style={{ padding: "14px 14px 12px", borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{userName}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</p>
              </div>

              {/* Menu items */}
              <div style={{ padding: "6px" }}>
                {[
                  { Icon: User,    label: "Profile & Settings", page: "profile",   color: "#6366f1" },
                  { Icon: Wallet,  label: "Analytics",          page: "finance",   color: "#10b981" },
                  { Icon: Brain,   label: "Mindset",            page: "mindset",   color: "#8b5cf6" },
                  { Icon: Dumbbell,label: "Wellness",           page: "health",    color: "#06b6d4" },
                ].map(({ Icon, label, page, color }) => (
                  <button
                    key={page}
                    onClick={() => { setActivePage(page); setShowUserMenu(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", color: "#475569", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s", textAlign: "left" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                  >
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    {label}
                  </button>
                ))}

                {onLogout && (
                  <>
                    <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0" }} />
                    <button
                      onClick={onLogout}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <LogOut size={15} style={{ flexShrink: 0 }} />
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
