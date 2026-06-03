import { useEffect, useState } from "react";
import { fetchAllUsersData } from "../../lib/api";
import {
  Users, Activity, Brain, LogOut, Search, Download, ChevronRight,
  RefreshCw, Heart, DollarSign, Shield, BarChart3, Bell, X, Wallet,
  Stethoscope, ArrowUpRight, ArrowDownRight, Moon, Droplets, Dumbbell,
  CheckCircle2, XCircle, ChevronLeft, Mail, Phone, Briefcase, Calendar,
  AlertCircle, Info, Hash, User,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const D = {
  bg:      "#07071a",
  sidebar: "rgba(8,8,28,0.97)",
  header:  "rgba(7,7,26,0.96)",
  card:    "rgba(255,255,255,0.034)",
  cardHov: "rgba(255,255,255,0.058)",
  border:  "rgba(255,255,255,0.075)",
  text:    "#f1f5f9",
  sub:     "#94a3b8",
  muted:   "#475569",
  violet:  "#7c3aed",
  vLight:  "#a78bfa",
  cyan:    "#06b6d4",
  emerald: "#10b981",
  amber:   "#f59e0b",
  rose:    "#ef4444",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (!n && n !== 0) return "₹0";
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Number(n).toLocaleString()}`;
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const initials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
};

const GRADIENTS = [
  ["#7c3aed","#4f46e5"], ["#0891b2","#0284c7"], ["#059669","#0d9488"],
  ["#db2777","#9d174d"], ["#d97706","#b45309"], ["#7c3aed","#6366f1"],
];

const avatarGrad = (id) => {
  if (!id) return GRADIENTS[0];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ id, name, size = 40, fs = 13 }) {
  const [c1, c2] = avatarGrad(id);
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.38, flexShrink: 0,
      background: `linear-gradient(135deg,${c1},${c2})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: fs, fontWeight: 900, color: "white",
      boxShadow: `0 4px 14px ${c1}55`,
    }}>
      {initials(name)}
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, accent, trend, up }) {
  const glow = `${accent}22`;
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: D.card, border: `1px solid ${hover ? accent + "55" : D.border}`,
        borderRadius: 22, padding: 24, position: "relative", overflow: "hidden",
        transition: "all 0.3s ease", boxShadow: hover ? `0 0 40px ${glow}` : "none",
        cursor: "default",
      }}
    >
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle,${accent}18,transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ width: 46, height: 46, borderRadius: 15, background: `${accent}18`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={accent} />
        </div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: up ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${up ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"}` }}>
            {up ? <ArrowUpRight size={11} color="#10b981" /> : <ArrowDownRight size={11} color="#ef4444" />}
            <span style={{ fontSize: 11, fontWeight: 700, color: up ? "#10b981" : "#ef4444", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trend}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 38, fontWeight: 900, color: D.text, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 13, color: D.sub, fontWeight: 600 }}>{title}</div>
    </div>
  );
}

function FinanceBar({ income, expense, loan }) {
  const total = income + expense + loan || 1;
  const bars = [
    { label: "Income",  val: income,  color: D.emerald },
    { label: "Expense", val: expense, color: D.rose    },
    { label: "Loans",   val: loan,    color: D.amber   },
  ];
  return (
    <div>
      <div style={{ display: "flex", height: 10, borderRadius: 8, overflow: "hidden", gap: 2, marginBottom: 20 }}>
        {bars.map(b => (
          <div key={b.label} style={{ width: `${(b.val / total) * 100}%`, background: b.color, borderRadius: 6, minWidth: b.val > 0 ? 4 : 0, transition: "width 0.7s ease" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {bars.map(b => (
          <div key={b.label} style={{ padding: "16px 14px", borderRadius: 16, background: `${b.color}10`, border: `1px solid ${b.color}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: b.color }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: D.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{b.label}</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 900, color: b.color }}>{fmt(b.val)}</p>
            <p style={{ fontSize: 11, color: D.muted, marginTop: 3 }}>{((b.val / total) * 100).toFixed(1)}% of total</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WellnessBar({ icon: Icon, label, value, max, current, accent }) {
  const pct = Math.min(100, Math.round((current / (max || 1)) * 100));
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon size={13} color={accent} />
          <span style={{ fontSize: 13, fontWeight: 600, color: D.sub }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: D.text }}>{value}</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${accent}70,${accent})`, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function Pill({ label, color }) {
  return (
    <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${color}14`, border: `1px solid ${color}28`, color: color }}>
      {label}
    </span>
  );
}

function HealthFlag({ label, type }) {
  const map = { activity: D.emerald, mindset: D.vLight, warning: D.amber, alert: D.rose };
  const c = map[type] || D.emerald;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${c}12`, border: `1px solid ${c}25`, color: c }}>
      {type === "alert" && <AlertCircle size={8} />}
      {type === "warning" && <Info size={8} />}
      {label}
    </span>
  );
}

function Empty({ icon: Icon, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 20px", gap: 14 }}>
      <div style={{ width: 58, height: 58, borderRadius: 18, background: D.card, border: `1px solid ${D.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={26} color={D.muted} />
      </div>
      <p style={{ fontSize: 14, color: D.muted, fontWeight: 600 }}>{label}</p>
    </div>
  );
}

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", icon: BarChart3,   label: "Overview"   },
  { id: "users",    icon: Users,       label: "Users"      },
  { id: "finance",  icon: Wallet,      label: "Finance"    },
  { id: "health",   icon: Stethoscope, label: "Health"     },
  { id: "mindset",  icon: Brain,       label: "Mindset"    },
];

const PAGE_TITLES = {
  overview: "Dashboard Overview",
  users:    "User Management",
  finance:  "Finance Records",
  health:   "Health Assessments",
  mindset:  "Mindset Reports",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const [data, setData]             = useState({ profiles: [], finance: [], health: [], mindset: [] });
  const [loading, setLoading]       = useState(true);
  const [activeNav, setActiveNav]   = useState("overview");
  const [search, setSearch]         = useState("");
  const [selUser, setSelUser]       = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [sideOpen, setSideOpen]     = useState(true);
  const [finFilter, setFinFilter]   = useState("all");

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try { const r = await fetchAllUsersData(); setData(r); }
    catch (e) { console.error("Admin data:", e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { loadData(); }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalInc = data.finance.filter(f => f.entry_type === "income") .reduce((s, f) => s + Number(f.amount), 0);
  const totalExp = data.finance.filter(f => f.entry_type === "expense").reduce((s, f) => s + Number(f.amount), 0);
  const totalLoan= data.finance.filter(f => f.entry_type === "loan")   .reduce((s, f) => s + Number(f.amount), 0);

  const avgSleep = data.health.length
    ? (data.health.reduce((s, h) => s + (Number(h.sleeping_quality_hours) || 0), 0) / data.health.length).toFixed(1)
    : "—";
  const avgWater = data.health.length
    ? (data.health.reduce((s, h) => s + (Number(h.water_intake) || 0), 0) / data.health.length).toFixed(1)
    : "—";
  const avgMindset = data.mindset.length
    ? Math.round(data.mindset.reduce((s, m) => s + (Number(m.score) || 0), 0) / data.mindset.length)
    : null;

  const activeUsers = data.profiles.filter(p =>
    data.finance.some(f => f.user_id === p.id) || data.health.some(h => h.user_id === p.id)
  );

  const filteredProfiles = data.profiles.filter(p =>
    !search || [p.full_name, p.email, p.occupation].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredFinance = data.finance
    .filter(f => finFilter === "all" || f.entry_type === finFilter)
    .filter(f => !search || [f.source, f.payment_mode].some(v => v?.toLowerCase().includes(search.toLowerCase())));

  const userFinance = (uid) => data.finance.filter(f => f.user_id === uid);
  const userHealth  = (uid) => data.health.find(h => h.user_id === uid);
  const userMindset = (uid) => data.mindset.find(m => m.user_id === uid);
  const userNet     = (uid) => {
    const uf = userFinance(uid);
    return uf.filter(f => f.entry_type === "income").reduce((s,f)=>s+Number(f.amount),0)
         - uf.filter(f => f.entry_type === "expense").reduce((s,f)=>s+Number(f.amount),0);
  };
  const profileOf = (uid) => data.profiles.find(p => p.id === uid);

  function exportCSV() {
    const rows = [
      ["Name","Email","Phone","Gender","Age","Occupation","Joined","Income","Expense","Net Worth","Sleep Hrs","Water (L)","Mindset Score"],
      ...data.profiles.map(p => {
        const h = userHealth(p.id), ms = userMindset(p.id), uf = userFinance(p.id);
        const inc = uf.filter(f=>f.entry_type==="income").reduce((s,f)=>s+Number(f.amount),0);
        const exp = uf.filter(f=>f.entry_type==="expense").reduce((s,f)=>s+Number(f.amount),0);
        return [p.full_name||"",p.email||"",p.phone_number||"",p.gender||"",p.age||"",p.occupation||"",fmtDate(p.created_at),inc,exp,inc-exp,h?.sleeping_quality_hours||"",h?.water_intake||"",ms?.score||""];
      }),
    ];
    const blob = new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"),{href:url,download:"healthwealth_users.csv"}).click();
    URL.revokeObjectURL(url);
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: D.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 72, height: 72, margin: "0 auto 20px", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(124,58,237,0.18)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: D.violet, animation: "adSpin 0.75s linear infinite" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={22} color={D.violet} />
          </div>
        </div>
        <p style={{ fontSize: 10, fontWeight: 900, color: D.violet, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6 }}>HealthWealth Admin</p>
        <p style={{ fontSize: 14, color: D.sub }}>Loading command center…</p>
      </div>
      <style>{`@keyframes adSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: D.bg, display: "flex", color: D.text, fontFamily: "'Inter','DM Sans',sans-serif", position: "relative" }}>

      {/* ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.05) 0%,transparent 65%)" }} />
      </div>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside style={{
        width: sideOpen ? 236 : 70, flexShrink: 0,
        background: D.sidebar, borderRight: `1px solid ${D.border}`,
        backdropFilter: "blur(20px)", display: "flex", flexDirection: "column",
        minHeight: "100vh", position: "relative", zIndex: 20,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 18px", borderBottom: `1px solid ${D.border}`, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(124,58,237,0.45)" }}>
            <Shield size={16} color="white" />
          </div>
          {sideOpen && (
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontWeight: 900, fontSize: 14, color: D.text, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>HealthWealth</p>
              <p style={{ fontSize: 9, fontWeight: 800, color: D.violet, textTransform: "uppercase", letterSpacing: "0.22em", marginTop: 3 }}>Admin Console</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.map(({ id, icon: Icon, label }) => {
            const active = activeNav === id;
            return (
              <button key={id} onClick={() => setActiveNav(id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 11,
                padding: "10px 12px", borderRadius: 13,
                background: active ? "linear-gradient(135deg,rgba(124,58,237,0.22),rgba(79,70,229,0.14))" : "transparent",
                border: active ? "1px solid rgba(124,58,237,0.32)" : "1px solid transparent",
                color: active ? D.vLight : D.sub, fontSize: 13, fontWeight: active ? 700 : 600,
                cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit",
                justifyContent: sideOpen ? "flex-start" : "center", textAlign: "left",
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color=D.text; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=D.sub; }}}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {sideOpen && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
                {sideOpen && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: D.violet, boxShadow: `0 0 6px ${D.violet}` }} />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid ${D.border}`, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", justifyContent: sideOpen ? "flex-start" : "center" }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.2))", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: D.vLight }}>AD</span>
            </div>
            {sideOpen && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: D.text, whiteSpace: "nowrap" }}>System Admin</p>
                <p style={{ fontSize: 10, color: D.violet, fontWeight: 600 }}>Root Access</p>
              </div>
            )}
          </div>
          <button onClick={onLogout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 13, background: "transparent",
            border: "1px solid transparent", color: D.sub, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease",
            justifyContent: sideOpen ? "flex-start" : "center",
          }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.1)"; e.currentTarget.style.color="#f87171"; e.currentTarget.style.border="1px solid rgba(239,68,68,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=D.sub; e.currentTarget.style.border="1px solid transparent"; }}
          >
            <LogOut size={17} style={{ flexShrink: 0 }} />
            {sideOpen && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setSideOpen(!sideOpen)} style={{
          position: "absolute", right: -11, top: 82,
          width: 22, height: 22, borderRadius: "50%",
          background: "#0f0f26", border: `1px solid ${D.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 30, color: D.muted,
          boxShadow: "0 2px 10px rgba(0,0,0,0.6)", transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background=D.violet; e.currentTarget.style.color="white"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#0f0f26"; e.currentTarget.style.color=D.muted; }}
        >
          {sideOpen ? <ChevronLeft size={11}/> : <ChevronRight size={11}/>}
        </button>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <header style={{
          background: D.header, borderBottom: `1px solid ${D.border}`,
          backdropFilter: "blur(24px)", padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 900, color: D.text, letterSpacing: "-0.025em", lineHeight: 1 }}>{PAGE_TITLES[activeNav]}</h1>
            <p style={{ fontSize: 12, color: D.sub, marginTop: 4 }}>{data.profiles.length} registered · {activeUsers.length} active</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: D.muted, pointerEvents: "none" }} />
              <input type="text" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}
                style={{ height: 38, paddingLeft: 34, paddingRight: search ? 32 : 12, background: "rgba(255,255,255,0.04)", border: `1px solid ${D.border}`, borderRadius: 11, fontSize: 13, color: D.text, width: 190, outline: "none", fontFamily: "inherit", transition: "all 0.2s" }}
                onFocus={e => { e.target.style.borderColor="rgba(124,58,237,0.45)"; e.target.style.background="rgba(124,58,237,0.05)"; }}
                onBlur={e => { e.target.style.borderColor=D.border; e.target.style.background="rgba(255,255,255,0.04)"; }}
              />
              {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:D.muted, display:"flex" }}><X size={12}/></button>}
            </div>

            {/* Refresh */}
            <button onClick={()=>loadData(true)} style={{ width:38, height:38, borderRadius:11, background:"rgba(255,255,255,0.04)", border:`1px solid ${D.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:D.sub, transition:"all 0.2s", animation:refreshing?"adSpin 0.8s linear infinite":"none" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.color=D.text;}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color=D.sub;}}
            ><RefreshCw size={15}/></button>

            {/* Notifications */}
            <div style={{ position:"relative" }}>
              <button onClick={()=>setNotifOpen(!notifOpen)} style={{ width:38, height:38, borderRadius:11, position:"relative", background:notifOpen?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.04)", border:notifOpen?`1px solid rgba(124,58,237,0.35)`:`1px solid ${D.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:notifOpen?D.vLight:D.sub, transition:"all 0.2s" }}>
                <Bell size={15}/>
                <div style={{ position:"absolute", top:8, right:8, width:6, height:6, borderRadius:"50%", background:D.violet, boxShadow:`0 0 6px ${D.violet}` }}/>
              </button>
              {notifOpen && (
                <div style={{ position:"absolute", right:0, top:46, width:272, zIndex:50, background:"#0d0d22", border:`1px solid ${D.border}`, borderRadius:16, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.6)" }}>
                  <div style={{ padding:"13px 16px", borderBottom:`1px solid ${D.border}` }}>
                    <p style={{ fontSize:13, fontWeight:800, color:D.text }}>Notifications</p>
                  </div>
                  {[
                    { icon:Users,     color:D.violet,  msg:`${data.profiles.length} users registered`        },
                    { icon:Activity,  color:D.emerald, msg:`${data.health.length} health assessments`         },
                    { icon:DollarSign,color:D.amber,   msg:`${data.finance.length} finance entries logged`    },
                    { icon:Brain,     color:"#8b5cf6", msg:`${data.mindset.length} mindset reports submitted` },
                  ].map((n,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px", borderBottom:i<3?`1px solid ${D.border}`:"none" }}>
                      <n.icon size={13} color={n.color} style={{ flexShrink:0 }}/>
                      <p style={{ fontSize:12, fontWeight:600, color:D.sub }}>{n.msg}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <button onClick={exportCSV} style={{ height:38, padding:"0 16px", borderRadius:11, background:"linear-gradient(135deg,#7c3aed,#4f46e5)", border:"none", color:"white", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:7, cursor:"pointer", boxShadow:"0 4px 18px rgba(124,58,237,0.35)", fontFamily:"inherit", transition:"all 0.2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(124,58,237,0.5)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 18px rgba(124,58,237,0.35)";}}
            ><Download size={13}/>Export</button>
          </div>
        </header>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <main style={{ flex:1, overflowY:"auto", padding:"24px", display:"flex", flexDirection:"column", gap:20 }}>

          {/* ══ OVERVIEW ═══════════════════════════════════════════════════ */}
          {activeNav==="overview" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              <KpiCard title="Total Users"     value={data.profiles.length} icon={Users}      accent="#3b82f6" trend={`${activeUsers.length} active`}           up />
              <KpiCard title="Finance Records" value={data.finance.length}  icon={Wallet}     accent={D.emerald} trend={`${fmt(totalInc-totalExp)} net`}        up={totalInc>=totalExp} />
              <KpiCard title="Health Reports"  value={data.health.length}   icon={Heart}      accent={D.rose}  trend={`Avg ${avgSleep}h sleep`}                 up />
              <KpiCard title="Mindset Reports" value={data.mindset.length}  icon={Brain}      accent={D.violet} trend={avgMindset?`Avg ${avgMindset}/100`:"No data"} up />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14 }}>
              <div style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:22, padding:24 }}>
                <p style={{ fontSize:16, fontWeight:900, color:D.text, marginBottom:4 }}>Finance Breakdown</p>
                <p style={{ fontSize:12, color:D.sub, marginBottom:24 }}>Platform-wide financial overview</p>
                <FinanceBar income={totalInc} expense={totalExp} loan={totalLoan}/>
              </div>
              <div style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:22, padding:24 }}>
                <p style={{ fontSize:16, fontWeight:900, color:D.text, marginBottom:4 }}>Wellness Snapshot</p>
                <p style={{ fontSize:12, color:D.sub, marginBottom:20 }}>Avg across all users</p>
                <WellnessBar icon={Moon}     label="Avg Sleep"   value={`${avgSleep} hrs`}                      max={9}   current={Number(avgSleep)||0} accent="#6366f1"/>
                <WellnessBar icon={Droplets} label="Avg Water"   value={`${avgWater} L`}                        max={4}   current={Number(avgWater)||0} accent={D.cyan}/>
                <WellnessBar icon={Brain}    label="Avg Mindset" value={avgMindset?`${avgMindset}/100`:"—"}     max={100} current={avgMindset||0}       accent={D.violet}/>
                <WellnessBar icon={Users}    label="Active Users" value={`${activeUsers.length}/${data.profiles.length}`} max={data.profiles.length||1} current={activeUsers.length} accent={D.emerald}/>
              </div>
            </div>

            <div style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:22, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                <p style={{ fontSize:16, fontWeight:900, color:D.text }}>Recent Registrations</p>
                <button onClick={()=>setActiveNav("users")} style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:700, color:D.violet, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                  View All <ChevronRight size={12}/>
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {data.profiles.length===0 ? <Empty icon={Users} label="No users yet"/> : data.profiles.slice(0,6).map(p => {
                  const ms = userMindset(p.id);
                  return (
                    <div key={p.id} onClick={()=>{setSelUser(p);setActiveNav("users");}} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 14px", borderRadius:14, cursor:"pointer", transition:"all 0.2s", border:"1px solid transparent" }}
                      onMouseEnter={e=>{e.currentTarget.style.background=D.cardHov;e.currentTarget.style.border=`1px solid ${D.border}`;}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.border="1px solid transparent";}}
                    >
                      <Avatar id={p.id} name={p.full_name}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:14, fontWeight:700, color:D.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.full_name||"Unknown"}</p>
                        <p style={{ fontSize:12, color:D.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.email}</p>
                      </div>
                      {ms && <Pill label={`🧠 ${ms.score}`} color={D.vLight}/>}
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <p style={{ fontSize:13, fontWeight:800, color:userNet(p.id)>=0?D.emerald:D.rose }}>{fmt(userNet(p.id))}</p>
                        <p style={{ fontSize:10, color:D.muted }}>net worth</p>
                      </div>
                      <ChevronRight size={13} color={D.muted}/>
                    </div>
                  );
                })}
              </div>
            </div>
          </>)}

          {/* ══ USERS ══════════════════════════════════════════════════════ */}
          {activeNav==="users" && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {[
                  { label:"Total Users",      val:data.profiles.length,                                  color:"#3b82f6"  },
                  { label:"With Finance",     val:[...new Set(data.finance.map(f=>f.user_id))].length,   color:D.emerald  },
                  { label:"With Health",      val:[...new Set(data.health.map(h=>h.user_id))].length,    color:D.rose     },
                  { label:"With Mindset",     val:[...new Set(data.mindset.map(m=>m.user_id))].length,   color:D.violet   },
                ].map(s=>(
                  <div key={s.label} style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:16, padding:"16px 18px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:4, height:40, borderRadius:4, background:s.color, flexShrink:0 }}/>
                    <div>
                      <p style={{ fontSize:30, fontWeight:900, color:D.text, lineHeight:1, letterSpacing:"-0.03em" }}>{s.val}</p>
                      <p style={{ fontSize:11, color:D.sub, fontWeight:600, marginTop:4 }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                {filteredProfiles.length===0 ? (
                  <div style={{ gridColumn:"1/-1" }}><Empty icon={Search} label="No users match your search"/></div>
                ) : filteredProfiles.map(u => {
                  const uf  = userFinance(u.id);
                  const uh  = userHealth(u.id);
                  const ms  = userMindset(u.id);
                  const inc = uf.filter(f=>f.entry_type==="income").reduce((s,f)=>s+Number(f.amount),0);
                  const exp = uf.filter(f=>f.entry_type==="expense").reduce((s,f)=>s+Number(f.amount),0);
                  const net = inc - exp;
                  const isActive = uf.length>0||!!uh;
                  return (
                    <div key={u.id} onClick={()=>setSelUser(u)} style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:22, padding:20, cursor:"pointer", transition:"all 0.3s ease" }}
                      onMouseEnter={e=>{e.currentTarget.style.border="1px solid rgba(124,58,237,0.35)";e.currentTarget.style.boxShadow="0 0 30px rgba(124,58,237,0.1)";e.currentTarget.style.transform="translateY(-2px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${D.border}`;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)";}}
                    >
                      <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
                        <Avatar id={u.id} name={u.full_name} size={46}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:14, fontWeight:800, color:D.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.full_name||"Unknown"}</p>
                          <p style={{ fontSize:12, color:D.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</p>
                          {u.occupation&&<p style={{ fontSize:11, color:D.muted, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.occupation}</p>}
                        </div>
                        <span style={{ padding:"3px 9px", borderRadius:20, fontSize:10, fontWeight:800, textTransform:"uppercase", flexShrink:0, background:isActive?"rgba(16,185,129,0.12)":"rgba(255,255,255,0.05)", border:`1px solid ${isActive?"rgba(16,185,129,0.25)":D.border}`, color:isActive?"#34d399":D.muted }}>
                          {isActive?"Active":"New"}
                        </span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, marginBottom:12 }}>
                        {[
                          {label:"Income", val:fmt(inc), color:D.emerald},
                          {label:"Expense",val:fmt(exp), color:D.rose   },
                          {label:"Net",    val:fmt(net), color:net>=0?D.emerald:D.rose},
                        ].map(s=>(
                          <div key={s.label} style={{ background:`${s.color}0f`, border:`1px solid ${s.color}22`, borderRadius:11, padding:"8px", textAlign:"center" }}>
                            <p style={{ fontSize:12, fontWeight:800, color:s.color }}>{s.val}</p>
                            <p style={{ fontSize:9, color:D.muted, fontWeight:700, textTransform:"uppercase", marginTop:2 }}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                        {uh?.sleeping_quality_hours&&<Pill label={`🌙 ${uh.sleeping_quality_hours}h`} color="#6366f1"/>}
                        {uh?.water_intake&&<Pill label={`💧 ${uh.water_intake}L`} color={D.cyan}/>}
                        {uh?.physical_activity&&<Pill label={`🏋️ ${uh.physical_activity}`} color={D.emerald}/>}
                        {ms&&<Pill label={`🧠 ${ms.score}`} color={D.vLight}/>}
                        {!uh&&!ms&&<span style={{ fontSize:11, color:D.muted, fontStyle:"italic" }}>No wellness data</span>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:`1px solid ${D.border}` }}>
                        <span style={{ fontSize:11, color:D.muted }}>Joined {fmtDate(u.created_at)}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:D.violet, display:"flex", alignItems:"center", gap:3 }}>View Details<ChevronRight size={10}/></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ FINANCE ════════════════════════════════════════════════════ */}
          {activeNav==="finance" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                {[
                  {k:"all",    label:"All",     color:D.violet,  bg:"rgba(124,58,237,0.14)"},
                  {k:"income", label:"Income",  color:D.emerald, bg:"rgba(16,185,129,0.14)"},
                  {k:"expense",label:"Expense", color:D.rose,    bg:"rgba(239,68,68,0.14)" },
                  {k:"loan",   label:"Loans",   color:D.amber,   bg:"rgba(245,158,11,0.14)"},
                ].map(t=>(
                  <button key={t.k} onClick={()=>setFinFilter(t.k)} style={{ padding:"7px 15px", borderRadius:10, fontSize:12, fontWeight:700, background:finFilter===t.k?t.bg:"rgba(255,255,255,0.04)", border:finFilter===t.k?`1px solid ${t.color}35`:`1px solid ${D.border}`, color:finFilter===t.k?t.color:D.sub, cursor:"pointer", transition:"all 0.2s", fontFamily:"inherit" }}>
                    {t.label}
                  </button>
                ))}
                <span style={{ marginLeft:"auto", fontSize:12, color:D.sub }}>{filteredFinance.length} records</span>
              </div>

              <div style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:22, overflow:"hidden" }}>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${D.border}` }}>
                        {["User","Type","Source","Frequency","Payment Mode","Amount","Date"].map(h=>(
                          <th key={h} style={{ padding:"15px 18px", textAlign:"left", fontSize:10, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.13em", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFinance.length===0 ? (
                        <tr><td colSpan={7}><Empty icon={Wallet} label="No finance records"/></td></tr>
                      ) : filteredFinance.map(entry=>{
                        const owner = profileOf(entry.user_id);
                        const tc = entry.entry_type==="income"
                          ? {bg:"rgba(16,185,129,0.1)",text:"#34d399",border:"rgba(16,185,129,0.22)"}
                          : entry.entry_type==="expense"
                          ? {bg:"rgba(239,68,68,0.1)",text:"#f87171",border:"rgba(239,68,68,0.22)"}
                          : {bg:"rgba(245,158,11,0.1)",text:"#fbbf24",border:"rgba(245,158,11,0.22)"};
                        return (
                          <tr key={entry.id} style={{ borderBottom:`1px solid rgba(255,255,255,0.03)`, transition:"background 0.15s" }}
                            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
                          >
                            <td style={{ padding:"13px 18px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                                <Avatar id={entry.user_id} name={owner?.full_name} size={30} fs={11}/>
                                <div>
                                  <p style={{ fontSize:12, fontWeight:700, color:D.text, maxWidth:110, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{owner?.full_name||"Unknown"}</p>
                                  <p style={{ fontSize:10, color:D.sub, maxWidth:110, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{owner?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding:"13px 18px" }}>
                              <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:800, textTransform:"uppercase", background:tc.bg, border:`1px solid ${tc.border}`, color:tc.text }}>
                                {entry.entry_type==="income"?<ArrowUpRight size={9}/>:<ArrowDownRight size={9}/>}
                                {entry.entry_type}
                              </span>
                            </td>
                            <td style={{ padding:"13px 18px", fontSize:12, color:D.sub, maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.source}</td>
                            <td style={{ padding:"13px 18px", fontSize:12, color:D.muted, textTransform:"capitalize" }}>{entry.frequency}</td>
                            <td style={{ padding:"13px 18px", fontSize:12, color:D.muted, textTransform:"capitalize" }}>{entry.payment_mode}</td>
                            <td style={{ padding:"13px 18px" }}>
                              <span style={{ fontSize:14, fontWeight:800, color:tc.text }}>{entry.entry_type==="expense"?"−":"+"}{fmt(entry.amount)}</span>
                            </td>
                            <td style={{ padding:"13px 18px", fontSize:12, color:D.muted, whiteSpace:"nowrap" }}>{fmtDate(entry.created_at)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ HEALTH ═════════════════════════════════════════════════════ */}
          {activeNav==="health" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {data.health.length===0 ? (
                <div style={{ gridColumn:"1/-1" }}><Empty icon={Heart} label="No health assessments yet"/></div>
              ) : data.health.map(h=>{
                const owner = profileOf(h.user_id);
                return (
                  <div key={h.id} style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:22, padding:20, transition:"all 0.3s" }}
                    onMouseEnter={e=>{e.currentTarget.style.border="1px solid rgba(239,68,68,0.28)";e.currentTarget.style.boxShadow="0 0 28px rgba(239,68,68,0.07)";}}
                    onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${D.border}`;e.currentTarget.style.boxShadow="none";}}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:18 }}>
                      <Avatar id={h.user_id} name={owner?.full_name||h.name} size={42}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:14, fontWeight:800, color:D.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{owner?.full_name||h.name||"Unknown"}</p>
                        <p style={{ fontSize:11, color:D.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{owner?.email}</p>
                      </div>
                      {(h.age||h.gender)&&<div style={{ textAlign:"right", flexShrink:0 }}>
                        {h.age&&<p style={{ fontSize:13, fontWeight:800, color:D.text }}>{h.age}y</p>}
                        {h.gender&&<p style={{ fontSize:11, color:D.sub, textTransform:"capitalize" }}>{h.gender}</p>}
                      </div>}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:7, marginBottom:14 }}>
                      {[
                        {label:"Height",val:h.height,icon:"📏"},
                        {label:"Weight",val:h.weight,icon:"⚖️"},
                        {label:"Sleep", val:h.sleeping_quality_hours?`${h.sleeping_quality_hours}h ${h.sleeping_quality_minutes||0}m`:null, icon:"🌙"},
                        {label:"Water", val:h.water_intake?`${h.water_intake}L/day`:null, icon:"💧"},
                      ].filter(m=>m.val).map(m=>(
                        <div key={m.label} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${D.border}`, borderRadius:11, padding:"9px 11px", display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:15 }}>{m.icon}</span>
                          <div>
                            <p style={{ fontSize:9, color:D.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em" }}>{m.label}</p>
                            <p style={{ fontSize:12, fontWeight:800, color:D.text, marginTop:1 }}>{m.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {(h.breakfast||h.lunch||h.dinner)&&(
                      <div style={{ marginBottom:12 }}>
                        <p style={{ fontSize:9, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.13em", marginBottom:7 }}>Meals</p>
                        {[{label:"Breakfast",val:h.breakfast,qty:h.breakfast_quantity},{label:"Lunch",val:h.lunch,qty:h.lunch_quantity},{label:"Dinner",val:h.dinner,qty:h.dinner_quantity}].filter(m=>m.val).map(m=>(
                          <div key={m.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                            <span style={{ fontSize:11, color:D.muted }}>{m.label}</span>
                            <span style={{ fontSize:11, fontWeight:700, color:D.sub, maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.val}{m.qty?` · ${m.qty}g`:""}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {h.physical_activity&&<HealthFlag label={h.physical_activity} type="activity"/>}
                      {h.meditation&&<HealthFlag label={`Meditation: ${h.meditation}`} type="mindset"/>}
                      {h.medication&&!["none","no","null"].includes(h.medication)&&<HealthFlag label="Medication" type="warning"/>}
                      {h.headache==="yes"&&<HealthFlag label="Headaches" type="alert"/>}
                      {h.body_pain==="yes"&&<HealthFlag label="Body Pain" type="alert"/>}
                    </div>
                    <p style={{ fontSize:10, color:D.muted, marginTop:12 }}>Updated {fmtDate(h.updated_at)}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ MINDSET ════════════════════════════════════════════════════ */}
          {activeNav==="mindset" && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              {avgMindset&&(
                <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.14),rgba(79,70,229,0.09))", border:"1px solid rgba(124,58,237,0.22)", borderRadius:22, padding:24, display:"flex", alignItems:"center", gap:22 }}>
                  <div style={{ position:"relative", width:84, height:84, flexShrink:0 }}>
                    <svg width="84" height="84" style={{ transform:"rotate(-90deg)" }}>
                      <circle cx="42" cy="42" r="35" stroke="rgba(255,255,255,0.07)" strokeWidth="7" fill="transparent"/>
                      <circle cx="42" cy="42" r="35" stroke="#a78bfa" strokeWidth="7" fill="transparent" strokeDasharray={2*Math.PI*35} strokeDashoffset={2*Math.PI*35*(1-avgMindset/100)} strokeLinecap="round"/>
                    </svg>
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:19, fontWeight:900, color:D.vLight }}>{avgMindset}</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize:22, fontWeight:900, color:D.text, letterSpacing:"-0.025em" }}>Platform Avg Mindset Score</p>
                    <p style={{ fontSize:13, color:D.sub, marginTop:6 }}>Across {data.mindset.length} assessments · out of 100</p>
                  </div>
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                {data.mindset.length===0 ? (
                  <div style={{ gridColumn:"1/-1" }}><Empty icon={Brain} label="No mindset assessments yet"/></div>
                ) : data.mindset.map(m=>{
                  const owner = profileOf(m.user_id);
                  const score = Number(m.score)||0;
                  const pct   = Math.round((score/100)*100);
                  const sc    = score>=70?D.emerald:score>=40?D.amber:D.rose;
                  const scBg  = score>=70?"from-emerald-500 to-teal-500":score>=40?"from-amber-500 to-orange-500":"from-rose-500 to-pink-500";
                  return (
                    <div key={m.id} style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:22, padding:20, transition:"all 0.3s" }}
                      onMouseEnter={e=>{e.currentTarget.style.border="1px solid rgba(124,58,237,0.28)";}}
                      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${D.border}`;}}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:18 }}>
                        <Avatar id={m.user_id} name={owner?.full_name} size={42}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:14, fontWeight:800, color:D.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{owner?.full_name||"Unknown"}</p>
                          <p style={{ fontSize:11, color:D.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{owner?.email}</p>
                        </div>
                        <div style={{ position:"relative", width:52, height:52, flexShrink:0 }}>
                          <svg width="52" height="52" style={{ transform:"rotate(-90deg)" }}>
                            <circle cx="26" cy="26" r="21" stroke="rgba(255,255,255,0.07)" strokeWidth="4" fill="transparent"/>
                            <circle cx="26" cy="26" r="21" stroke={sc} strokeWidth="4" fill="transparent" strokeDasharray={2*Math.PI*21} strokeDashoffset={2*Math.PI*21*(1-score/100)} strokeLinecap="round"/>
                          </svg>
                          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontSize:12, fontWeight:900, color:sc }}>{score}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden", marginBottom:16 }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${sc}80,${sc})`, borderRadius:4, transition:"width 0.7s ease" }}/>
                      </div>

                      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                        {[
                          {label:"Stress Level",  val:m.stress_level  },
                          {label:"Anxiety Level", val:m.anxiety_level },
                          {label:"Mood",          val:m.mood          },
                          {label:"Focus Level",   val:m.focus_level   },
                          {label:"Motivation",    val:m.motivation    },
                        ].filter(r=>r.val).map(r=>(
                          <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                            <span style={{ fontSize:12, color:D.muted }}>{r.label}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:D.sub, textTransform:"capitalize" }}>{r.val}</span>
                          </div>
                        ))}
                        {Array.isArray(m.responses)&&m.responses.length>0&&(
                          <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginTop:4 }}>
                            {m.responses.map((r,i)=>(
                              <div key={i} style={{ width:20, height:20, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", background:r?"rgba(16,185,129,0.14)":"rgba(239,68,68,0.1)" }}>
                                {r?<CheckCircle2 size={10} color="#10b981"/>:<XCircle size={10} color="#ef4444"/>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize:10, color:D.muted, marginTop:12 }}>Submitted {fmtDate(m.updated_at||m.created_at)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══ USER DETAIL DRAWER ══════════════════════════════════════════════ */}
      {selUser&&(
        <>
          <div onClick={()=>setSelUser(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:40, backdropFilter:"blur(5px)" }}/>
          <div style={{ position:"fixed", right:0, top:0, bottom:0, width:430, zIndex:50, background:"#0b0b1e", borderLeft:`1px solid ${D.border}`, overflowY:"auto", padding:26, boxShadow:"-20px 0 60px rgba(0,0,0,0.6)", animation:"adSlideIn 0.3s ease" }}>
            {/* Close */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <p style={{ fontSize:17, fontWeight:900, color:D.text }}>User Profile</p>
              <button onClick={()=>setSelUser(null)} style={{ width:32, height:32, borderRadius:10, background:D.card, border:`1px solid ${D.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:D.sub }}>
                <X size={13}/>
              </button>
            </div>

            {/* Profile hero */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"22px 16px", borderRadius:20, background:"rgba(124,58,237,0.07)", border:"1px solid rgba(124,58,237,0.18)", marginBottom:20 }}>
              <Avatar id={selUser.id} name={selUser.full_name} size={68} fs={22}/>
              <p style={{ fontSize:20, fontWeight:900, color:D.text, marginTop:12, letterSpacing:"-0.02em" }}>{selUser.full_name||"Unknown User"}</p>
              <p style={{ fontSize:13, color:D.sub, marginTop:4 }}>{selUser.email}</p>
              {selUser.occupation&&<p style={{ fontSize:12, color:D.muted, marginTop:3 }}>{selUser.occupation}</p>}
              <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap", justifyContent:"center" }}>
                {selUser.gender&&<Pill label={selUser.gender} color={D.vLight}/>}
                {selUser.age&&<Pill label={`${selUser.age} yrs`} color={D.cyan}/>}
              </div>
            </div>

            {/* Info rows */}
            <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:20 }}>
              {[
                {icon:Mail,     label:"Email",      val:selUser.email         },
                {icon:Phone,    label:"Phone",      val:selUser.phone_number  },
                {icon:User,     label:"Gender",     val:selUser.gender        },
                {icon:Hash,     label:"Age",        val:selUser.age?`${selUser.age} years`:null},
                {icon:Briefcase,label:"Occupation", val:selUser.occupation    },
                {icon:Calendar, label:"Joined",     val:fmtDate(selUser.created_at)},
              ].filter(r=>r.val).map(r=>(
                <div key={r.label} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px", borderRadius:13, background:D.card, border:`1px solid ${D.border}` }}>
                  <r.icon size={14} color={D.muted} style={{ flexShrink:0 }}/>
                  <span style={{ fontSize:10, fontWeight:700, color:D.muted, textTransform:"uppercase", letterSpacing:"0.1em", width:72, flexShrink:0 }}>{r.label}</span>
                  <span style={{ fontSize:13, color:D.sub, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* Finance summary */}
            {(()=>{
              const uf = userFinance(selUser.id);
              const inc  = uf.filter(f=>f.entry_type==="income").reduce((s,f)=>s+Number(f.amount),0);
              const exp  = uf.filter(f=>f.entry_type==="expense").reduce((s,f)=>s+Number(f.amount),0);
              const loan = uf.filter(f=>f.entry_type==="loan").reduce((s,f)=>s+Number(f.amount),0);
              const net  = inc-exp;
              return uf.length>0?(
                <div style={{ marginBottom:20 }}>
                  <p style={{ fontSize:10, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10 }}>Finance Summary</p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:12 }}>
                    {[
                      {label:"Income",   val:fmt(inc),  color:D.emerald },
                      {label:"Expense",  val:fmt(exp),  color:D.rose    },
                      {label:"Net Worth",val:fmt(net),  color:net>=0?D.emerald:D.rose},
                      {label:"Loans",    val:fmt(loan), color:D.amber   },
                    ].map(s=>(
                      <div key={s.label} style={{ background:`${s.color}0f`, border:`1px solid ${s.color}22`, borderRadius:13, padding:13 }}>
                        <p style={{ fontSize:10, color:D.muted, fontWeight:800, textTransform:"uppercase", marginBottom:6 }}>{s.label}</p>
                        <p style={{ fontSize:18, fontWeight:900, color:s.color }}>{s.val}</p>
                      </div>
                    ))}
                  </div>
                  {uf.length>0&&(
                    <div style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:13, padding:"12px 14px" }}>
                      <p style={{ fontSize:10, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.13em", marginBottom:8 }}>Recent Entries</p>
                      {uf.slice(-5).reverse().map(f=>(
                        <div key={f.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                          <div>
                            <p style={{ fontSize:12, fontWeight:700, color:D.sub }}>{f.source}</p>
                            <p style={{ fontSize:10, color:D.muted, textTransform:"capitalize" }}>{f.frequency} · {f.payment_mode}</p>
                          </div>
                          <span style={{ fontSize:13, fontWeight:800, color:f.entry_type==="income"?D.emerald:f.entry_type==="expense"?D.rose:D.amber }}>{f.entry_type==="expense"?"−":"+"}{fmt(f.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ):null;
            })()}

            {/* Mindset */}
            {(()=>{
              const ms = userMindset(selUser.id);
              if(!ms) return null;
              const score = Number(ms.score)||0;
              const sc = score>=75?D.emerald:score>=50?D.amber:D.rose;
              return (
                <div style={{ marginBottom:20 }}>
                  <p style={{ fontSize:10, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10 }}>Mindset Score</p>
                  <div style={{ display:"flex", alignItems:"center", gap:16, padding:"16px", background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.18)", borderRadius:16, marginBottom:10 }}>
                    <div style={{ position:"relative", width:64, height:64, flexShrink:0 }}>
                      <svg width="64" height="64" style={{ transform:"rotate(-90deg)" }}>
                        <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.07)" strokeWidth="5" fill="transparent"/>
                        <circle cx="32" cy="32" r="26" stroke={sc} strokeWidth="5" fill="transparent" strokeDasharray={2*Math.PI*26} strokeDashoffset={2*Math.PI*26*(1-score/100)} strokeLinecap="round"/>
                      </svg>
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:15, fontWeight:900, color:sc }}>{score}</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize:16, fontWeight:900, color:D.text }}>{score}/100</p>
                      <p style={{ fontSize:12, color:D.sub, marginTop:4 }}>{score>=75?"Strong mindset — performing well":score>=50?"Moderate — room to grow":"Needs attention"}</p>
                    </div>
                  </div>
                  {Array.isArray(ms.responses)&&ms.responses.length>0&&(
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {ms.responses.map((r,i)=>(
                        <div key={i} style={{ width:20, height:20, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", background:r?"rgba(16,185,129,0.14)":"rgba(239,68,68,0.1)" }}>
                          {r?<CheckCircle2 size={10} color="#10b981"/>:<XCircle size={10} color="#ef4444"/>}
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ fontSize:10, color:D.muted, marginTop:10 }}>Submitted {fmtDate(ms.updated_at)}</p>
                </div>
              );
            })()}

            {/* Health */}
            {(()=>{
              const h = userHealth(selUser.id);
              if(!h) return <div style={{ background:D.card, border:`1px solid ${D.border}`, borderRadius:16, padding:16 }}><p style={{ fontSize:10, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10 }}>Health Assessment</p><Empty icon={Activity} label="No assessment submitted"/></div>;
              return (
                <div>
                  <p style={{ fontSize:10, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10 }}>Health Assessment</p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:12 }}>
                    {[
                      {label:"Height",  val:h.height},
                      {label:"Weight",  val:h.weight},
                      {label:"Sleep",   val:h.sleeping_quality_hours?`${h.sleeping_quality_hours}h`:null},
                      {label:"Water",   val:h.water_intake?`${h.water_intake}L/day`:null},
                      {label:"Alcohol", val:h.alcohol?`${h.alcohol} units/wk`:null},
                      {label:"Activity",val:h.physical_activity},
                    ].filter(m=>m.val).map(m=>(
                      <div key={m.label} style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.13)", borderRadius:12, padding:11 }}>
                        <p style={{ fontSize:9, color:D.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{m.label}</p>
                        <p style={{ fontSize:14, fontWeight:800, color:D.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
                    {[
                      {label:"Headaches",        val:h.headache     },
                      {label:"Tired in morning", val:h.tired_morning},
                      {label:"Wake energy",      val:h.wake_energy  },
                      {label:"Body pain",        val:h.body_pain    },
                      {label:"Meditation",       val:h.meditation   },
                      {label:"Medication",       val:h.medication   },
                    ].filter(s=>s.val&&s.val!=="null").map(s=>{
                      const isYes = s.val==="yes"||s.val==="high";
                      const isNo  = s.val==="no"||s.val==="none";
                      return (
                        <div key={s.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <span style={{ fontSize:12, color:D.muted }}>{s.label}</span>
                          <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20, textTransform:"capitalize", background:isYes?"rgba(239,68,68,0.1)":isNo?"rgba(16,185,129,0.1)":"rgba(255,255,255,0.06)", color:isYes?D.rose:isNo?D.emerald:D.sub, border:`1px solid ${isYes?"rgba(239,68,68,0.22)":isNo?"rgba(16,185,129,0.22)":D.border}` }}>{s.val}</span>
                        </div>
                      );
                    })}
                  </div>
                  {h.others_text&&<div style={{ padding:12, background:"rgba(255,255,255,0.03)", border:`1px solid ${D.border}`, borderRadius:12 }}>
                    <p style={{ fontSize:9, fontWeight:800, color:D.muted, textTransform:"uppercase", letterSpacing:"0.13em", marginBottom:5 }}>Notes</p>
                    <p style={{ fontSize:12, color:D.sub, lineHeight:1.7 }}>{h.others_text}</p>
                  </div>}
                  <p style={{ fontSize:10, color:D.muted, marginTop:10 }}>Updated {fmtDate(h.updated_at)}</p>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes adSpin    { to { transform: rotate(360deg); } }
        @keyframes adSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.09); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
      `}</style>
    </div>
  );
}
