import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  fetchLatestMindsetAssessment,
  saveMindsetAssessment,
} from "../../lib/api";
import {
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

function Mindset({ activePage, setActivePage, onLogout, user }) {
  const [responses, setResponses] = useState(
    new Array(mindsetItems.length).fill(false)
  );

  useEffect(() => {
    if (!user?.id) return;

    fetchLatestMindsetAssessment(user.id)
      .then((assessment) => {
        if (assessment?.responses?.length) {
          setResponses(
            mindsetItems.map((_, index) => Boolean(assessment.responses[index]))
          );
        }
      })
      .catch((error) => alert(error.message));
  }, [user]);

  const yesCount = responses.filter(Boolean).length;
  const percentage = Math.round((yesCount / mindsetItems.length) * 100);

  const toggleResponse = (index) => {
    setResponses((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const resetResponses = () => {
    setResponses(new Array(mindsetItems.length).fill(false));
  };

  const handleSave = async () => {
    try {
      if (user?.id) {
        await saveMindsetAssessment(user.id, responses, percentage);
      }
      alert("Mindset analysis saved.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-brand-400/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none"></div>
      
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
        user={user}
      />

      <main className="flex-1 md:h-screen md:overflow-y-auto pb-20 md:pb-0">
        <Navbar activePage={activePage} setActivePage={setActivePage} user={user} />
        
        <section className="px-4 md:px-10 py-6 md:py-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-[32px] md:text-[42px] font-extrabold tracking-tight text-slate-900">Psychology of success</h1>
                <p className="text-gray-500 text-[18px] mt-3 max-w-2xl font-medium">
                  Analyze and refine your mental framework for peak performance.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold shadow-sm">
                  34 statements
                </span>
                <span className="rounded-full bg-brand-50 text-brand-700 px-4 py-2 text-sm font-semibold shadow-sm">
                  yes / no assessment
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:gap-8 xl:grid-cols-[1.75fr_1fr]">
              <div className="glass-card rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-lg">
                <div className="p-7 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-3 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 shadow-inner">
                      <BarChart3 size={18} /> mindset matrix
                    </div>
                    <h2 className="mt-4 text-[24px] md:text-[28px] font-bold text-slate-900">Mindset assessment</h2>
                    <p className="mt-2 text-gray-500 max-w-2xl">
                      Respond to each statement with yes or no to reveal your mindset profile.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 text-center shadow-inner">
                      <p className="text-xs uppercase tracking-[1px] text-gray-500 font-bold">completed</p>
                      <p className="mt-2 text-[24px] font-bold text-slate-900">{yesCount}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 text-center shadow-inner">
                      <p className="text-xs uppercase tracking-[1px] text-gray-500 font-bold">total</p>
                      <p className="mt-2 text-[24px] font-bold text-slate-900">34</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 text-center shadow-inner">
                      <p className="text-xs uppercase tracking-[1px] text-gray-500 font-bold">score</p>
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

                <div className="p-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
                  <p className="text-sm text-gray-500 font-medium">Use the switches to mark each response and track your mindset score.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={resetResponses}
                      className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 shadow-sm"
                    >
                      Reset all
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded-xl bg-gradient-to-r from-[#0757d8] to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200/50 hover:shadow-brand-300/60 hover:-translate-y-0.5 transition-all"
                    >
                      Save analysis
                    </button>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="glass-card rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-lg transition-shadow">
                  <p className="text-sm font-semibold uppercase tracking-[1px] text-gray-400">
                    overall mindset
                  </p>
                  <div className="mt-7 flex items-center justify-center">
                    <div className="relative flex h-[190px] w-[190px] items-center justify-center rounded-full bg-green-50 shadow-inner">
                      <div className="absolute inset-0 rounded-full border-8 border-green-200 transition-all"></div>
                      <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-white shadow-lg">
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-[1px] text-gray-400 font-bold">progress</p>
                          <p className="text-[44px] font-extrabold text-emerald-600 tracking-tighter">{percentage}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-[28px] font-bold text-slate-900">{yesCount}/{mindsetItems.length}</p>
                    <p className="mt-2 text-sm text-gray-500 font-medium">positive mindset answers</p>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="rounded-3xl bg-slate-50 p-4 shadow-inner">
                      <p className="text-xs uppercase tracking-[1px] text-gray-400 font-bold">confidence</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{Math.max(40, percentage)}%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 shadow-inner">
                      <p className="text-xs uppercase tracking-[1px] text-gray-400 font-bold">readiness</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{Math.min(100, percentage + 15)}%</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm p-5 md:p-7 hover:shadow-lg transition-shadow">
                  <h2 className="text-[26px] font-bold text-slate-900">Key insights</h2>
                  {responses[6] && (
                    <Insight
                      icon={<Lightbulb />}
                      title="Dominant growth"
                      text="Your 'Think big' trait is highly developed, leading your success path."
                      blue
                    />
                  )}
                  {responses[8] && (
                    <Insight
                      icon={<TrafficCone />}
                      title="Opportunity Focus"
                      text="You see challenges as opportunities, a core trait of peak performers."
                      orange
                    />
                  )}
                  {percentage >= 80 && (
                    <Insight
                      icon={<Trophy />}
                      title="Elite performance"
                      text="Top 20% of participants share your specific elite mindset profile."
                      yellow
                    />
                  )}
                  {!responses[6] && !responses[8] && percentage < 80 && (
                    <Insight
                      icon={<BarChart3 />}
                      title="Room for Growth"
                      text="Focus on embracing challenges and thinking bigger to unlock your full potential."
                      blue
                    />
                  )}
                </div>

                <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-[#112f93] to-[#0c1b55] p-6 md:p-7 text-white shadow-xl shadow-brand-900/20 hover:shadow-brand-900/40 transition-shadow">
                  <div className="absolute inset-0 bg-white/5"></div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold tracking-[2px] text-brand-200">UPGRADE TO PRO</p>
                    <h3 className="text-[20px] font-bold mt-2 text-white">Get AI-driven mentorship</h3>
                    <p className="mt-4 text-sm text-brand-100/80 leading-relaxed">
                      Unlock guided habit plans and mindset coaching that adapts to your profile.
                    </p>
                    <button className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-transform">
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

function MatrixRow({ text, on, onToggle }) {
  return (
    <div className="h-[64px] px-6 flex items-center justify-between border-b border-gray-50 transition-all hover:bg-brand-50/50 group">
      <p className="text-[16px] font-medium text-slate-700 group-hover:text-brand-900 transition-colors">{text}</p>

      <div className="flex items-center gap-4 text-[11px] font-black tracking-widest">
        <span className={on ? "text-gray-300" : "text-rose-500"}>NO</span>
        <button
          type="button"
          onClick={onToggle}
          className={`w-[48px] h-[26px] rounded-full px-1 flex items-center transition-all duration-300 shadow-inner ${
            on ? "bg-emerald-500 justify-end shadow-emerald-600/50" : "bg-rose-500 justify-start shadow-rose-600/50"
          }`}
        >
          <div className="w-[18px] h-[18px] bg-white rounded-full shadow-sm"></div>
        </button>
        <span className={on ? "text-emerald-500" : "text-gray-300"}>YES</span>
      </div>
    </div>
  );
}

function Insight({ icon, title, text, blue, orange, yellow }) {
  return (
    <div className="flex gap-4 mt-7 transition-all hover:translate-x-1 group">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
          blue
            ? "bg-brand-50 text-brand-600 group-hover:bg-brand-100"
            : orange
            ? "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
            : yellow
            ? "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100"
            : ""
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[17px] text-slate-800 group-hover:text-brand-900 transition-colors">{title}</h3>
        <p className="text-gray-500 leading-6 mt-1 text-sm font-medium">{text}</p>
      </div>
    </div>
  );
}

export default Mindset;
