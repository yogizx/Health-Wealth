import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { User, Utensils, HeartPulse, Save } from "lucide-react";

function Health({ activePage, setActivePage, onLogout, sleepingQuality, onSaveSleepingQuality }) {
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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      sleepingQualityHours: sleepingQuality?.hours || "",
      sleepingQualityMinutes: sleepingQuality?.minutes || "",
    }));
  }, [sleepingQuality]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const savedSleepingQuality = {
      hours: formData.sleepingQualityHours || "0",
      minutes: formData.sleepingQualityMinutes || "0",
    };

    if (onSaveSleepingQuality) {
      onSaveSleepingQuality(savedSleepingQuality);
    }

    console.log("Health form data:", {
      ...formData,
      sleepingQuality: `${savedSleepingQuality.hours}h ${savedSleepingQuality.minutes}m`,
    });
  };

  return (
    <div className="h-screen bg-[#f6f8fc] flex text-[#111827] overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />

      <main className="flex-1 h-screen overflow-y-auto">
        <Navbar activePage={activePage} setActivePage={setActivePage} />

        <section className="px-10 py-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-[38px] font-extrabold">Health assessment</h1>
                <p className="text-[18px] text-gray-500 mt-2 max-w-2xl">
                  Enter your daily health details below to keep your profile current.
                </p>
              </div>
              <button
                onClick={handleSave}
                className="inline-flex h-[56px] items-center gap-3 rounded-xl bg-[#2563eb] px-6 text-white shadow-lg shadow-blue-200 transition hover:bg-[#1e4fc3]"
              >
                <Save size={20} /> Save all vitals
              </button>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-8">
                <section className="rounded-[32px] bg-white p-8 shadow-sm border border-gray-100">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                      <User size={22} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Basic Information</p>
                      <h2 className="text-2xl font-bold text-slate-900">Personal details</h2>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name">
                      <input
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
                      />
                    </Field>
                    <Field label="Male/Female">
                      <select
                        value={formData.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </Field>
                    <Field label="Age">
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                        placeholder="Enter age"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
                      />
                    </Field>
                    <Field label="Height">
                      <input
                        value={formData.height}
                        onChange={(e) => handleChange("height", e.target.value)}
                        placeholder="Enter height"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
                      />
                    </Field>
                    <Field label="Weight">
                      <input
                        value={formData.weight}
                        onChange={(e) => handleChange("weight", e.target.value)}
                        placeholder="Enter weight"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
                      />
                    </Field>
                  </div>
                </section>

                <section className="rounded-[32px] bg-white p-8 shadow-sm border border-gray-100">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-50 text-orange-600">
                      <Utensils size={22} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Eating Habits</p>
                      <h2 className="text-2xl font-bold text-slate-900">Nutrition details</h2>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-3xl border border-gray-200 bg-slate-50 p-4 text-sm text-gray-500 sm:grid-cols-[1.7fr_1fr_1fr]">
                    <span className="font-semibold text-slate-700">Eating Habits</span>
                    <span className="font-semibold text-slate-700">Remarks</span>
                    <span className="font-semibold text-slate-700">Measurement</span>
                  </div>

                  <HabitRow
                    label="Consumption of Tea/Coffee / Milk"
                    remark="Yes / No"
                    value={formData.teaCoffee}
                    onChange={(value) => handleChange("teaCoffee", value)}
                    type="yesnoquantity"
                    placeholder="0"
                  />
                  <HabitRow
                    label="Breakfast"
                    remark="what did you eat"
                    value={formData.breakfast}
                    onChange={(value) => handleChange("breakfast", value)}
                    type="text"
                    placeholder="Enter breakfast"
                  />
                  <HabitRow
                    label="Consumption quantity"
                    remark="Numbers"
                    value={formData.breakfastQuantity}
                    onChange={(value) => handleChange("breakfastQuantity", value)}
                    type="number"
                    placeholder="0"
                  />
                  <HabitRow
                    label="Lunch"
                    remark="what did you eat"
                    value={formData.lunch}
                    onChange={(value) => handleChange("lunch", value)}
                    type="text"
                    placeholder="Enter lunch"
                  />
                  <HabitRow
                    label="Consumption quantity"
                    remark="Numbers"
                    value={formData.lunchQuantity}
                    onChange={(value) => handleChange("lunchQuantity", value)}
                    type="number"
                    placeholder="0"
                  />
                  <HabitRow
                    label="Dinner"
                    remark="what did you eat"
                    value={formData.dinner}
                    onChange={(value) => handleChange("dinner", value)}
                    type="text"
                    placeholder="Enter dinner"
                  />
                  <HabitRow
                    label="Consumption quantity"
                    remark="Numbers"
                    value={formData.dinnerQuantity}
                    onChange={(value) => handleChange("dinnerQuantity", value)}
                    type="number"
                    placeholder="0"
                  />
                  <HabitRow
                    label="Snacks consumed in the day?"
                    remark="Mention your intake"
                    value={formData.snacks}
                    onChange={(value) => handleChange("snacks", value)}
                    type="text"
                    placeholder="Enter snacks"
                  />
                  <HabitRow
                    label="Consumption of Alcohol?"
                    remark="Numbers"
                    value={formData.alcohol}
                    onChange={(value) => handleChange("alcohol", value)}
                    type="number"
                    placeholder="0"
                  />
                  <HabitRow
                    label="Water Intake per Day"
                    remark="Numbers"
                    value={formData.waterIntake}
                    onChange={(value) => handleChange("waterIntake", value)}
                    type="number"
                    placeholder="0"
                  />
                  <HabitRow
                    label="Sleeping Quality"
                    remark="Hours & Minutes"
                    value={{
                      hours: formData.sleepingQualityHours,
                      minutes: formData.sleepingQualityMinutes,
                    }}
                    onChange={(value) => {
                      handleChange("sleepingQualityHours", value.hours);
                      handleChange("sleepingQualityMinutes", value.minutes);
                    }}
                    type="duration"
                  />
                </section>
              </div>

              <section className="rounded-[32px] bg-white p-8 shadow-sm border border-gray-100">
                <div className="mb-6 flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
                    <HeartPulse size={22} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Health Conditions</p>
                    <h2 className="text-2xl font-bold text-slate-900">Condition checklist</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <ConditionRow
                    label="Medication if any?"
                    value={formData.medication}
                    onChange={(value) => handleChange("medication", value)}
                  />
                  <ConditionRow
                    label="Headache/Giddiness"
                    value={formData.headache}
                    onChange={(value) => handleChange("headache", value)}
                  />
                  <ConditionRow
                    label="Tiredness in the morning?"
                    value={formData.tiredMorning}
                    onChange={(value) => handleChange("tiredMorning", value)}
                  />
                  <ConditionRow
                    label="Not able to wake up with energy?"
                    value={formData.wakeEnergy}
                    onChange={(value) => handleChange("wakeEnergy", value)}
                  />
                  <ConditionRow
                    label="Any pain in the body?"
                    value={formData.bodyPain}
                    onChange={(value) => handleChange("bodyPain", value)}
                  />
                  <ConditionRow
                    label="Are you doing any physical activity"
                    value={formData.physicalActivity}
                    onChange={(value) => handleChange("physicalActivity", value)}
                  />
                  <ConditionRow
                    label="Are you doing any meditation"
                    value={formData.meditation}
                    onChange={(value) => handleChange("meditation", value)}
                  />
                  <div className="rounded-[26px] border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900">Others</p>
                      <YesNoToggle
                        value={formData.othersYesNo}
                        onChange={(value) => handleChange("othersYesNo", value)}
                      />
                    </div>
                    <input
                      value={formData.othersText}
                      onChange={(e) => handleChange("othersText", e.target.value)}
                      placeholder="Add other details"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
      <h2 className="text-[28px] font-bold flex items-center gap-4 mb-7">
        <span className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Label({ text, extra }) {
  return (
    <p
      className={`text-[13px] tracking-widest text-gray-400 font-bold ${
        extra ? "mt-5 mb-2" : "mb-2"
      }`}
    >
      {text}
    </p>
  );
}

function Input({ value }) {
  return (
    <div className="h-[54px] bg-gray-100 rounded-lg px-4 flex items-center text-[17px] text-gray-600">
      {value}
    </div>
  );
}

function DurationInput({ hours, minutes, onChange }) {
  const handleHoursChange = (value) => {
    onChange({ hours: value.replace(/[^0-9]/g, ""), minutes });
  };

  const handleMinutesChange = (value) => {
    onChange({ hours, minutes: value.replace(/[^0-9]/g, "") });
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <input
          type="number"
          min="0"
          max="24"
          value={hours}
          onChange={(e) => handleHoursChange(e.target.value)}
          placeholder="hh"
          className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
        />
      </div>
      <div className="flex-1">
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => handleMinutesChange(e.target.value)}
          placeholder="mm"
          className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
        />
      </div>
    </div>
  );
}

function Toggle({ active }) {
  return (
    <div
      className={`w-[46px] h-[26px] rounded-full px-1 flex items-center ${
        active ? "bg-[#2563eb] justify-end" : "bg-slate-200 justify-start"
      }`}
    >
      <span className="w-[20px] h-[20px] bg-white rounded-full"></span>
    </div>
  );
}

function Meal({ icon, text, green, orange, yellow, purple }) {
  return (
    <div className="h-[54px] bg-white border border-gray-100 rounded-lg flex items-center gap-4 px-4 mb-3 shadow-sm">
      <span
        className={
          green
            ? "text-emerald-500"
            : orange
            ? "text-orange-500"
            : yellow
            ? "text-amber-500"
            : purple
            ? "text-indigo-400"
            : ""
        }
      >
        {icon}
      </span>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function Condition({ icon, text, active, slider }) {
  return (
    <div className="h-[60px] bg-gray-50 rounded-lg px-5 flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <span className="text-slate-400">{icon}</span>
        <p className="font-medium text-[17px]">{text}</p>
      </div>

      {slider ? (
        <div className="flex items-center gap-3 text-sm text-gray-400 font-bold">
          Low
          <div className="w-[105px] h-2 bg-gray-200 rounded-full relative">
            <span className="absolute left-[55%] top-[-5px] w-5 h-5 rounded-full bg-[#2563eb]"></span>
          </div>
          High
        </div>
      ) : (
        <Toggle active={active} />
      )}
    </div>
  );
}

function YesNo({ label, yes }) {
  return (
    <div className="h-[64px] border border-gray-100 rounded-lg flex items-center justify-between px-4">
      <p className="font-medium">{label}</p>
      <div className="bg-gray-100 rounded-md p-1 flex gap-1 text-xs font-bold">
        <button className={`px-3 py-2 rounded ${!yes ? "bg-white" : "text-gray-400"}`}>
          NO
        </button>
        <button
          className={`px-3 py-2 rounded ${
            yes ? "bg-[#2563eb] text-white" : "text-gray-400"
          }`}
        >
          YES
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">{label}</p>
      {children}
    </label>
  );
}

function HabitRow({ label, remark, value, onChange, type = "text", placeholder }) {
  return (
    <div className="grid items-center gap-4 rounded-[26px] border border-gray-200 bg-white p-4 text-sm sm:grid-cols-[1.7fr_1fr_1fr]">
      <p className="font-medium text-slate-800">{label}</p>
      <p className="text-sm text-slate-500">{remark}</p>
      {type === "yesno" ? (
        <YesNoToggle value={value} onChange={onChange} />
      ) : type === "yesnoquantity" ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <YesNoToggle
            value={value.selection}
            onChange={(selection) => onChange({ ...value, selection })}
          />
          {value.selection === "yes" && (
            <input
              type="number"
              min="0"
              value={value.amount}
              onChange={(e) => onChange({ ...value, amount: e.target.value })}
              placeholder={placeholder}
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
            />
          )}
        </div>
      ) : type === "duration" ? (
        <DurationInput
          hours={value.hours}
          minutes={value.minutes}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:bg-white"
        />
      )}
    </div>
  );
}

function ConditionRow({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-[26px] border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-medium text-slate-800">{label}</p>
      <YesNoToggle value={value} onChange={onChange} />
    </div>
  );
}

function YesNoToggle({ value, onChange }) {
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange("yes")}
        className={`px-4 py-2 transition ${value === "yes" ? "bg-[#2563eb] text-white" : "text-slate-600"}`}
      >
        YES
      </button>
      <button
        type="button"
        onClick={() => onChange("no")}
        className={`px-4 py-2 transition ${value === "no" ? "bg-[#2563eb] text-white" : "text-slate-600"}`}
      >
        NO
      </button>
    </div>
  );
}

export default Health;