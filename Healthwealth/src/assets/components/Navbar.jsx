import { Bell, Settings } from "lucide-react";

function Navbar({ activePage, setActivePage }) {
  return (
    <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-[20px] font-bold text-[#0757d8]">FinanceFlow</h1>

      <nav className="flex items-center gap-9 text-slate-600 font-medium">
        <button
          onClick={() => setActivePage("dashboard")}
          className={activePage === "dashboard" ? "text-[#0757d8] font-bold" : ""}
        >
          Dashboard
        </button>
        <button>Transactions</button>
        <button>Accounts</button>
        <button>Budgets</button>
      </nav>

      <div className="flex items-center gap-6">
        <Bell size={21} className="text-slate-600" />
        <Settings size={22} className="text-slate-600" />
        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
          👨🏽
        </div>
      </div>
    </header>
  );
}

export default Navbar;