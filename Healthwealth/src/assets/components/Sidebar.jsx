import {
  LayoutDashboard,
  Wallet,
  Brain,
  Dumbbell,
  User,
  LogOut,
} from "lucide-react";

function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <aside className="w-[240px] h-screen bg-white border-r border-gray-200 shrink-0 px-4 py-7 flex flex-col justify-between">
      <div>
        <h1 className="text-[20px] font-bold text-[#0757d8] px-2">
          FinanceFlow
        </h1>

        <nav className="mt-20 space-y-3">
          <MenuItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
          />
          <MenuItem
            icon={<Wallet size={20} />}
            text="Finance"
            active={activePage === "finance"}
            onClick={() => setActivePage("finance")}
          />
          <MenuItem
            icon={<Brain size={20} />}
            text="Mindset"
            active={activePage === "mindset"}
            onClick={() => setActivePage("mindset")}
          />
          <MenuItem
            icon={<Dumbbell size={20} />}
            text="Health"
            active={activePage === "health"}
            onClick={() => setActivePage("health")}
          />
          <MenuItem
            icon={<User size={20} />}
            text="Profile"
            active={activePage === "profile"}
            onClick={() => setActivePage("profile")}
          />
        </nav>
      </div>

      <button
        onClick={onLogout}
        className="h-[50px] w-full bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2"
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}

function MenuItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[46px] px-4 flex items-center gap-4 text-left rounded-sm border-r-4 ${
        active
          ? "bg-blue-50 text-[#0757d8] border-[#0757d8] font-semibold"
          : "text-slate-600 border-transparent"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

export default Sidebar;