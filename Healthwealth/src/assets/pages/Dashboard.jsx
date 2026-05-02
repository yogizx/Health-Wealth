import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Plus,
  CreditCard,
  ShoppingCart,
  Heart,
  HelpCircle,
  Moon,
  Zap,
  TrendingUp,
} from "lucide-react";

function Dashboard({ activePage, setActivePage, onLogout, sleepingQuality }) {
  const displayedHours = sleepingQuality?.hours || "0";
  const displayedMinutes = sleepingQuality?.minutes || "0";
  const sleepDisplay = `${displayedHours}h ${displayedMinutes}m`;

  return (
    <div className="h-screen bg-[#f6f8fc] flex text-[#111827] overflow-hidden">
     <Sidebar
  activePage={activePage}
  setActivePage={setActivePage}
  onLogout={onLogout}
/>

      <main className="flex-1 h-screen overflow-y-auto">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

        <section className="px-8 py-8">
          <h1 className="text-[44px] font-extrabold leading-tight">
            Good Morning, Alex
          </h1>
          <p className="text-[18px] text-gray-600 mt-2">
            Here's what's happening with your lifestyle stats today.
          </p>

          <div className="grid grid-cols-4 gap-7 mt-8">
            <StatCard title="BALANCE" value="₹12,450.00" sub="↗ +2.4% this month" icon={<CreditCard />} blue />
            <StatCard title="MONTHLY EXPENSES" value="₹3,120.45" sub="Target: ₹3,500.00" icon={<ShoppingCart />} red />
            <StatCard title="MINDSET SCORE" value="84/100" subBar icon={<HelpCircle />} />
            <StatCard title="HEALTH SCORE" value="92%" sub="Optimal State" icon={<Heart />} green />
          </div>

          <div className="grid grid-cols-2 gap-7 mt-8">
            <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
              <div className="flex justify-between">
                <h2 className="text-[28px] font-bold">Expense Breakdown</h2>
                <a className="text-[#0039a8] font-bold">View Report</a>
              </div>

              <div className="flex items-center gap-10 mt-8">
                <div className="w-[145px] h-[145px] rounded-full border-[17px] border-gray-100 border-t-[#094bd6] border-l-[#094bd6] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm">Food</p>
                    <b className="text-xl">45%</b>
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  <Legend color="bg-[#094bd6]" label="Housing" price="₹1,200" />
                  <Legend color="bg-slate-500" label="Food & Dining" price="₹850" />
                  <Legend color="bg-[#9b1c0b]" label="Transport" price="₹350" />
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-xl p-5 text-[16px] leading-7">
                Your income was <b className="text-green-600">₹5,200</b> this month,
                leaving a net saving of <b className="text-[#0648d6]">₹2,080.</b>
              </div>
            </div>

            <div className="space-y-7">
              <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm flex items-center gap-8">
                <div className="w-[90px] h-[90px] rounded-full border-[8px] border-gray-100 border-l-slate-600 border-t-slate-600 flex items-center justify-center">
                  <b className="text-[24px]">76%</b>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold">Daily Mindset Progress</h3>
                  <p className="text-gray-600 mt-1">
                    You've completed 4 of 6 focus tasks today.
                  </p>
                </div>
              </div>

              <div className="bg-[#0648d6] text-white rounded-xl p-8 min-h-[200px] relative overflow-hidden">
                <p className="text-[23px] italic leading-9 font-medium">
                  "The secret of change is to focus all of your energy, not on
                  fighting the old, but on building the new."
                </p>
                <p className="font-bold mt-6">— Socrates</p>
                <div className="absolute right-6 top-0 text-[120px] opacity-10 font-bold">”</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-7 mt-8">
            <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
              <div className="flex justify-between">
                <h2 className="text-[28px] font-bold flex items-center gap-3">
                  <Moon className="text-blue-400 fill-blue-400" /> Sleep Quality
                </h2>
                <span className="text-green-600 bg-green-50 px-4 py-1 rounded-full font-bold text-sm">
                  EXCELLENT
                </span>
              </div>

              <div className="mt-6 flex items-end gap-3">
                <h3 className="text-[42px] font-extrabold">{sleepDisplay}</h3>
                <p className="text-gray-600 mb-3">Last Night</p>
              </div>

              <div className="h-[48px] bg-gray-100 mt-5 flex items-end gap-1 px-1 pb-1">
                {[18, 26, 38, 22, 44, 34].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i === 5 ? "bg-[#0648d6]" : "bg-blue-300"}`}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm">
              <h2 className="text-[28px] font-bold flex items-center gap-3">
                <Zap className="text-orange-400 fill-orange-400" /> Energy Levels
              </h2>

              <div className="flex justify-between mt-7">
                <p>Current Energy</p>
                <b className="text-[#0648d6]">82%</b>
              </div>

              <div className="h-3 bg-gray-100 rounded-full mt-3">
                <div className="h-3 bg-[#0648d6] rounded-full w-[82%]"></div>
              </div>

              <p className="mt-6 text-[16px] text-gray-700 leading-7">
                Your energy peaks between 10 AM and 1 PM. It's the best time for deep work.
              </p>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold tracking-widest">QUICK ACTIONS</p>
            <div className="flex gap-5 mt-4">
              <ActionButton blue icon={<Plus />} text="Add Expense" />
              <ActionButton icon={<TrendingUp />} text="Update Health" />
              <ActionButton icon={<HelpCircle />} text="Take Mindset Test" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, sub, icon, blue, red, green, subBar }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-7 min-h-[160px] shadow-sm">
      <div className="flex justify-between">
        <p className="font-bold tracking-widest text-sm text-gray-700">{title}</p>
        <span className={`${blue ? "text-[#0648d6]" : red ? "text-red-600" : green ? "text-green-600" : "text-slate-600"}`}>
          {icon}
        </span>
      </div>

      <h2 className={`text-[36px] font-bold mt-4 ${blue ? "text-[#0648d6]" : ""}`}>
        {value}
      </h2>

      {subBar ? (
        <div className="h-1 bg-gray-100 rounded-full mt-4">
          <div className="h-1 bg-blue-100 rounded-full w-[84%]"></div>
        </div>
      ) : (
        <p className={`mt-2 text-sm ${green || blue ? "text-green-600 font-bold" : "text-gray-500"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Legend({ color, label, price }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <p className="text-gray-700">{label}</p>
      </div>
      <b>{price}</b>
    </div>
  );
}

function ActionButton({ icon, text, blue }) {
  return (
    <button className={`h-[56px] px-8 rounded-xl border font-bold text-[18px] flex items-center gap-3 ${
      blue ? "bg-[#0757f6] text-white shadow-lg shadow-blue-200 border-[#0757f6]" : "bg-white text-gray-900 border-gray-200"
    }`}>
      {icon}
      {text}
    </button>
  );
}

export default Dashboard;