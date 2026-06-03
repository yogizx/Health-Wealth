import { useState } from "react";
import {
  LayoutDashboard, Wallet, Brain, Dumbbell, Settings,
  LogOut, Sparkles, ChevronLeft, ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard, accent: "#6366f1" },
  { id: "finance",   label: "Analytics",  Icon: Wallet,          accent: "#10b981" },
  { id: "mindset",   label: "Mindset",    Icon: Brain,           accent: "#8b5cf6" },
  { id: "health",    label: "Wellness",   Icon: Dumbbell,        accent: "#06b6d4" },
  { id: "profile",   label: "Settings",   Icon: Settings,        accent: "#94a3b8" },
];

function Sidebar({ activePage, setActivePage, onLogout, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered]     = useState(null);

  const userName    = user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email?.split("@")[0] || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  const B = "rgba(255,255,255,0.07)";    // border
  const T = "#f1f5f9";                   // text
  const S = "#94a3b8";                   // sub
  const M = "#475569";                   // muted

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ───────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: collapsed ? 70 : 256,
          flexShrink: 0,
          background: "linear-gradient(170deg,#0d0d28 0%,#070718 100%)",
          borderRight: `1px solid ${B}`,
          backdropFilter: "blur(20px)",
          minHeight: "100vh",
          position: "relative",
          zIndex: 20,
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        {/* Ambient glows */}
        <div style={{ position:"absolute", top:-80, left:-60, width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-60, right:-40, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 65%)", pointerEvents:"none" }}/>

        {/* Brand */}
        <div style={{ padding:"20px 16px 18px", borderBottom:`1px solid ${B}`, display:"flex", alignItems:"center", gap:11, minWidth:0 }}>
          <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(99,102,241,0.45)" }}>
            <Sparkles size={16} color="white"/>
          </div>
          {!collapsed && (
            <div style={{ overflow:"hidden" }}>
              <p style={{ fontWeight:900, fontSize:15, color:T, letterSpacing:"-0.02em", lineHeight:1, whiteSpace:"nowrap" }}>HealthWealth</p>
              <p style={{ fontSize:9, fontWeight:700, color:"#8b5cf6", textTransform:"uppercase", letterSpacing:"0.2em", marginTop:3 }}>Elite Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex:1, padding:"14px 10px", display:"flex", flexDirection:"column", gap:3 }}>
          {!collapsed && (
            <p style={{ fontSize:9, fontWeight:800, color:M, textTransform:"uppercase", letterSpacing:"0.16em", padding:"2px 12px 10px" }}>Main Menu</p>
          )}
          {NAV_ITEMS.map(({ id, label, Icon, accent }) => {
            const isActive = activePage === id;
            const isHov    = hovered === id && !isActive;
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:11,
                  padding: collapsed ? "12px" : "10px 12px",
                  borderRadius:13,
                  background: isActive ? `linear-gradient(135deg,${accent}22,${accent}0e)` : isHov ? "rgba(255,255,255,0.05)" : "transparent",
                  border: isActive ? `1px solid ${accent}38` : "1px solid transparent",
                  color: isActive ? accent : isHov ? T : S,
                  fontSize:13.5, fontWeight: isActive ? 700 : 600,
                  cursor:"pointer", transition:"all 0.2s ease",
                  fontFamily:"inherit",
                  justifyContent: collapsed ? "center" : "flex-start",
                  position:"relative",
                }}
              >
                {isActive && !collapsed && (
                  <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:22, borderRadius:4, background:accent, boxShadow:`0 0 8px ${accent}` }}/>
                )}
                <Icon size={18} style={{ flexShrink:0 }}/>
                {!collapsed && <span style={{ whiteSpace:"nowrap" }}>{label}</span>}
                {!collapsed && isActive && (
                  <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:accent, boxShadow:`0 0 6px ${accent}` }}/>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        {!collapsed && (
          <div style={{ margin:"0 10px 12px", padding:16, borderRadius:16, background:"linear-gradient(135deg,rgba(99,102,241,0.13),rgba(139,92,246,0.07))", border:"1px solid rgba(99,102,241,0.2)" }}>
            <p style={{ fontSize:13, fontWeight:800, color:T, marginBottom:4 }}>Upgrade to Pro</p>
            <p style={{ fontSize:11, color:S, lineHeight:1.55, marginBottom:12 }}>Unlock advanced analytics and real-time alerts.</p>
            <button
              onClick={() => setActivePage("profile")}
              style={{ width:"100%", height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"white", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(99,102,241,0.4)", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 6px 20px rgba(99,102,241,0.6)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="0 4px 14px rgba(99,102,241,0.4)"}
            >
              Get Access
            </button>
          </div>
        )}

        {/* Footer: User + Sign Out */}
        <div style={{ padding:"10px", borderTop:`1px solid ${B}`, display:"flex", flexDirection:"column", gap:2 }}>
          {/* User Profile */}
          <button
            onClick={() => setActivePage("profile")}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:13, background:"transparent", border:"1px solid transparent", cursor:"pointer", transition:"all 0.2s", fontFamily:"inherit", justifyContent:collapsed?"center":"flex-start", width:"100%" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.border=`1px solid ${B}`; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.border="1px solid transparent"; }}
          >
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12, fontWeight:900, flexShrink:0, boxShadow:"0 3px 10px rgba(99,102,241,0.45)" }}>
              {userInitial}
            </div>
            {!collapsed && (
              <div style={{ overflow:"hidden", flex:1, textAlign:"left" }}>
                <p style={{ fontSize:12, fontWeight:800, color:T, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{userName}</p>
                <span style={{ fontSize:10, color:"#8b5cf6", fontWeight:600 }}>Pro Member</span>
              </div>
            )}
          </button>

          {/* Sign Out */}
          <button
            onClick={onLogout}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:13, background:"transparent", border:"1px solid transparent", color:S, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", justifyContent:collapsed?"center":"flex-start", width:"100%" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.1)"; e.currentTarget.style.color="#f87171"; e.currentTarget.style.border="1px solid rgba(239,68,68,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=S; e.currentTarget.style.border="1px solid transparent"; }}
          >
            <LogOut size={16} style={{ flexShrink:0 }}/>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ position:"absolute", right:-12, top:88, width:24, height:24, borderRadius:"50%", background:"#0d0d26", border:`1px solid ${B}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:30, color:M, boxShadow:"0 2px 10px rgba(0,0,0,0.55)", transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background="#6366f1"; e.currentTarget.style.color="white"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#0d0d26"; e.currentTarget.style.color=M; }}
        >
          {collapsed ? <ChevronRight size={12}/> : <ChevronLeft size={12}/>}
        </button>
      </aside>

      {/* ─── MOBILE BOTTOM NAV ─────────────────────────────────────── */}
      <nav
        className="flex md:hidden"
        style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:30, background:"linear-gradient(170deg,#0d0d28,#070718)", borderTop:"1px solid rgba(255,255,255,0.09)", alignItems:"center", justifyContent:"space-around", padding:"8px 4px", height:68 }}
      >
        {NAV_ITEMS.map(({ id, label, Icon, accent }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, minWidth:50, height:"100%", borderRadius:12, background:isActive?`${accent}18`:"transparent", border:"none", cursor:"pointer", transition:"all 0.2s", color:isActive?accent:"#64748b", fontFamily:"inherit" }}
            >
              <Icon size={20}/>
              <span style={{ fontSize:9, fontWeight:700 }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;
