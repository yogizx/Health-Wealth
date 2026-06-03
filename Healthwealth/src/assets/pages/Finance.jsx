import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { createFinanceEntry, fetchFinanceEntries, deleteFinanceEntry, updateFinanceEntry } from "../../lib/api";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  Plus,
  ReceiptText,
  Landmark,
  X,
  Edit2
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

function Finance({ activePage, setActivePage, onLogout, user }) {
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
  const [expenseCategory, setExpenseCategory] = useState("Essential");

  const [loanList, setLoanList] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanSource, setLoanSource] = useState("");
  const [loanFrequency, setLoanFrequency] = useState("Monthly");
  const [loanFrequencyOther, setLoanFrequencyOther] = useState("");
  const [loanPaymentMode, setLoanPaymentMode] = useState("Bank");
  const [loanAmount, setLoanAmount] = useState("");

  // New states for dynamic loan inputs
  const [loanCategory, setLoanCategory] = useState("bank"); // "bank" or "individual"
  const [loanBankName, setLoanBankName] = useState("");
  const [loanType, setLoanType] = useState("Personal Loan");
  const [loanEmiAmount, setLoanEmiAmount] = useState("");
  const [loanEmiDuration, setLoanEmiDuration] = useState("");
  const [loanEmiStartDate, setLoanEmiStartDate] = useState("");
  const [loanLenderName, setLoanLenderName] = useState("");
  const [loanInterestRate, setLoanInterestRate] = useState("");

  const [editingEntry, setEditingEntry] = useState(null);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    if (entry.type === "income") {
      setIncomeSource(entry.source);
      setIncomeFrequency(frequencyOptions.includes(entry.frequency) ? entry.frequency : "Others");
      if (!frequencyOptions.includes(entry.frequency)) setIncomeFrequencyOther(entry.frequency);
      setIncomePaymentMode(entry.paymentMode);
      setIncomeAmount(entry.amount);
      setShowIncomeModal(true);
    } else if (entry.type === "expense") {
      let cat = "Essential";
      let name = entry.source;
      if (entry.source.startsWith("{")) {
        try {
          const parsed = JSON.parse(entry.source);
          cat = parsed.category || "Essential";
          name = parsed.name || "";
        } catch (e) {}
      }
      setExpenseSource(name);
      setExpenseCategory(cat);
      setExpenseFrequency(frequencyOptions.includes(entry.frequency) ? entry.frequency : "Others");
      if (!frequencyOptions.includes(entry.frequency)) setExpenseFrequencyOther(entry.frequency);
      setExpensePaymentMode(entry.paymentMode);
      setExpenseAmount(entry.amount);
      setShowExpenseModal(true);
    } else if (entry.type === "loan") {
      let parsed = { category: "bank", bankName: entry.source, loanType: "Loan" };
      try {
        if (entry.source.startsWith("{")) {
          parsed = JSON.parse(entry.source);
        }
      } catch (e) {}

      setLoanCategory(parsed.category || "bank");
      if (parsed.category === "bank") {
        setLoanBankName(parsed.bankName || "");
        setLoanType(parsed.loanType || "Personal Loan");
        setLoanEmiAmount(parsed.emiAmount || "");
        setLoanEmiDuration(parsed.emiDuration || "");
        setLoanEmiStartDate(parsed.emiStartDate || "");
      } else {
        setLoanLenderName(parsed.borrowerName || parsed.lenderName || "");
        setLoanInterestRate(parsed.interestRate || "");
        setLoanEmiDuration(parsed.repaymentDuration || "");
        setLoanEmiStartDate(parsed.loanStartDate || "");
      }

      setLoanFrequency(frequencyOptions.includes(entry.frequency) ? entry.frequency : "Others");
      if (!frequencyOptions.includes(entry.frequency)) setLoanFrequencyOther(entry.frequency);
      setLoanPaymentMode(entry.paymentMode);
      setLoanAmount(entry.amount);
      setShowLoanModal(true);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchFinanceEntries(user.id)
      .then((entries) => {
        const mappedEntries = entries.map(mapFinanceEntry);
        setIncomeList(mappedEntries.filter((entry) => entry.type === "income"));
        setExpenseList(mappedEntries.filter((entry) => entry.type === "expense"));
        setLoanList(mappedEntries.filter((entry) => entry.type === "loan"));
      })
      .catch((error) => alert(error.message));
  }, [user]);

  const incomeTotal = sumAmounts(incomeList);
  const expenseTotal = sumAmounts(expenseList);
  const loanTotal = sumAmounts(loanList);
  const currentBalance = incomeTotal - expenseTotal - loanTotal;

  // Calculate dynamic expense category percentages
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
  const totalForPct = expenseTotal || 1;
  const fixedPct = expenseTotal > 0 ? Math.round((fixedSum / totalForPct) * 100) : 40;
  const essentialPct = expenseTotal > 0 ? Math.round((essentialSum / totalForPct) * 100) : 30;
  const discretionaryPct = expenseTotal > 0 ? 100 - fixedPct - essentialPct : 30;

  const resetIncomeForm = () => {
    setIncomeSource("");
    setIncomeFrequency("Monthly");
    setIncomeFrequencyOther("");
    setIncomePaymentMode("Bank");
    setIncomeAmount("");
    setEditingEntry(null);
  };

  const resetExpenseForm = () => {
    setExpenseSource("");
    setExpenseFrequency("Monthly");
    setExpenseFrequencyOther("");
    setExpensePaymentMode("Bank");
    setExpenseAmount("");
    setExpenseCategory("Essential");
    setEditingEntry(null);
  };

  const resetLoanForm = () => {
    setLoanSource("");
    setLoanFrequency("Monthly");
    setLoanFrequencyOther("");
    setLoanPaymentMode("Bank");
    setLoanAmount("");
    setLoanCategory("bank");
    setLoanBankName("");
    setLoanType("Personal Loan");
    setLoanEmiAmount("");
    setLoanEmiDuration("");
    setLoanEmiStartDate("");
    setLoanLenderName("");
    setLoanInterestRate("");
    setEditingEntry(null);
  };

  const handleSaveIncome = async () => {
    const source = incomeSource.trim();
    if (!source || !incomeAmount.toString().trim()) return;

    const frequency =
      incomeFrequency === "Others" ? incomeFrequencyOther.trim() || "Others" : incomeFrequency;

    try {
      if (editingEntry) {
        const updated = await updateFinanceEntry(editingEntry.id, {
          source, frequency, paymentMode: incomePaymentMode, amount: incomeAmount.toString().trim()
        });
        setIncomeList(prev => prev.map(e => e.id === editingEntry.id ? mapFinanceEntry(updated) : e));
      } else {
        const savedEntry = await createFinanceEntry(user.id, {
          type: "income",
          source,
          frequency,
          paymentMode: incomePaymentMode,
          amount: incomeAmount.toString().trim(),
        });
        setIncomeList((prev) => [...prev, mapFinanceEntry(savedEntry)]);
      }
      setShowIncomeModal(false);
      resetIncomeForm();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveExpense = async () => {
    const source = JSON.stringify({ category: expenseCategory, name: expenseSource.trim() });
    if (!expenseSource.trim() || !expenseAmount.toString().trim()) return;

    const frequency =
      expenseFrequency === "Others"
        ? expenseFrequencyOther.trim() || "Others"
        : expenseFrequency;

    try {
      if (editingEntry) {
        const updated = await updateFinanceEntry(editingEntry.id, {
          source, frequency, paymentMode: expensePaymentMode, amount: expenseAmount.toString().trim()
        });
        setExpenseList(prev => prev.map(e => e.id === editingEntry.id ? mapFinanceEntry(updated) : e));
      } else {
        const savedEntry = await createFinanceEntry(user.id, {
          type: "expense",
          source,
          frequency,
          paymentMode: expensePaymentMode,
          amount: expenseAmount.toString().trim(),
        });
        setExpenseList((prev) => [...prev, mapFinanceEntry(savedEntry)]);
      }
      setShowExpenseModal(false);
      resetExpenseForm();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveLoan = async () => {
    let sourceObj = {};
    if (loanCategory === "bank") {
      sourceObj = {
        category: "bank",
        bankName: loanBankName.trim(),
        loanType: loanType.trim(),
        emiAmount: loanEmiAmount.toString().trim(),
        emiDuration: loanEmiDuration.trim(),
        emiStartDate: loanEmiStartDate,
      };
    } else {
      sourceObj = {
        category: "individual",
        borrowerName: loanLenderName.trim(),
        interestRate: loanInterestRate.toString().trim(),
        repaymentDuration: loanEmiDuration.trim(),
        loanStartDate: loanEmiStartDate,
      };
    }
    const source = JSON.stringify(sourceObj);
    if (!loanAmount.toString().trim()) return;

    const frequency =
      loanFrequency === "Others"
        ? loanFrequencyOther.trim() || "Others"
        : loanFrequency;

    try {
      if (editingEntry) {
        const updated = await updateFinanceEntry(editingEntry.id, {
          source, frequency, paymentMode: loanPaymentMode, amount: loanAmount.toString().trim()
        });
        setLoanList(prev => prev.map(e => e.id === editingEntry.id ? mapFinanceEntry(updated) : e));
      } else {
        const savedEntry = await createFinanceEntry(user.id, {
          type: "loan",
          source,
          frequency,
          paymentMode: loanPaymentMode,
          amount: loanAmount.toString().trim(),
        });
        setLoanList((prev) => [...prev, mapFinanceEntry(savedEntry)]);
      }
      setShowLoanModal(false);
      resetLoanForm();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteFinanceEntry(entryId);
      setIncomeList(prev => prev.filter(e => e.id !== entryId));
      setExpenseList(prev => prev.filter(e => e.id !== entryId));
      setLoanList(prev => prev.filter(e => e.id !== entryId));
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

      <main className="flex-1 md:h-screen md:overflow-y-auto pb-20 md:pb-0 relative z-10">
        <Navbar activePage={activePage} setActivePage={setActivePage} user={user} />

        <section className="px-4 md:px-10 py-6 md:py-10">
          <h1 className="text-[32px] md:text-[42px] font-extrabold tracking-tight text-slate-900">Financial Overview</h1>
          <p className="text-slate-500 text-[17px] mt-2 font-medium">
            Good morning, {user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.user_name || 'Alex'}. Track your wealth efficiently.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8">
            <TopCard
              title="TOTAL INCOME"
              value={incomeList.length ? formatCurrency(incomeTotal) : "No data yet"}
              icon={<TrendingUp />}
              green
            />
            <TopCard
              title="TOTAL EXPENSES"
              value={expenseList.length ? formatCurrency(expenseTotal) : "No data yet"}
              icon={<TrendingDown />}
              orange
            />
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-indigo-700 text-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-xl shadow-brand-900/10 hover:shadow-brand-900/20 transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Wallet size={120} />
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <p className="tracking-[2px] font-bold text-[12px] md:text-[14px] text-brand-200">CURRENT BALANCE</p>
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Wallet size={20} className="text-white" />
                </div>
              </div>
              <h2 className="relative z-10 text-[32px] md:text-[42px] font-black tracking-tight mt-6 md:mt-8">
                {incomeList.length || expenseList.length || loanList.length ? formatCurrency(currentBalance) : "—"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 md:gap-8 mt-10">
            <div className="space-y-8">
              {/* INCOME SECTION */}
              <div className="glass-card rounded-[32px] shadow-sm border border-white overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 md:p-8 border-b border-gray-100/50 flex justify-between items-center bg-emerald-50/30">
                  <h2 className="text-[22px] md:text-[26px] font-black text-emerald-800 flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600 shadow-inner">
                      <Banknote size={24} /> 
                    </div>
                    Income Sources
                  </h2>
                </div>

                <div className="p-4 md:p-8">
                  <div className="hidden sm:grid grid-cols-5 text-[11px] tracking-widest text-slate-400 font-bold border-b border-slate-100 pb-4 uppercase px-4">
                    <p>Source</p>
                    <p>Frequency</p>
                    <p>Mode</p>
                    <p className="text-right">Amount</p>
                    <p className="text-right">Action</p>
                  </div>

                  {incomeList.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium italic bg-slate-50/50 rounded-2xl mt-4 border border-slate-100 border-dashed">
                      No income sources added yet.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {incomeList.map((item, index) => (
                        <IncomeRow
                          key={item.id}
                          id={item.id}
                          source={item.source}
                          frequency={item.frequency}
                          paymentMode={item.paymentMode}
                          amount={formatCurrency(item.amount)}
                          onDelete={handleDelete}
                          onEdit={() => handleEdit(item)}
                          theme="emerald"
                          type="income"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-6 pb-6 md:px-8 md:pb-8 flex justify-end">
                  <button
                    onClick={() => setShowIncomeModal(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                  >
                    <Plus size={18} />
                    Add Income
                  </button>
                </div>
              </div>

              {/* EXPENSE SECTION */}
              <div className="glass-card rounded-[32px] shadow-sm border border-white overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 md:p-8 border-b border-gray-100/50 flex justify-between items-center bg-orange-50/30">
                  <h2 className="text-[22px] md:text-[26px] font-black text-orange-800 flex items-center gap-3">
                    <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600 shadow-inner">
                      <ReceiptText size={24} /> 
                    </div>
                    Expenses
                  </h2>
                </div>

                <div className="p-4 md:p-8">
                  <div className="hidden sm:grid grid-cols-5 text-[11px] tracking-widest text-slate-400 font-bold border-b border-slate-100 pb-4 uppercase px-4">
                    <p>Source</p>
                    <p>Frequency</p>
                    <p>Mode</p>
                    <p className="text-right">Amount</p>
                    <p className="text-right">Action</p>
                  </div>

                  {expenseList.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium italic bg-slate-50/50 rounded-2xl mt-4 border border-slate-100 border-dashed">
                      No expenses added yet.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {expenseList.map((item, index) => (
                        <IncomeRow
                          key={item.id}
                          id={item.id}
                          source={item.source}
                          frequency={item.frequency}
                          paymentMode={item.paymentMode}
                          amount={formatCurrency(item.amount)}
                          onDelete={handleDelete}
                          onEdit={() => handleEdit(item)}
                          theme="orange"
                          type="expense"
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5"
                    >
                      <Plus size={18} />
                      Add Expense
                    </button>
                  </div>
                </div>
              </div>

              {/* LOAN SECTION */}
              <div className="glass-card rounded-[32px] shadow-sm border border-white overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 md:p-8 border-b border-gray-100/50 flex justify-between items-center bg-rose-50/30">
                  <h2 className="text-[22px] md:text-[26px] font-black text-rose-800 flex items-center gap-3">
                    <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shadow-inner">
                      <Landmark size={24} /> 
                    </div>
                    Loans
                  </h2>
                </div>

                <div className="p-4 md:p-8">
                  <div className="hidden sm:grid grid-cols-5 text-[11px] tracking-widest text-slate-400 font-bold border-b border-slate-100 pb-4 uppercase px-4">
                    <p>Source</p>
                    <p>Frequency</p>
                    <p>Mode</p>
                    <p className="text-right">Amount</p>
                    <p className="text-right">Action</p>
                  </div>

                  {loanList.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium italic bg-slate-50/50 rounded-2xl mt-4 border border-slate-100 border-dashed">
                      No loans added yet.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {loanList.map((item, index) => (
                        <IncomeRow
                          key={item.id}
                          id={item.id}
                          source={item.source}
                          frequency={item.frequency}
                          paymentMode={item.paymentMode}
                          amount={formatCurrency(item.amount)}
                          onDelete={handleDelete}
                          onEdit={() => handleEdit(item)}
                          theme="rose"
                          type="loan"
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setShowLoanModal(true)}
                      className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5"
                    >
                      <Plus size={18} />
                      Add Loan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="glass-card rounded-[32px] p-8 shadow-sm border border-white transition-all hover:shadow-lg">
                <p className="tracking-[2px] text-slate-400 text-[12px] font-bold uppercase">
                  SAVINGS GOAL: HOME RENOVATION
                </p>
                <div className="flex flex-col gap-2 mt-6">
                  <h3 className="text-[32px] font-black text-brand-600 tracking-tight">{formatCurrency(14200)}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-slate-500 font-medium text-sm">Target: {formatCurrency(20000)}</p>
                    <b className="text-brand-600 text-[16px]">71%</b>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded-full mt-4 p-1 overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full w-[71%] transition-all duration-1000 shadow-md"></div>
                </div>
                <div className="mt-6 p-4 bg-brand-50/50 rounded-2xl border border-brand-100">
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    You are <span className="text-brand-700 font-bold">{formatCurrency(5800)}</span> away from your milestone. Keep it up!
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-[32px] p-8 shadow-sm border border-white transition-all hover:shadow-lg">
                <p className="tracking-[2px] text-slate-400 text-[12px] font-bold uppercase mb-6">
                  EXPENSE BREAKDOWN
                </p>

                {/* SVG Donut Chart with dynamic segments */}
                <div className="relative w-[180px] h-[180px] mx-auto flex items-center justify-center">
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

              <div className="glass-card rounded-[32px] shadow-sm border border-white overflow-hidden transition-all hover:shadow-lg">
                <div className="p-8 border-b border-gray-100/50 bg-rose-50/30">
                  <h2 className="text-[20px] font-black text-rose-800 flex items-center gap-3">
                    <Landmark className="text-rose-600" size={20} /> Active Loans
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {loanList.length === 0 ? (
                    <p className="text-slate-400 text-center py-4 italic font-medium text-sm bg-slate-50 rounded-xl border border-slate-100 border-dashed">No active loans found</p>
                  ) : (
                    loanList.map((loan, idx) => (
                      <LoanCard 
                        key={idx}
                        title={loan.source} 
                        amount={formatCurrency(loan.amount)} 
                        tag="ACTIVE" 
                        green={idx % 2 === 1}
                      />
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {showIncomeModal && (
          <ModalShell title={editingEntry ? "Edit Income" : "Add Income"} onClose={() => { setShowIncomeModal(false); resetIncomeForm(); }}>
            <div className="space-y-6">
              <div className="grid gap-5">
                <label className="space-y-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Source</span>
                  <input
                    value={incomeSource}
                    onChange={(e) => setIncomeSource(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                    placeholder="E.g. Salary, Freelance"
                  />
                </label>

                <div className="grid grid-cols-2 gap-5">
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Frequency</span>
                    <select
                      value={incomeFrequency}
                      onChange={(e) => setIncomeFrequency(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none appearance-none"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Payment Mode</span>
                    <select
                      value={incomePaymentMode}
                      onChange={(e) => setIncomePaymentMode(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none appearance-none"
                    >
                      {paymentOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {incomeFrequency === "Others" && (
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Custom Frequency</span>
                    <input
                      value={incomeFrequencyOther}
                      onChange={(e) => setIncomeFrequencyOther(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 transition-all outline-none"
                      placeholder="E.g. Bi-weekly"
                    />
                  </label>
                )}

                <label className="space-y-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Amount (INR)</span>
                  <input
                    type="number"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                    placeholder="Enter amount"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowIncomeModal(false); resetIncomeForm(); }}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveIncome}
                  disabled={!incomeSource.trim() || !incomeAmount.toString().trim()}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all"
                >
                  {editingEntry ? "Save Changes" : "Add Income"}
                </button>
              </div>
            </div>
          </ModalShell>
        )}

        {showExpenseModal && (
          <ModalShell title={editingEntry ? "Edit Expense" : "Add Expense"} onClose={() => { setShowExpenseModal(false); resetExpenseForm(); }}>
            <div className="space-y-6">
              <div className="grid gap-5">
                <label className="space-y-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Category</span>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none appearance-none"
                  >
                    <option value="Essential">Essential</option>
                    <option value="Fixed (EMI)">Fixed (EMI)</option>
                    <option value="Discretionary">Discretionary</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Source / Item Name</span>
                  <input
                    value={expenseSource}
                    onChange={(e) => setExpenseSource(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                    placeholder="E.g. Groceries, Rent, Gym"
                  />
                </label>

                <div className="grid grid-cols-2 gap-5">
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Frequency</span>
                    <select
                      value={expenseFrequency}
                      onChange={(e) => setExpenseFrequency(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none appearance-none"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Payment Mode</span>
                    <select
                      value={expensePaymentMode}
                      onChange={(e) => setExpensePaymentMode(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none appearance-none"
                    >
                      {paymentOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {expenseFrequency === "Others" && (
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Custom Frequency</span>
                    <input
                      value={expenseFrequencyOther}
                      onChange={(e) => setExpenseFrequencyOther(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 transition-all outline-none"
                      placeholder="E.g. Bi-weekly"
                    />
                  </label>
                )}

                <label className="space-y-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Amount (INR)</span>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                    placeholder="Enter amount"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowExpenseModal(false); resetExpenseForm(); }}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExpense}
                  disabled={!expenseSource.trim() || !expenseAmount.toString().trim()}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 px-8 py-3 font-bold text-white shadow-lg shadow-orange-200 disabled:opacity-50 transition-all"
                >
                  {editingEntry ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </div>
          </ModalShell>
        )}

        {showLoanModal && (
          <ModalShell title={editingEntry ? "Edit Loan" : "Add Loan"} onClose={() => { setShowLoanModal(false); resetLoanForm(); }}>
            <div className="space-y-6">
              <div className="grid gap-5">
                
                {/* Loan Category Toggle */}
                <div className="space-y-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase block">Loan Type</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLoanCategory("bank")}
                      className={`h-11 rounded-xl font-bold text-sm transition-all border ${
                        loanCategory === "bank"
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                      }`}
                    >
                      Bank Loan
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoanCategory("individual")}
                      className={`h-11 rounded-xl font-bold text-sm transition-all border ${
                        loanCategory === "individual"
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                      }`}
                    >
                      Individual Borrower
                    </button>
                  </div>
                </div>

                {/* Conditional Fields: Bank Loan */}
                {loanCategory === "bank" && (
                  <>
                    <label className="space-y-2">
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Bank Name</span>
                      <input
                        value={loanBankName}
                        onChange={(e) => setLoanBankName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                        placeholder="E.g. State Bank of India, HDFC"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Loan Type</span>
                      <select
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none appearance-none"
                      >
                        <option value="Home Loan">Home Loan</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Car Loan">Car Loan</option>
                        <option value="Education Loan">Education Loan</option>
                        <option value="Business Loan">Business Loan</option>
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-5">
                      <label className="space-y-2">
                        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">EMI Amount (INR)</span>
                        <input
                          type="number"
                          value={loanEmiAmount}
                          onChange={(e) => setLoanEmiAmount(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                          placeholder="Monthly EMI"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">EMI Duration</span>
                        <input
                          value={loanEmiDuration}
                          onChange={(e) => setLoanEmiDuration(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                          placeholder="E.g. 36 Months, 5 Years"
                        />
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">EMI Start Date</span>
                      <input
                        type="date"
                        value={loanEmiStartDate}
                        onChange={(e) => setLoanEmiStartDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                      />
                    </label>
                  </>
                )}

                {/* Conditional Fields: Individual Borrower */}
                {loanCategory === "individual" && (
                  <>
                    <label className="space-y-2">
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Lender / Individual Name</span>
                      <input
                        value={loanLenderName}
                        onChange={(e) => setLoanLenderName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                        placeholder="E.g. Ramesh Kumar"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-5">
                      <label className="space-y-2">
                        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Interest Rate (% p.a.)</span>
                        <input
                          type="number"
                          step="0.1"
                          value={loanInterestRate}
                          onChange={(e) => setLoanInterestRate(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                          placeholder="E.g. 12"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Repayment Duration</span>
                        <input
                          value={loanEmiDuration}
                          onChange={(e) => setLoanEmiDuration(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                          placeholder="E.g. 6 Months, 1 Year"
                        />
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Start Date</span>
                      <input
                        type="date"
                        value={loanEmiStartDate}
                        onChange={(e) => setLoanEmiStartDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                      />
                    </label>
                  </>
                )}

                {/* Principal Amount (Needed for both types) */}
                <label className="space-y-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Principal Amount (INR)</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all outline-none"
                    placeholder="Enter total borrowed amount"
                  />
                </label>

                {/* Frequency & Payment Mode (Hidden defaults for loans to satisfy db) */}
                <div className="grid grid-cols-2 gap-5 opacity-0 h-0 overflow-hidden pointer-events-none">
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Frequency</span>
                    <select
                      value={loanFrequency}
                      onChange={(e) => setLoanFrequency(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white"
                    >
                      <option value="Monthly">Monthly</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Payment Mode</span>
                    <select
                      value={loanPaymentMode}
                      onChange={(e) => setLoanPaymentMode(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-4 text-[15px] font-medium text-slate-900 bg-slate-50 focus:bg-white"
                    >
                      <option value="Bank">Bank</option>
                    </select>
                  </label>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowLoanModal(false); resetLoanForm(); }}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLoan}
                  disabled={
                    loanCategory === "bank"
                      ? (!loanBankName.trim() || !loanType.trim() || !loanEmiAmount.toString().trim() || !loanEmiDuration.trim() || !loanEmiStartDate || !loanAmount.toString().trim())
                      : (!loanLenderName.trim() || !loanInterestRate.toString().trim() || !loanEmiDuration.trim() || !loanEmiStartDate || !loanAmount.toString().trim())
                  }
                  className="rounded-xl bg-rose-500 hover:bg-rose-600 px-8 py-3 font-bold text-white shadow-lg shadow-rose-200 disabled:opacity-50 transition-all"
                >
                  {editingEntry ? "Save Changes" : "Add Loan"}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[540px] rounded-[32px] bg-white p-6 md:p-8 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[24px] font-black text-slate-900 tracking-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
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
      className={`glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-white transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden`}
    >
      <div className="flex justify-between items-start relative z-10">
        <p className="tracking-[2px] font-bold text-[12px] md:text-[14px] text-slate-400">{title}</p>
        <span
          className={`p-2.5 rounded-xl shadow-inner ${
            green ? "text-emerald-600 bg-emerald-50" : "text-orange-600 bg-orange-50"
          }`}
        >
          {icon}
        </span>
      </div>
      <h2
        className={`text-[32px] md:text-[42px] font-black tracking-tight mt-6 md:mt-8 relative z-10 ${
          green ? "text-emerald-600" : "text-orange-600"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

function IncomeRow({ id, source, frequency, paymentMode, amount, onDelete, onEdit, theme = "emerald", type = "income" }) {
  const themeColors = {
    emerald: "hover:bg-emerald-50/50 hover:border-emerald-100 group-hover:text-emerald-600",
    orange: "hover:bg-orange-50/50 hover:border-orange-100 group-hover:text-orange-600",
    rose: "hover:bg-rose-50/50 hover:border-rose-100 group-hover:text-rose-600",
  };

  const textColors = {
    emerald: "text-emerald-600",
    orange: "text-orange-600",
    rose: "text-rose-600",
  };

  let displayName = source;
  let subText = "";

  if (source && source.startsWith("{")) {
    try {
      const parsed = JSON.parse(source);
      if (type === "loan") {
        if (parsed.category === "bank") {
          displayName = parsed.bankName || "Bank Loan";
          subText = `${parsed.loanType} (EMI: ${formatCurrency(parsed.emiAmount || 0)}/mo)`;
        } else {
          displayName = parsed.borrowerName || "Individual Loan";
          subText = `Indiv. (${parsed.interestRate || 0}% Int)`;
        }
      } else if (type === "expense") {
        displayName = parsed.name || "Expense";
        subText = parsed.category || "Essential";
      }
    } catch (e) {}
  }

  return (
    <div className={`flex flex-col sm:grid sm:grid-cols-5 p-4 rounded-2xl border border-transparent text-[15px] items-start sm:items-center gap-3 sm:gap-0 transition-all group ${themeColors[theme]}`}>
      <div className="font-bold text-slate-800 flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${textColors[theme].replace('text-', 'bg-')}`}></div>
        <div>
          <p className="font-bold text-slate-800 leading-tight">{displayName}</p>
          {subText && <p className="text-[11px] text-slate-400 font-semibold mt-1">{subText}</p>}
        </div>
      </div>
      <div className="flex sm:block gap-2 text-slate-500 font-medium px-4">
        <span className="sm:hidden text-xs text-slate-400 uppercase tracking-widest font-bold">Freq:</span>
        <p>{frequency}</p>
      </div>
      <div className="flex sm:block gap-2 text-slate-500 font-medium px-4">
        <span className="sm:hidden text-xs text-slate-400 uppercase tracking-widest font-bold">Mode:</span>
        <p>{paymentMode}</p>
      </div>
      <div className="w-full sm:w-auto flex sm:block justify-between sm:text-right px-4">
        <span className="sm:hidden text-xs text-slate-400 uppercase tracking-widest font-bold">Amount:</span>
        <p className={`font-black tracking-tight ${textColors[theme]}`}>{amount}</p>
      </div>
      <div className="w-full sm:w-auto flex justify-end gap-1 px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => onDelete(id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

function BreakDot({ color, text, percent }) {
  return (
    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${color} shadow-sm`}></span>
        <p className="text-slate-700 font-bold text-[14px]">{text}</p>
      </div>
      <b className="text-slate-900">{percent}</b>
    </div>
  );
}

function LoanCard({ title, amount, tag, green }) {
  let displayTitle = title;
  let subInfo = "";
  if (title && title.startsWith("{")) {
    try {
      const parsed = JSON.parse(title);
      if (parsed.category === "bank") {
        displayTitle = parsed.bankName || "Bank Loan";
        subInfo = `${parsed.loanType} · EMI: ${formatCurrency(parsed.emiAmount || 0)}`;
      } else {
        displayTitle = parsed.borrowerName || "Individual Loan";
        subInfo = `Indiv. · Interest: ${parsed.interestRate || 0}%`;
      }
    } catch (e) {}
  }

  return (
    <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 transition-all hover:border-rose-100 hover:bg-rose-50/30">
      <div className="flex justify-between items-start">
        <div>
          <b className="text-[15px] font-bold text-slate-800 leading-tight block">{displayTitle}</b>
          {subInfo && <p className="text-[11px] text-slate-400 font-semibold mt-1">{subInfo}</p>}
        </div>
        <span
          className={`text-[9px] px-2.5 py-0.5 rounded-full font-black tracking-wider ${
            green ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {tag}
        </span>
      </div>
      <h3 className="text-rose-600 font-black text-[20px] tracking-tight mt-2">{amount}</h3>
    </div>
  );
}

function mapFinanceEntry(entry) {
  return {
    id: entry.id,
    type: entry.entry_type,
    source: entry.source,
    frequency: entry.frequency,
    paymentMode: entry.payment_mode,
    amount: entry.amount?.toString() || "0",
  };
}

function sumAmounts(items) {
  return items.reduce((total, item) => total + Number(item.amount || 0), 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default Finance;
