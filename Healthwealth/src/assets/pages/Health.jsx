import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Activity,
  Apple,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Coffee,
  Droplets,
  HeartPulse,
  Moon,
  RefreshCw,
  Save,
  Salad,
  User,
  Utensils,
  Zap,
} from "lucide-react";
import { fetchLatestHealthAssessment, saveHealthAssessment } from "../../lib/api";

function Health({ activePage, setActivePage, onLogout, user, sleepingQuality, onSaveSleepingQuality }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    teaCoffee: { selection: "", amount: "" },
    breakfast: "",
    breakfastQuantity: "",
    lunch: "",
    lunchQuantity: "",
    dinner: "",
    dinnerQuantity: "",
    snacks: "",
    alcohol: "",
    waterIntake: "",
    sleepingQualityHours: sleepingQuality?.hours || "",
    sleepingQualityMinutes: sleepingQuality?.minutes || "",
    medication: "",
    headache: "",
    tiredMorning: "",
    wakeEnergy: "",
    bodyPain: "",
    physicalActivity: "",
    meditation: "",
    othersText: "",
    othersYesNo: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetchLatestHealthAssessment(user.id)
      .then((assessment) => {
        if (!assessment) return;
        setFormData({
          name: assessment.name || "",
          gender: assessment.gender || "",
          age: assessment.age?.toString() || "",
          height: assessment.height || "",
          weight: assessment.weight || "",
          teaCoffee: assessment.tea_coffee || { selection: "", amount: "" },
          breakfast: assessment.breakfast || "",
          breakfastQuantity: assessment.breakfast_quantity?.toString() || "",
          lunch: assessment.lunch || "",
          lunchQuantity: assessment.lunch_quantity?.toString() || "",
          dinner: assessment.dinner || "",
          dinnerQuantity: assessment.dinner_quantity?.toString() || "",
          snacks: assessment.snacks || "",
          alcohol: assessment.alcohol?.toString() || "",
          waterIntake: assessment.water_intake?.toString() || "",
          sleepingQualityHours: assessment.sleeping_quality_hours?.toString() || "",
          sleepingQualityMinutes: assessment.sleeping_quality_minutes?.toString() || "",
          medication: assessment.medication || "",
          headache: assessment.headache || "",
          tiredMorning: assessment.tired_morning || "",
          wakeEnergy: assessment.wake_energy || "",
          bodyPain: assessment.body_pain || "",
          physicalActivity: assessment.physical_activity || "",
          meditation: assessment.meditation || "",
          othersText: assessment.others_text || "",
          othersYesNo: assessment.others_yes_no || "",
        });
        if (onSaveSleepingQuality) {
          onSaveSleepingQuality({
            hours: assessment.sleeping_quality_hours?.toString() || "0",
            minutes: assessment.sleeping_quality_minutes?.toString() || "0",
          });
        }
      })
      .catch((err) => alert(err.message));
  }, [user, onSaveSleepingQuality]);

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg("");
    try {
      if (user?.id) await saveHealthAssessment(user.id, formData);
      if (onSaveSleepingQuality) {
        onSaveSleepingQuality({
          hours: formData.sleepingQualityHours || "0",
          minutes: formData.sleepingQualityMinutes || "0",
        });
      }
      setSaveMsg("Health details saved successfully!");
      setTimeout(() => setSaveMsg(""), 4000);
    } catch (err) {
      setSaveMsg("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMsg("");
    try {
      if (user?.id) {
        const assessment = await fetchLatestHealthAssessment(user.id);
        if (assessment) {
          setFormData({
            name: assessment.name || "",
            gender: assessment.gender || "",
            age: assessment.age?.toString() || "",
            height: assessment.height || "",
            weight: assessment.weight || "",
            teaCoffee: assessment.tea_coffee || { selection: "", amount: "" },
            breakfast: assessment.breakfast || "",
            breakfastQuantity: assessment.breakfast_quantity?.toString() || "",
            lunch: assessment.lunch || "",
            lunchQuantity: assessment.lunch_quantity?.toString() || "",
            dinner: assessment.dinner || "",
            dinnerQuantity: assessment.dinner_quantity?.toString() || "",
            snacks: assessment.snacks || "",
            alcohol: assessment.alcohol?.toString() || "",
            waterIntake: assessment.water_intake?.toString() || "",
            sleepingQualityHours: assessment.sleeping_quality_hours?.toString() || "",
            sleepingQualityMinutes: assessment.sleeping_quality_minutes?.toString() || "",
            medication: assessment.medication || "",
            headache: assessment.headache || "",
            tiredMorning: assessment.tired_morning || "",
            wakeEnergy: assessment.wake_energy || "",
            bodyPain: assessment.body_pain || "",
            physicalActivity: assessment.physical_activity || "",
            meditation: assessment.meditation || "",
            othersText: assessment.others_text || "",
            othersYesNo: assessment.others_yes_no || "",
          });
        }
      }
      setSyncMsg("Data synchronized successfully!");
      setTimeout(() => setSyncMsg(""), 4000);
    } catch (err) {
      setSyncMsg("Sync failed: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Derived health score (simple calculation based on filled conditions)
  const conditionFields = ["medication", "headache", "tiredMorning", "wakeEnergy", "bodyPain"];
  const positiveFields = ["physicalActivity", "meditation"];
  const conditionScore = conditionFields.filter((f) => formData[f] === "no").length;
  const positiveScore = positiveFields.filter((f) => formData[f] === "yes").length;
  const totalScore = Math.round(((conditionScore + positiveScore) / (conditionFields.length + positiveFields.length)) * 100);
  const scoreColor = totalScore >= 70 ? "#22c55e" : totalScore >= 40 ? "#f59e0b" : "#ef4444";
  const scoreLabel = totalScore >= 70 ? "Excellent" : totalScore >= 40 ? "Fair" : "Needs Attention";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} user={user} />

      <main className="flex-1 md:h-screen md:overflow-y-auto pb-24 md:pb-0">
        <Navbar activePage={activePage} setActivePage={setActivePage} user={user} />

        <section className="px-4 md:px-10 py-6 md:py-10 max-w-6xl mx-auto">
          {/* ── Page Header ───────────────────────────────────── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Daily Tracking</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Health Assessment</h1>
              <p className="text-gray-500 mt-1 text-sm">Keep your health profile up to date every day.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#2563eb] px-6 text-white shadow-lg shadow-brand-200 transition hover:bg-[#1d4ed8] font-bold disabled:opacity-60"
            >
              <Save size={18} /> {isSaving ? "Saving…" : "Save All Vitals"}
            </button>
          </div>

          {saveMsg && (
            <div className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold border ${
              saveMsg.startsWith("Error") ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              <CheckCircle2 size={16} /> {saveMsg}
            </div>
          )}

          {/* ── Top Row: Health Score + Personal Details ──────── */}
          <div className="grid gap-6 md:grid-cols-[200px_1fr] mb-8">
            {/* Global Health Score */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Global Health Score</p>
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f4ff" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={scoreColor} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - totalScore / 100)}`}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold" style={{ color: scoreColor }}>{totalScore}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">/ 100</span>
                </div>
              </div>
              <p className="mt-2 text-sm font-bold" style={{ color: scoreColor }}>{scoreLabel}</p>
              <p className="text-xs text-gray-400 mt-1">Based on today's data</p>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Basic Information</p>
                  <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <HealthField label="Name" icon={<User size={14} />}>
                  <input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your name"
                    className="health-input"
                  />
                </HealthField>
                <HealthField label="Gender" icon={<Activity size={14} />}>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="health-input"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Others</option>
                  </select>
                </HealthField>
                <HealthField label="Age" icon={<Zap size={14} />}>
                  <input
                    type="number" min="1" max="120"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="Years"
                    className="health-input"
                  />
                </HealthField>
                <HealthField label="Height" icon={<ArrowRight size={14} />}>
                  <input
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="cm / ft"
                    className="health-input"
                  />
                </HealthField>
                <HealthField label="Weight" icon={<Activity size={14} />}>
                  <input
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="kg / lbs"
                    className="health-input"
                  />
                </HealthField>
              </div>
            </div>
          </div>

          {/* ── Main Content Grid ───────────────────────────────── */}
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

            {/* ── Nutrition Details ────────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 md:p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                  <Utensils size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Eating Habits</p>
                  <h2 className="text-xl font-bold text-slate-900">Nutrition Details</h2>
                </div>
              </div>

              <div className="space-y-3">
                {/* Tea/Coffee */}
                <NutriCard icon={<Coffee size={16} />} color="amber" label="Tea / Coffee / Milk">
                  <div className="flex flex-wrap items-center gap-3">
                    <YesNoToggle
                      value={formData.teaCoffee.selection}
                      onChange={(v) => handleChange("teaCoffee", { ...formData.teaCoffee, selection: v })}
                    />
                    {formData.teaCoffee.selection === "yes" && (
                      <input
                        type="number" min="0"
                        value={formData.teaCoffee.amount}
                        onChange={(e) => handleChange("teaCoffee", { ...formData.teaCoffee, amount: e.target.value })}
                        placeholder="Cups"
                        className="w-24 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400"
                      />
                    )}
                  </div>
                </NutriCard>

                {/* Breakfast */}
                <NutriCard icon={<Apple size={16} />} color="rose" label="Breakfast">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={formData.breakfast}
                      onChange={(e) => handleChange("breakfast", e.target.value)}
                      placeholder="What did you eat?"
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-rose-300"
                    />
                    <input
                      type="number" min="0"
                      value={formData.breakfastQuantity}
                      onChange={(e) => handleChange("breakfastQuantity", e.target.value)}
                      placeholder="Qty"
                      className="w-24 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-rose-300"
                    />
                  </div>
                </NutriCard>

                {/* Lunch */}
                <NutriCard icon={<Salad size={16} />} color="green" label="Lunch">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={formData.lunch}
                      onChange={(e) => handleChange("lunch", e.target.value)}
                      placeholder="What did you eat?"
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-300"
                    />
                    <input
                      type="number" min="0"
                      value={formData.lunchQuantity}
                      onChange={(e) => handleChange("lunchQuantity", e.target.value)}
                      placeholder="Qty"
                      className="w-24 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-green-300"
                    />
                  </div>
                </NutriCard>

                {/* Dinner */}
                <NutriCard icon={<Moon size={16} />} color="indigo" label="Dinner">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={formData.dinner}
                      onChange={(e) => handleChange("dinner", e.target.value)}
                      placeholder="What did you eat?"
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                    />
                    <input
                      type="number" min="0"
                      value={formData.dinnerQuantity}
                      onChange={(e) => handleChange("dinnerQuantity", e.target.value)}
                      placeholder="Qty"
                      className="w-24 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                    />
                  </div>
                </NutriCard>

                {/* Snacks */}
                <NutriCard icon={<Utensils size={16} />} color="purple" label="Snacks">
                  <input
                    value={formData.snacks}
                    onChange={(e) => handleChange("snacks", e.target.value)}
                    placeholder="Mention your intake"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-purple-300"
                  />
                </NutriCard>

                {/* Alcohol */}
                <NutriCard icon={<Activity size={16} />} color="red" label="Alcohol (units)">
                  <input
                    type="number" min="0"
                    value={formData.alcohol}
                    onChange={(e) => handleChange("alcohol", e.target.value)}
                    placeholder="0"
                    className="w-28 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-red-300"
                  />
                </NutriCard>

                {/* Water */}
                <NutriCard icon={<Droplets size={16} />} color="blue" label="Water Intake (glasses/day)">
                  <input
                    type="number" min="0"
                    value={formData.waterIntake}
                    onChange={(e) => handleChange("waterIntake", e.target.value)}
                    placeholder="0"
                    className="w-28 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand-300"
                  />
                </NutriCard>

                {/* Sleep */}
                <NutriCard icon={<Moon size={16} />} color="violet" label="Sleeping Quality">
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min="0" max="24"
                      value={formData.sleepingQualityHours}
                      onChange={(e) => handleChange("sleepingQualityHours", e.target.value)}
                      placeholder="hh"
                      className="w-20 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-300"
                    />
                    <span className="text-gray-400 text-sm font-semibold">h</span>
                    <input
                      type="number" min="0" max="59"
                      value={formData.sleepingQualityMinutes}
                      onChange={(e) => handleChange("sleepingQualityMinutes", e.target.value)}
                      placeholder="mm"
                      className="w-20 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-300"
                    />
                    <span className="text-gray-400 text-sm font-semibold">m</span>
                  </div>
                </NutriCard>
              </div>
            </div>

            {/* ── Condition Checklist ─────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 md:p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Health Conditions</p>
                  <h2 className="text-xl font-bold text-slate-900">Condition Checklist</h2>
                </div>
              </div>

              <div className="space-y-2.5">
                <ConditionItem
                  label="Medication" subtext="Taking any medication?"
                  value={formData.medication} onChange={(v) => handleChange("medication", v)}
                  accent="blue"
                />
                <ConditionItem
                  label="Headache / Giddiness" subtext="Experiencing headache?"
                  value={formData.headache} onChange={(v) => handleChange("headache", v)}
                  accent="red"
                />
                <ConditionItem
                  label="Morning Tiredness" subtext="Tired after waking up?"
                  value={formData.tiredMorning} onChange={(v) => handleChange("tiredMorning", v)}
                  accent="orange"
                />
                <ConditionItem
                  label="Low Wake Energy" subtext="Not energetic in the morning?"
                  value={formData.wakeEnergy} onChange={(v) => handleChange("wakeEnergy", v)}
                  accent="amber"
                />
                <ConditionItem
                  label="Body Pain" subtext="Any pain in the body?"
                  value={formData.bodyPain} onChange={(v) => handleChange("bodyPain", v)}
                  accent="rose"
                />
                <ConditionItem
                  label="Physical Activity" subtext="Exercised today?"
                  value={formData.physicalActivity} onChange={(v) => handleChange("physicalActivity", v)}
                  accent="green"
                />
                <ConditionItem
                  label="Meditation" subtext="Any meditation session?"
                  value={formData.meditation} onChange={(v) => handleChange("meditation", v)}
                  accent="violet"
                />

                {/* Others */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Others</p>
                      <p className="text-xs text-gray-400">Any other conditions?</p>
                    </div>
                    <YesNoToggle
                      value={formData.othersYesNo}
                      onChange={(v) => handleChange("othersYesNo", v)}
                    />
                  </div>
                  {formData.othersYesNo === "yes" && (
                    <input
                      value={formData.othersText}
                      onChange={(e) => handleChange("othersText", e.target.value)}
                      placeholder="Describe other conditions…"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563eb]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Synchronize Your Data ──────────────────────────── */}
          <div className="mt-8 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center flex-shrink-0">
                  <Cloud size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white text-lg md:text-xl font-extrabold">Synchronize Your Data</h3>
                  <p className="text-brand-100 text-sm mt-0.5">
                    Pull the latest saved data from cloud to keep everything in sync.
                  </p>
                  {syncMsg && (
                    <p className={`text-xs mt-1 font-semibold ${syncMsg.startsWith("Sync failed") ? "text-red-200" : "text-emerald-200"}`}>
                      {syncMsg}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-shrink-0 flex items-center gap-2.5 bg-white text-[#2563eb] font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-70 disabled:scale-100"
              >
                <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? "Syncing…" : "Sync Now"}
              </button>
            </div>
            <div className="bg-gradient-to-r from-brand-600/10 via-indigo-600/10 to-purple-600/10 border border-t-0 border-brand-100 px-6 py-3 flex flex-wrap gap-6">
              <SyncStat icon={<Activity size={14} />} label="Health Data" value="Auto-saved" />
              <SyncStat icon={<Moon size={14} />} label="Sleep Tracking" value={formData.sleepingQualityHours ? `${formData.sleepingQualityHours}h ${formData.sleepingQualityMinutes || 0}m` : "—"} />
              <SyncStat icon={<Droplets size={14} />} label="Water Intake" value={formData.waterIntake ? `${formData.waterIntake} glasses` : "—"} />
              <SyncStat icon={<HeartPulse size={14} />} label="Health Score" value={`${totalScore}/100`} />
            </div>
          </div>

        </section>
      </main>

      <style>{`
        .health-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 10px 14px;
          font-size: 14px;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .health-input:focus {
          border-color: #2563eb;
          background: #fff;
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HealthField({ label, icon, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        {icon} {label}
      </p>
      {children}
    </div>
  );
}

const accentMap = {
  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-100" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
  red: { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
  blue: { bg: "bg-brand-50", text: "text-brand-600", border: "border-brand-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
};

function NutriCard({ icon, color, label, children }) {
  const accent = accentMap[color] || accentMap.blue;
  return (
    <div className={`rounded-2xl border ${accent.border} bg-white p-4 transition-all hover:shadow-sm`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className={`flex items-center gap-2 sm:w-44 flex-shrink-0`}>
          <div className={`w-7 h-7 rounded-lg ${accent.bg} ${accent.text} flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <p className="text-sm font-semibold text-slate-700 leading-tight">{label}</p>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

const conditionAccentMap = {
  blue: { dot: "bg-brand-500", tag: "bg-brand-50 text-brand-700" },
  red: { dot: "bg-red-500", tag: "bg-red-50 text-red-600" },
  orange: { dot: "bg-orange-500", tag: "bg-orange-50 text-orange-600" },
  amber: { dot: "bg-amber-500", tag: "bg-amber-50 text-amber-700" },
  rose: { dot: "bg-rose-500", tag: "bg-rose-50 text-rose-600" },
  green: { dot: "bg-green-500", tag: "bg-green-50 text-green-700" },
  violet: { dot: "bg-violet-500", tag: "bg-violet-50 text-violet-700" },
};

function ConditionItem({ label, subtext, value, onChange, accent }) {
  const a = conditionAccentMap[accent] || conditionAccentMap.blue;
  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:bg-gray-50 ${
      value === "yes" ? "border-red-200 bg-red-50/30" : value === "no" ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${a.dot}`} />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{label}</p>
          <p className="text-xs text-gray-400 truncate">{subtext}</p>
        </div>
      </div>
      <YesNoToggle value={value} onChange={onChange} />
    </div>
  );
}

function YesNoToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-gray-200 bg-gray-100 p-1 text-[11px] font-black tracking-widest shadow-inner flex-shrink-0">
      <button
        type="button"
        onClick={() => onChange("yes")}
        className={`rounded-full px-4 py-1.5 transition-all duration-300 ${
          value === "yes"
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        YES
      </button>
      <button
        type="button"
        onClick={() => onChange("no")}
        className={`rounded-full px-4 py-1.5 transition-all duration-300 ${
          value === "no"
            ? "bg-rose-500 text-white shadow-md shadow-rose-200"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        NO
      </button>
    </div>
  );
}

function SyncStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-brand-400">{icon}</span>
      <span className="text-xs text-gray-500">{label}:</span>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}

export default Health;
