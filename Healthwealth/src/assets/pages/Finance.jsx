import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  Plus,
  ReceiptText,
  ShoppingCart,
  Zap,
  Fuel,
  GraduationCap,
  Plane,
  BriefcaseMedical,
  AlertTriangle,
  Landmark,
  X,
} from "lucide-react";

const frequencyOptions = [
  "Daily",
  "Monthly",
  "Yearly",
  "Quarterly",
  "Half-Yearly",
  "Fortnight",
  "Others",
];

const paymentOptions = ["Bank", "Card", "UPI", "Cash"];

function Finance({ activePage, setActivePage, onLogout }) {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [incomeSource, setIncomeSource] = useState("");
  const [incomeFrequency, setIncomeFrequency] = useState("Monthly");
  const [incomeFrequencyOther, setIncomeFrequencyOther] = useState("");
  const [incomePaymentMode, setIncomePaymentMode] = useState("Bank");
  const [incomeAmount, setIncomeAmount] = useState("");

  const [expenseSource, setExpenseSource] = useState("");
  const [expenseFrequency, setExpenseFrequency] = useState("Monthly");
  const [expenseFrequencyOther, setExpenseFrequencyOther] = useState("");
  const [expensePaymentMode, setExpensePaymentMode] = useState("Bank");
  const [expenseAmount, setExpenseAmount] = useState("");

  const [loanList, setLoanList] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanSource, setLoanSource] = useState("");
  const [loanFrequency, setLoanFrequency] = useState("Monthly");
  const [loanFrequencyOther, setLoanFrequencyOther] = useState("");
  const [loanPaymentMode, setLoanPaymentMode] = useState("Bank");
  const [loanAmount, setLoanAmount] = useState("");

  const resetIncomeForm = () => {
    setIncomeSource("");
    setIncomeFrequency("Monthly");
    setIncomeFrequencyOther("");
    setIncomePaymentMode("Bank");
    setIncomeAmount("");
  };

  const resetExpenseForm = () => {
    setExpenseSource("");
    setExpenseFrequency("Monthly");
    setExpenseFrequencyOther("");
    setExpensePaymentMode("Bank");
    setExpenseAmount("");
  };

  const resetLoanForm = () => {
    setLoanSource("");
    setLoanFrequency("Monthly");
    setLoanFrequencyOther("");
    setLoanPaymentMode("Bank");
    setLoanAmount("");
  };

  const handleSaveIncome = () => {
    const source = incomeSource.trim();
    if (!source || !incomeAmount.trim()) return;

    const frequency =
      incomeFrequency === "Others" ? incomeFrequencyOther.trim() || "Others" : incomeFrequency;

    setIncomeList((prev) => [
      ...prev,
      {
        source,
        frequency,
        paymentMode: incomePaymentMode,
        amount: incomeAmount.trim(),
      },
    ]);
    setShowIncomeModal(false);
    resetIncomeForm();
  };

  const handleSaveExpense = () => {
    const source = expenseSource.trim();
    if (!source || !expenseAmount.trim()) return;

    const frequency =
      expenseFrequency === "Others"
        ? expenseFrequencyOther.trim() || "Others"
        : expenseFrequency;

    setExpenseList((prev) => [
      ...prev,
      {
        source,
        frequency,
        paymentMode: expensePaymentMode,
        amount: expenseAmount.trim(),
      },
    ]);
    setShowExpenseModal(false);
    resetExpenseForm();
  };

  const handleSaveLoan = () => {
    const source = loanSource.trim();
    if (!source || !loanAmount.trim()) return;

    const frequency =
      loanFrequency === "Others"
        ? loanFrequencyOther.trim() || "Others"
        : loanFrequency;

    setLoanList((prev) => [
      ...prev,
      {
        source,
        frequency,
        paymentMode: loanPaymentMode,
        amount: loanAmount.trim(),
      },
    ]);
    setShowLoanModal(false);
    resetLoanForm();
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
          <h1 className="text-[42px] font-extrabold">Financial Overview</h1>
          <p className="text-gray-500 text-[17px] mt-2">
            Good morning, Alex. Here's your status for June 2024.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <TopCard
              title="TOTAL INCOME"
              value={incomeList.length ? `${incomeList.length} sources` : "No data yet"}
              icon={<TrendingUp />}
              green
            />
            <TopCard
              title="TOTAL EXPENSES"
              value={expenseList.length ? `${expenseList.length} entries` : "No data yet"}
              icon={<TrendingDown />}
              orange
            />
            <div className="bg-[#0757f6] text-white rounded-xl p-7 shadow-lg shadow-blue-200">
              <div className="flex justify-between">
                <p className="tracking-widest text-[15px]">CURRENT BALANCE</p>
                <Wallet />
              </div>
              <h2 className="text-[34px] font-bold mt-5">{incomeList.length || expenseList.length ? "$0.00" : "—"}</h2>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_280px] gap-7 mt-9">
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-7 border-b border-gray-100">
                  <h2 className="text-[26px] font-bold text-emerald-800 flex items-center gap-2">
                    <Banknote size={22} /> Income Sources
                  </h2>
                </div>

                <div className="p-7">
                  <div className="grid grid-cols-4 text-xs tracking-widest text-gray-400 font-bold border-b pb-4">
                    <p>SOURCE</p>
                    <p>FREQUENCY</p>
                    <p>PAYMENT MODE</p>
                    <p className="text-right">AMOUNT</p>
                  </div>

                  {incomeList.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      No income sources added yet.
                    </div>
                  ) : (
                    incomeList.map((item, index) => (
                      <IncomeRow
                        key={`${item.source}-${index}`}
                        source={item.source}
                        frequency={item.frequency}
                        paymentMode={item.paymentMode}
                        amount={item.amount}
                      />
                    ))
                  )}
                </div>
                <div className="px-7 pb-7 flex justify-end">
                  <button
                    onClick={() => setShowIncomeModal(true)}
                    className="bg-emerald-600 text-white px-5 py-3 rounded-lg font-bold flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Income
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-7 border-b border-orange-50">
                  <h2 className="text-[26px] font-bold text-orange-800 flex items-center gap-2">
                    <ReceiptText size={24} /> Monthly Expenses
                  </h2>
                </div>

                <div className="p-7">
                  <div className="grid grid-cols-4 text-xs tracking-widest text-gray-400 font-bold border-b pb-4">
                    <p>SOURCE</p>
                    <p>FREQUENCY</p>
                    <p>PAYMENT MODE</p>
                    <p className="text-right">AMOUNT</p>
                  </div>

                  {expenseList.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      No expenses added yet. Click below to add expenses.
                    </div>
                  ) : (
                    expenseList.map((item, index) => (
                      <IncomeRow
                        key={`${item.source}-${index}`}
                        source={item.source}
                        frequency={item.frequency}
                        paymentMode={item.paymentMode}
                        amount={item.amount}
                      />
                    ))
                  )}

                  <div className="mt-7 flex justify-end">
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-orange-600 text-white px-5 py-3 rounded-lg font-bold flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Expenses
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-7 border-b border-slate-50">
                  <h2 className="text-[26px] font-bold text-slate-800">
                    Loan
                  </h2>
                </div>

                <div className="p-7">
                  <div className="grid grid-cols-4 text-xs tracking-widest text-gray-400 font-bold border-b pb-4">
                    <p>SOURCE</p>
                    <p>FREQUENCY</p>
                    <p>PAYMENT MODE</p>
                    <p className="text-right">AMOUNT</p>
                  </div>

                  {loanList.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      No loan entries added yet. Click below to add loans.
                    </div>
                  ) : (
                    loanList.map((item, index) => (
                      <IncomeRow
                        key={`${item.source}-${index}`}
                        source={item.source}
                        frequency={item.frequency}
                        paymentMode={item.paymentMode}
                        amount={item.amount}
                      />
                    ))
                  )}

                  <div className="mt-7 flex justify-end">
                    <button
                      onClick={() => setShowLoanModal(true)}
                      className="bg-slate-800 text-white px-5 py-3 rounded-lg font-bold flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Loan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-7">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="tracking-[3px] text-gray-400 text-[15px]">
                  SAVINGS GOAL: HOME RENOVATION
                </p>
                <div className="flex items-end gap-1 mt-5">
                  <h3 className="text-[26px] font-bold text-[#0757d8]">$14,200</h3>
                  <p className="text-gray-400 mb-1">/ $20,000</p>
                  <b className="ml-auto text-[#0757d8]">71%</b>
                </div>
                <div className="h-2 bg-gray-100 rounded-full mt-3">
                  <div className="h-2 bg-[#0757f6] rounded-full w-[71%]"></div>
                </div>
                <p className="italic text-gray-400 text-sm mt-4">
                  "You are $5,800 away from your milestone. Keep it up!"
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="tracking-[3px] text-gray-400 text-[15px]">
                  EXPENSE BREAKDOWN
                </p>

                <div className="w-[150px] h-[150px] mx-auto mt-7 rounded-full border-[14px] border-[#0757f6] border-l-orange-500 border-b-red-500 flex items-center justify-center">
                  <div className="text-center">
                    <b className="text-[26px]">$5.8k</b>
                    <p className="text-xs text-gray-400">Total Spent</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <BreakDot color="bg-[#0757f6]" text="Fixed (EMI)" percent="40%" />
                  <BreakDot color="bg-orange-500" text="Essential" percent="30%" />
                  <BreakDot color="bg-red-500" text="Discretionary" percent="30%" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-red-50">
                  <h2 className="text-[25px] font-bold text-red-800 flex items-center gap-2">
                    <Landmark /> Active Loans
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <LoanCard title="Housing Loan" amount="$245,000" tag="ACTIVE" />
                  <LoanCard title="Vehicle Loan" amount="$18,400" tag="ACTIVE" />
                  <LoanCard title="Jewel Loan" amount="$1,200" tag="90% PAID" green />
                </div>
              </div>
            </aside>
          </div>
        </section>

        {showIncomeModal && (
          <ModalShell title="Add Income" onClose={() => setShowIncomeModal(false)}>
            <div className="space-y-5">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="font-semibold mb-4">Payment</p>
                <div className="grid gap-4">
                  <label className="space-y-2">
                    <span className="font-semibold">Source</span>
                    <input
                      value={incomeSource}
                      onChange={(e) => setIncomeSource(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                      placeholder="Enter source"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Frequency</span>
                    <select
                      value={incomeFrequency}
                      onChange={(e) => setIncomeFrequency(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {incomeFrequency === "Others" && (
                      <input
                        value={incomeFrequencyOther}
                        onChange={(e) => setIncomeFrequencyOther(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-3"
                        placeholder="Enter frequency description"
                      />
                    )}
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Payment Mode</span>
                    <select
                      value={incomePaymentMode}
                      onChange={(e) => setIncomePaymentMode(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                    >
                      {paymentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Amount</span>
                    <input
                      value={incomeAmount}
                      onChange={(e) => setIncomeAmount(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                      placeholder="Enter amount"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowIncomeModal(false);
                    resetIncomeForm();
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveIncome}
                  disabled={!incomeSource.trim() || !incomeAmount.trim()}
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-white disabled:opacity-50"
                >
                  Add Income
                </button>
              </div>
            </div>
          </ModalShell>
        )}

        {showExpenseModal && (
          <ModalShell title="Add Expense" onClose={() => setShowExpenseModal(false)}>
            <div className="space-y-5">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="font-semibold mb-4">Payment</p>
                <div className="grid gap-4">
                  <label className="space-y-2">
                    <span className="font-semibold">Source</span>
                    <input
                      value={expenseSource}
                      onChange={(e) => setExpenseSource(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                      placeholder="Enter source"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Frequency</span>
                    <select
                      value={expenseFrequency}
                      onChange={(e) => setExpenseFrequency(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {expenseFrequency === "Others" && (
                      <input
                        value={expenseFrequencyOther}
                        onChange={(e) => setExpenseFrequencyOther(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-3"
                        placeholder="Enter frequency description"
                      />
                    )}
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Payment Mode</span>
                    <select
                      value={expensePaymentMode}
                      onChange={(e) => setExpensePaymentMode(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                    >
                      {paymentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Amount</span>
                    <input
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                      placeholder="Enter amount"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseModal(false);
                    resetExpenseForm();
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExpense}
                  disabled={!expenseSource.trim() || !expenseAmount.trim()}
                  className="rounded-xl bg-orange-600 px-5 py-3 text-white disabled:opacity-50"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </ModalShell>
        )}

        {showLoanModal && (
          <ModalShell title="Add Loan" onClose={() => setShowLoanModal(false)}>
            <div className="space-y-5">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="font-semibold mb-4">Payment</p>
                <div className="grid gap-4">
                  <label className="space-y-2">
                    <span className="font-semibold">Source</span>
                    <input
                      value={loanSource}
                      onChange={(e) => setLoanSource(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                      placeholder="Enter source"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Frequency</span>
                    <select
                      value={loanFrequency}
                      onChange={(e) => setLoanFrequency(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {loanFrequency === "Others" && (
                      <input
                        value={loanFrequencyOther}
                        onChange={(e) => setLoanFrequencyOther(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-3"
                        placeholder="Enter frequency description"
                      />
                    )}
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Payment Mode</span>
                    <select
                      value={loanPaymentMode}
                      onChange={(e) => setLoanPaymentMode(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                    >
                      {paymentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="font-semibold">Amount</span>
                    <input
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-3"
                      placeholder="Enter amount"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoanModal(false);
                    resetLoanForm();
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLoan}
                  disabled={!loanSource.trim() || !loanAmount.trim()}
                  className="rounded-xl bg-slate-800 px-5 py-3 text-white disabled:opacity-50"
                >
                  Add Loan
                </button>
              </div>
            </div>
          </ModalShell>
        )}
      </main>
    </div>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[22px] font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 hover:text-gray-900"
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TopCard({ title, value, icon, green, orange }) {
  return (
    <div
      className={`bg-white rounded-xl p-7 shadow-sm border-l-4 ${
        green ? "border-emerald-400" : orange ? "border-orange-500" : ""
      }`}
    >
      <div className="flex justify-between">
        <p className="tracking-widest text-gray-500">{title}</p>
        <span
          className={`p-2 rounded-md ${
            green ? "text-emerald-600 bg-emerald-50" : "text-orange-600 bg-orange-50"
          }`}
        >
          {icon}
        </span>
      </div>
      <h2
        className={`text-[34px] font-bold mt-5 ${
          green ? "text-emerald-600" : "text-orange-600"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

function IncomeRow({ source, frequency, paymentMode, amount }) {
  return (
    <div className="grid grid-cols-4 py-5 border-b border-gray-100 text-[15px] items-center">
      <div>
        <p>{source}</p>
      </div>
      <p className="text-gray-500">{frequency}</p>
      <p className="text-gray-500">{paymentMode}</p>
      <p className="text-right text-emerald-700 font-bold">{amount}</p>
    </div>
  );
}

function ExpenseItem({ icon, label, paymentMode, frequency, amount }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-slate-400">{icon}</span>
        <p className="font-semibold">{label}</p>
      </div>
      <p className="text-sm text-gray-500">Frequency: {frequency}</p>
      <p className="text-sm text-gray-500">Payment: {paymentMode}</p>
      <p className="mt-3 font-bold text-orange-700">{amount}</p>
    </div>
  );
}

function BreakDot({ color, text, percent }) {
  return (
    <div className="flex justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <p>{text}</p>
      </div>
      <b>{percent}</b>
    </div>
  );
}

function LoanCard({ title, amount, tag, green }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex justify-between">
        <b>{title}</b>
        <span
          className={`text-xs px-2 py-1 rounded-full font-bold ${
            green ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          {tag}
        </span>
      </div>
      <h3 className="text-red-700 font-bold text-[20px] mt-3">{amount}</h3>
      <p className="text-xs text-gray-400 mt-1">Monthly: $450 • 2y left</p>
    </div>
  );
}

export default Finance;