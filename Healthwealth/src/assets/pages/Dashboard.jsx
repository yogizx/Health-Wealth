import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { fetchFinanceEntries, fetchLatestMindsetAssessment, fetchLatestHealthAssessment } from "../../lib/api";
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function Dashboard({ activePage, setActivePage, onLogout, user }) {
  const [financeList, setFinanceList] = useState([]);
  const [mindsetScore, setMindsetScore] = useState(0);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch Finance
    fetchFinanceEntries(user.id).then(setFinanceList).catch(console.error);
    
    // Fetch Mindset
    fetchLatestMindsetAssessment(user.id).then(data => {
      if (data) setMindsetScore(data.score || 0);
    }).catch(console.error);
    
    // Fetch Health
    fetchLatestHealthAssessment(user.id).then(setHealthData).catch(console.error);
  }, [user]);

  const incomeList = financeList.filter(e => e.entry_type === "income");
  const expenseList = financeList.filter(e => e.entry_type === "expense");
  const loanList = financeList.filter(e => e.entry_type === "loan");
  
  const incomeTotal = incomeList.reduce((sum, item) => sum + Number(item.amount), 0);
  const loanTotal = loanList.reduce((sum, item) => sum + Number(item.amount), 0);

  // Parse expenses to extract categories
  const parsedExpenses = expenseList.map(item => {
    let category = "Essential";
    let name = item.source;
    if (item.source && item.source.startsWith("{")) {
      try {
        const parsed = JSON.parse(item.source);
        category = parsed.category || "Essential";
        name = parsed.name || "";
      } catch(e) {}
    }
    return { ...item, category, name };
  });

  const fixedSum = parsedExpenses.filter(e => e.category === "Fixed (EMI)").reduce((sum, item) => sum + Number(item.amount), 0);
  const essentialSum = parsedExpenses.filter(e => e.category === "Essential").reduce((sum, item) => sum + Number(item.amount), 0);
  const discretionarySum = parsedExpenses.filter(e => e.category === "Discretionary").reduce((sum, item) => sum + Number(item.amount), 0);
  const expenseTotal = fixedSum + essentialSum + discretionarySum;
  const currentBalance = incomeTotal - expenseTotal - loanTotal;

  const totalForPct = expenseTotal || 1;
  const fixedPct = expenseTotal > 0 ? Math.round((fixedSum / totalForPct) * 100) : 40;
  const essentialPct = expenseTotal > 0 ? Math.round((essentialSum / totalForPct) * 100) : 30;
  const discretionaryPct = expenseTotal > 0 ? 100 - fixedPct - essentialPct : 30;

  // Health / Sleep
  const displayedHours = healthData?.sleeping_quality_hours || "0";
  const displayedMinutes = healthData?.sleeping_quality_minutes || "0";
  const sleepDisplay = `${displayedHours}h ${displayedMinutes}m`;
  
  let healthScore = 80; // base score
  if (healthData) {
    if (healthData.body_pain === "yes") healthScore -= 10;
    if (healthData.headache === "yes") healthScore -= 10;
    if (healthData.tired_morning === "yes") healthScore -= 10;
    if (healthData.wake_energy === "yes") healthScore -= 10; 
    if (healthData.physical_activity === "yes") healthScore += 10;
    if (healthData.meditation === "yes") healthScore += 10;
  }
  healthScore = Math.min(100, Math.max(0, healthScore));

  const healthStatusText = healthScore > 80 ? "Optimal Vitality" : healthScore > 60 ? "Good" : "Needs Attention";

  const expenseColors = ["bg-blue-600", "bg-slate-400", "bg-rose-500"];

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col md:flex-row text-[#111827] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none"></div>
      
     <Sidebar
  activePage={activePage}
  setActivePage={setActivePage}
  onLogout={onLogout}
  user={user}
/>

      <main className="flex-1 md:h-screen md:overflow-y-auto pb-20 md:pb-0">
      <Navbar activePage={activePage} setActivePage={setActivePage} user={user} />

        <section className="px-4 md:px-10 py-6 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[32px] md:text-[48px] font-extrabold tracking-tight text-slate-900 leading-tight">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.user_name || 'Alex'}!
              </h1>
              <p className="text-[16px] md:text-[18px] text-gray-500 mt-1 font-medium">
                Here's a quick look at your health and wealth stats today.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-white/80 backdrop-blur-md p-2 pr-5 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
                {(user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email)?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Plan</p>
                <p className="text-sm font-bold text-slate-800">Premium Member</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-10">
            <StatCard title="TOTAL BALANCE" value={formatCurrency(currentBalance)} sub="Available Funds" icon={<CreditCard size={24} />} blue />
            <StatCard title="MONTHLY SPEND" value={formatCurrency(expenseTotal)} sub="Total Expenses" icon={<ShoppingCart size={24} />} red />
            <StatCard title="MINDSET SCORE" value={`${mindsetScore}/100`} sub="Current Progress" icon={<TrendingUp size={24} />} blue subBar />
            <StatCard title="HEALTH STATUS" value={`${healthScore}%`} sub={healthStatusText} icon={<Heart size={24} />} green />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-7 mt-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-sm transition-all hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <p className="tracking-[2px] text-slate-400 text-[12px] font-bold uppercase">
                    EXPENSE BREAKDOWN
                  </p>
                  <button className="text-[#0039a8] font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors" onClick={() => setActivePage('finance')}>
                    Details
                  </button>
                </div>

                {/* SVG Donut Chart with dynamic segments */}
                <div className="relative w-[180px] h-[180px] mx-auto mt-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md">
                    {/* Circle 1: Fixed (EMI) segment as base (Light Grey) */}
                    <circle cx="90" cy="90" r="75" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                    
                    {/* Circle 2: Essential segment (Orange) */}
                    {essentialPct > 0 && (
                      <circle
                        cx="90"
                        cy="90"
                        r="75"
                        stroke="#f97316"
                        strokeWidth="16"
                        fill="transparent"
                        strokeDasharray="471"
                        strokeDashoffset={471 - (471 * essentialPct) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    )}
                    
                    {/* Circle 3: Discretionary segment (Navy/Dark Blue) */}
                    {discretionaryPct > 0 && (
                      <circle
                        cx="90"
                        cy="90"
                        r="75"
                        stroke="#0f172a"
                        strokeWidth="16"
                        fill="transparent"
                        strokeDasharray="471"
                        strokeDashoffset={471 - (471 * discretionaryPct) / 100}
                        transform={`rotate(${(essentialPct) * 3.6} 90 90)`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <b className="text-[24px] text-slate-800 font-black tracking-tight">{formatCurrency(expenseTotal)}</b>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Spent</p>
                  </div>
                </div>

                {/* Legend list matching the mockup image */}
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-100/70 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-transparent flex-shrink-0"></span>
                      <p className="text-slate-700 font-bold text-[14px]">Fixed (EMI)</p>
                    </div>
                    <b className="text-slate-800 text-[15px]">{fixedPct}%</b>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-100/70 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#f97316] flex-shrink-0"></span>
                      <p className="text-slate-700 font-bold text-[14px]">Essential</p>
                    </div>
                    <b className="text-slate-800 text-[15px]">{essentialPct}%</b>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-100/70 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0f172a] flex-shrink-0"></span>
                      <p className="text-slate-700 font-bold text-[14px]">Discretionary</p>
                    </div>
                    <b className="text-slate-800 text-[15px]">{discretionaryPct}%</b>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-slate-50/50 rounded-2xl p-4 text-[13px] border border-slate-100 text-slate-500 font-medium leading-relaxed">
                Your total expenses this month are <b className="text-slate-800 font-bold">{formatCurrency(expenseTotal)}</b>.
              </div>
            </div>

            <div className="space-y-6 md:space-y-7">
              <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-sm flex items-center gap-6 md:gap-8 transition-all hover:shadow-2xl hover:-translate-y-1 group">
                <div className="relative w-[80px] h-[80px] md:w-[95px] md:h-[95px] shrink-0">
                   <svg className="w-full h-full transform -rotate-90">
                    <circle cx="47.5" cy="47.5" r="42" stroke="currentColor" strokeWidth="9" fill="transparent" className="text-slate-50" />
                    <circle cx="47.5" cy="47.5" r="42" stroke="currentColor" strokeWidth="9" fill="transparent" strokeDasharray="264" strokeDashoffset={264 - (264 * mindsetScore) / 100} className="text-emerald-500 rounded-full transition-all duration-1000 group-hover:stroke-emerald-400" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <b className="text-[20px] md:text-[22px] text-slate-800">{mindsetScore}%</b>
                  </div>
                </div>
                <div>
                  <h3 className="text-[20px] md:text-[22px] font-black text-slate-900">Mindset Progress</h3>
                  <p className="text-gray-500 mt-2 text-sm md:text-[17px] leading-relaxed font-medium">
                    You've achieved a score of <span className="text-emerald-600 font-bold">{mindsetScore}</span> in your mindset assessment.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0648d6] to-[#0433a3] p-8 md:p-10 text-white shadow-xl shadow-blue-200/50 hover:shadow-blue-300/60 transition-shadow">
                <div className="relative z-10">
                  <p className="text-[18px] md:text-[22px] italic leading-relaxed md:leading-9 font-medium opacity-95">
                    "The secret of change is to focus all of your energy, not on
                    fighting the old, but on building the new."
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-px w-8 bg-blue-300"></div>
                    <p className="font-bold text-sm tracking-widest uppercase text-blue-200 underline decoration-blue-400">Socrates</p>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-8 text-[180px] opacity-10 font-serif leading-none select-none">”</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 mt-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-sm transition-all hover:shadow-xl">
              <div className="flex justify-between items-start">
                <h2 className="text-[22px] md:text-[26px] font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                    <Moon size={22} className="fill-indigo-600" />
                  </div> 
                  Sleep Quality
                </h2>
                {healthData?.sleeping_quality_hours > 7 ? (
                  <span className="text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full font-bold text-xs tracking-widest uppercase">
                    EXCELLENT
                  </span>
                ) : (
                  <span className="text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full font-bold text-xs tracking-widest uppercase">
                    MODERATE
                  </span>
                )}
              </div>

              <div className="mt-8 flex items-baseline gap-2">
                <h3 className="text-[36px] md:text-[44px] font-black text-slate-900 tracking-tight">{sleepDisplay}</h3>
                <p className="text-gray-400 font-medium text-sm md:text-base">Last Night</p>
              </div>

              <div className="h-[60px] bg-slate-50 mt-8 flex items-end gap-1.5 px-2 pb-2 rounded-2xl border border-slate-100">
                {[18, 26, 38, 22, 44, 34, 40, 28, 50, 42].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-lg transition-all hover:scale-y-110 ${i === 8 ? "bg-indigo-600 shadow-md shadow-indigo-300" : "bg-indigo-200"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-sm transition-all hover:shadow-xl">
              <h2 className="text-[22px] md:text-[26px] font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                  <Zap size={22} className="fill-amber-600" />
                </div>
                Energy Levels
              </h2>

              <div className="flex justify-between mt-10">
                <p className="text-slate-600 font-medium">Current Reserve</p>
                <b className="text-amber-600 font-black text-xl">{healthData?.wake_energy === "no" ? "85%" : "45%"}</b>
              </div>

              <div className="h-4 bg-slate-100 rounded-full mt-4 p-1 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000" style={{ width: healthData?.wake_energy === "no" ? "85%" : "45%" }}></div>
              </div>

              <p className="mt-8 text-[15px] text-gray-500 leading-relaxed font-medium">
                {healthData?.wake_energy === "no" 
                  ? "Your energy levels are good. Maintain your current routine!"
                  : "You reported low wake energy. Try optimizing your sleep schedule."}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold tracking-widest text-slate-400">QUICK ACTIONS</p>
            <div className="flex flex-wrap gap-3 md:gap-5 mt-4">
              <ActionButton blue icon={<Plus />} text="Add Expense" onClick={() => setActivePage('finance')} />
              <ActionButton icon={<TrendingUp />} text="Update Health" onClick={() => setActivePage('health')} />
              <ActionButton icon={<HelpCircle />} text="Take Mindset Test" onClick={() => setActivePage('mindset')} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, sub, icon, blue, red, green, subBar }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 p-5 md:p-7 min-h-[140px] md:min-h-[160px] shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between">
        <p className="font-bold tracking-widest text-[10px] md:text-sm text-gray-400">{title}</p>
        <span className={`${blue ? "text-[#0648d6]" : red ? "text-red-600" : green ? "text-emerald-600" : "text-slate-600"}`}>
          {icon}
        </span>
      </div>

      <h2 className={`text-[28px] md:text-[36px] font-bold mt-2 md:mt-4 ${blue ? "text-[#0648d6]" : ""}`}>
        {value}
      </h2>

      {subBar ? (
        <div className="h-1.5 bg-gray-100 rounded-full mt-3 md:mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: value.replace('%','').replace('/100','') + '%' }}></div>
        </div>
      ) : (
        <p className={`mt-1 md:mt-2 text-[12px] md:text-sm ${green || blue ? "text-emerald-600 font-bold" : "text-gray-500"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Legend({ color, label, price }) {
  return (
    <div className="flex justify-between items-center bg-slate-50 p-2 px-4 rounded-xl transition hover:bg-slate-100">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${color} shadow-sm`}></span>
        <p className="text-slate-700 font-medium">{label}</p>
      </div>
      <b className="text-slate-900">{price}</b>
    </div>
  );
}

function ActionButton({ icon, text, blue, onClick }) {
  return (
    <button onClick={onClick} className={`h-[48px] md:h-[56px] px-5 md:px-8 rounded-xl border font-bold text-[14px] md:text-[18px] flex items-center gap-2 md:gap-3 transition-all ${
      blue ? "bg-gradient-to-r from-[#0757f6] to-blue-600 text-white shadow-lg shadow-blue-200/50 border-transparent hover:shadow-blue-300/60 hover:-translate-y-0.5" : "bg-white text-gray-700 border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5"
    }`}>
      {icon}
      {text}
    </button>
  );
}

export default Dashboard;