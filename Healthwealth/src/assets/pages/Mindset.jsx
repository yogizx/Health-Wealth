import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  LayoutDashboard,
  Wallet,
  Brain,
  Activity,
  User,
  Search,
  Bell,
  HelpCircle,
  Lightbulb,
  TrafficCone,
  Trophy,
  BarChart3,
} from "lucide-react";

const mindsetItems = [
  "I create my life",
  "Life happens to me",
  "Playing to win",
  "Playing not to lose",
  "Committed",
  "They just want",
  "Think big",
  "Think small",
  "Opportunities",
  "Obstacles",
  "Admire other rich and successful people",
  "Resent",
  "Associate with positive people",
  "Associate with negative people",
  "Promote themselves",
  "Negative about promotion",
  "Bigger than their problem",
  "Smaller than their problem",
  "Excellent receivers",
  "Poor receivers",
  "Paid based on results",
  "Paid based on time",
  "Think both",
  "Think either/or",
  "Networth",
  "Working income",
  "Manage their money well",
  "Mismanage their money well",
  "Their money work hard for them",
  "They work hard for the money",
  "Act inspite of fear",
  "Stop bcos of fear",
  "Constantly learn and grow",
  "They think they know",
];

function Mindset({ activePage, setActivePage, onLogout }) {
  const [responses, setResponses] = useState(
    new Array(mindsetItems.length).fill(false)
  );

  const yesCount = responses.filter(Boolean).length;
  const percentage = Math.round((yesCount / mindsetItems.length) * 100);

  const toggleResponse = (index) => {
    setResponses((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };
  return (
   <div className="h-screen bg-[#f6f8fc] flex text-[#111827] overflow-hidden">
  <Sidebar
    activePage={activePage}
    setActivePage={setActivePage}
    onLogout={onLogout}
  />

  <main className="flex-1 h-screen overflow-y-auto">
    <Navbar activePage={activePage} setActivePage={setActivePage} />
    
        <section className="px-10 py-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-[42px] font-extrabold">Psychology of success</h1>
                <p className="text-gray-500 text-[18px] mt-3 max-w-2xl">
                  Analyze and refine your mental framework for peak performance.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold">
                  34 statements
                </span>
                <span className="rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold">
                  yes / no assessment
                </span>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.75fr_1fr]">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-7 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                      <BarChart3 size={18} /> mindset matrix
                    </div>
                    <h2 className="mt-4 text-[28px] font-bold text-slate-900">Mindset assessment</h2>
                    <p className="mt-2 text-gray-500 max-w-2xl">
                      Respond to each statement with yes or no to reveal your mindset profile.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 text-center">
                      <p className="text-xs uppercase tracking-[1px] text-gray-500">completed</p>
                      <p className="mt-2 text-[24px] font-bold text-slate-900">{yesCount}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 text-center">
                      <p className="text-xs uppercase tracking-[1px] text-gray-500">total</p>
                      <p className="mt-2 text-[24px] font-bold text-slate-900">34</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 text-center">
                      <p className="text-xs uppercase tracking-[1px] text-gray-500">score</p>
                      <p className="mt-2 text-[24px] font-bold text-slate-900">{percentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-1">
                  {mindsetItems.map((text, index) => (
                    <MatrixRow
                      key={index}
                      text={text}
                      on={responses[index]}
                      onToggle={() => toggleResponse(index)}
                    />
                  ))}
                </div>

                <div className="p-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">Use the switches to mark each response and track your mindset score.</p>
                  <div className="flex gap-3">
                    <button className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      Reset all
                    </button>
                    <button className="rounded-xl bg-[#0757d8] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/40 hover:bg-[#0646b0]">
                      Save analysis
                    </button>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                  <p className="text-sm font-semibold uppercase tracking-[1px] text-gray-400">
                    overall mindset
                  </p>
                  <div className="mt-7 flex items-center justify-center">
                    <div className="relative flex h-[190px] w-[190px] items-center justify-center rounded-full bg-green-50">
                      <div className="absolute inset-0 rounded-full border-8 border-green-200"></div>
                      <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-white shadow-inner">
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-[1px] text-gray-400">progress</p>
                          <p className="text-[44px] font-extrabold text-green-600">{percentage}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-[28px] font-bold text-slate-900">{yesCount}/{mindsetItems.length}</p>
                    <p className="mt-2 text-sm text-gray-500">positive mindset answers</p>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[1px] text-gray-400">confidence</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{Math.max(40, percentage)}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[1px] text-gray-400">readiness</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{Math.min(100, percentage + 15)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-7">
                  <h2 className="text-[26px] font-bold">Key insights</h2>
                  <Insight
                    icon={<Lightbulb />}
                    title="Dominant growth"
                    text="Your 'Think big' and 'Growth' traits are highly developed, leading your success path."
                    blue
                  />
                  <Insight
                    icon={<TrafficCone />}
                    title="Obstacle handling"
                    text="You see challenges as opportunities, a core trait of peak performers."
                    orange
                  />
                  <Insight
                    icon={<Trophy />}
                    title="Elite performance"
                    text="Top 5% of participants share your specific mindset profile."
                    yellow
                  />
                </div>

                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#112f93] to-[#0c1b55] p-7 text-white shadow-sm">
                  <div className="absolute inset-0 bg-white/5"></div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold tracking-[2px]">UPGRADE TO PRO</p>
                    <h3 className="text-[20px] font-bold mt-2">Get AI-driven mentorship</h3>
                    <p className="mt-4 text-sm text-slate-200">
                      Unlock guided habit plans and mindset coaching that adapts to your profile.
                    </p>
                    <button className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10">
                      Explore plans
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MenuItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[50px] px-4 rounded-lg flex items-center gap-4 ${
        active ? "bg-blue-50 text-[#0757d8] font-semibold" : "text-slate-600"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

function MatrixRow({ text, on, onToggle }) {
  return (
    <div className="h-[58px] px-5 flex items-center justify-between border-b border-gray-50">
      <p className="text-[16px]">{text}</p>

      <div className="flex items-center gap-4 text-sm font-bold">
        <span className={on ? "text-gray-400" : "text-green-600"}>NO</span>
        <button
          type="button"
          onClick={onToggle}
          className={`w-[44px] h-[24px] rounded-full px-1 flex items-center transition ${
            on ? "bg-green-500 justify-end" : "bg-gray-200 justify-start"
          }`}
        >
          <span className="w-[18px] h-[18px] bg-white rounded-full"></span>
        </button>
        <span className={on ? "text-green-600" : "text-gray-400"}>YES</span>
      </div>
    </div>
  );
}

function Insight({ icon, title, text, blue, orange, yellow }) {
  return (
    <div className="flex gap-4 mt-7">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          blue
            ? "bg-blue-50 text-blue-600"
            : orange
            ? "bg-orange-50 text-orange-600"
            : yellow
            ? "bg-yellow-50 text-yellow-600"
            : ""
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[16px]">{title}</h3>
        <p className="text-gray-500 leading-6 mt-1">{text}</p>
      </div>
    </div>
  );
}

export default Mindset;