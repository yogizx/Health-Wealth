import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  deleteCurrentAccount,
  fetchProfile,
  saveProfile,
  updatePassword,
  updateUserAvatar,
} from "../../lib/api";
import {
  Shield,
  Camera,
  Check,
  Lock,
  Moon,
  Save,
  Settings,
  User,
  X,
  Smartphone,
  Sparkles,
  CheckCircle,
  Bell,
  Laptop,
  AlertTriangle,
} from "lucide-react";

const emptyPasswordForm = { currentPassword: "", newPassword: "" };

function Profile({ activePage, setActivePage, onLogout, user }) {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    phoneNumber: "",
    age: "",
    gender: "",
    occupation: "",
    email: user?.email || "",
    darkMode: false,
    pushNotifications: true,
    twoFactorAuth: false,
  });

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef(null);

  const isDark = personalInfo.darkMode;

  useEffect(() => {
    if (!user?.id) return;
    // Pull avatar from auth metadata immediately
    const metaAvatar = user?.user_metadata?.avatar_url;
    if (metaAvatar) setAvatarUrl(metaAvatar);

    fetchProfile(user.id, user.email, user.user_metadata)
      .then((profile) => {
        setPersonalInfo({
          fullName: profile.full_name || "",
          phoneNumber: profile.phone_number || "",
          age: profile.age?.toString() || "",
          gender: profile.gender || "",
          occupation: profile.occupation || "Financial Strategist",
          email: profile.email || user.email,
          darkMode: profile.dark_mode ?? false,
          pushNotifications: profile.push_notifications ?? true,
          twoFactorAuth: profile.two_factor_enabled ?? false,
        });
      })
      .catch((err) => showMsg(err.message, "error"));
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("healthwealth-dark", isDark);
  }, [isDark]);

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleInputChange = (key, value) =>
    setPersonalInfo((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (nextInfo = personalInfo) => {
    if (!nextInfo.fullName.trim()) {
      showMsg("Full name is required.", "error");
      return false;
    }
    setIsSaving(true);
    try {
      await saveProfile(user.id, {
        fullName: nextInfo.fullName.trim(),
        email: nextInfo.email,
        phoneNumber: nextInfo.phoneNumber.trim(),
        age: nextInfo.age ? Number(nextInfo.age) : null,
        gender: nextInfo.gender,
        occupation: nextInfo.occupation,
        pushNotifications: nextInfo.pushNotifications,
        darkMode: nextInfo.darkMode,
        emailUpdates: true,
      });
      setPersonalInfo(nextInfo);
      showMsg("Profile changes saved successfully.");
      return true;
    } catch (e) {
      showMsg(e.message, "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePref = async (key) => {
    const next = { ...personalInfo, [key]: !personalInfo[key] };
    setPersonalInfo(next);
    await handleSave(next);
  };

  const handlePasswordUpdate = async () => {
    if (!passwordForm.newPassword) {
      showMsg("New password is required.", "error");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showMsg("Password must be at least 8 characters.", "error");
      return;
    }
    setIsSaving(true);
    try {
      await updatePassword(passwordForm.newPassword);
      setPasswordForm(emptyPasswordForm);
      showMsg("Password changed successfully.");
    } catch (e) {
      showMsg(e.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      showMsg("Type DELETE to confirm.", "error");
      return;
    }
    setIsSaving(true);
    try {
      await deleteCurrentAccount();
      await onLogout();
    } catch (e) {
      showMsg(e.message, "error");
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showMsg("Image must be under 2MB.", "error");
      return;
    }

    setAvatarUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target.result;
        await updateUserAvatar(dataUrl);
        setAvatarUrl(dataUrl);
        setAvatarUploading(false);
        showMsg("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    } catch (e) {
      showMsg(e.message, "error");
      setAvatarUploading(false);
    }
  };

  const userInitial = personalInfo.fullName[0]?.toUpperCase() || "U";
  const userPlan = "Pro Member";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 relative overflow-hidden">
      
      {/* Sidebar navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} user={user} />

      <main className="flex-1 md:h-screen md:overflow-y-auto pb-24 md:pb-0 relative z-10">
        
        {/* Top Navbar */}
        <Navbar activePage={activePage} setActivePage={setActivePage} user={user} />

        <section className="px-4 py-6 space-y-6 sm:px-6 md:px-10 md:py-8 max-w-[1200px] mx-auto">
          
          {/* Status/Toast Messages */}
          {message.text && (
            <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold border ${
              message.type === "error"
                ? "bg-red-50 text-red-700 border-red-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            } animate-in fade-in slide-in-from-top-4`}>
              {message.type === "error" ? <X size={18} /> : <Check size={18} />}
              {message.text}
            </div>
          )}

          {/* ─── HERO PROFILE HEADER (as in the mockup image) ────────────────── */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Sparkles size={160} />
            </div>
            
            {/* Square Rounded Avatar Container */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-[28px] overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              
              {/* Camera Upload Button Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition-all border border-white"
                title="Change profile picture"
              >
                {avatarUploading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              {/* Blue verified badge at bottom-right corner of photo */}
              <div className="absolute bottom-2 left-[78px] md:left-[92px] translate-x-1.5 translate-y-1.5 w-6 h-6 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <CheckCircle size={12} className="fill-white text-indigo-600" />
              </div>
            </div>

            {/* Header Description details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                <h1 className="text-2xl md:text-[28px] font-black text-slate-800 tracking-tight">
                  {personalInfo.fullName || "User Account"}
                </h1>
                <span className="inline-flex self-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/50 tracking-wider uppercase">
                  Authenticated Profile
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[650px] font-medium">
                Professional {personalInfo.occupation || "Analyst"} &amp; {userPlan} since January 2025. Managing core wellness, health scores and financial wealth.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 justify-center sm:justify-start text-xs text-slate-400 font-bold uppercase tracking-wider">
                <p>Account Type: <span className="text-slate-700">{userPlan}</span></p>
                <p>Last Login: <span className="text-slate-700">Just Now</span></p>
              </div>
            </div>
          </div>

          {/* ─── MAIN TWO COLUMN GRID ────────────────────────────────────────── */}
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            
            {/* LEFT COLUMN: Forms */}
            <div className="space-y-6">
              
              {/* PERSONAL INFORMATION CARD */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                  <h2 className="text-[19px] font-black text-slate-800 flex items-center gap-3">
                    <User size={20} className="text-indigo-600" />
                    Personal Information
                  </h2>
                  <button
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-100 transition-all flex items-center gap-2"
                  >
                    <Save size={14} />
                    Save Changes
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Full Name</span>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                      placeholder="Your Full Name"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </label>

                  <label className="block w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</span>
                    <input
                      type="email"
                      value={personalInfo.email}
                      disabled
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-400 bg-slate-100 outline-none cursor-not-allowed"
                    />
                  </label>

                  <label className="block w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Phone Number</span>
                    <input
                      type="text"
                      value={personalInfo.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/[^+0-9 ]/g, ""))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </label>

                  <label className="block w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Occupation</span>
                    <input
                      type="text"
                      value={personalInfo.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                      placeholder="E.g. Analyst, Engineer"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    />
                  </label>
                </div>
              </div>

              {/* SECURITY CARD */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                <h2 className="text-[19px] font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                  <Shield size={20} className="text-indigo-600" />
                  Security
                </h2>

                <div className="grid gap-5 sm:grid-cols-2 items-end mb-6">
                  <label className="block w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Current Password</span>
                    <input
                      type="password"
                      value="••••••••••••"
                      disabled
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-400 bg-slate-100 outline-none cursor-not-allowed"
                    />
                  </label>

                  <label className="block w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">New Password</span>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                        className="w-full h-12 pl-4 pr-32 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                      />
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={isSaving}
                        className="absolute right-1.5 top-1.5 h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  </label>
                </div>

                {/* Two-Factor Authentication Row */}
                <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/20">
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Two-Factor Authentication</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Secure your account with an extra layer of protection.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePref("twoFactorAuth")}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                      personalInfo.twoFactorAuth ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                      personalInfo.twoFactorAuth ? "left-6" : "left-0.5"
                    }`} />
                  </button>
                </div>
              </div>

              {/* PREFERENCES CARD */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                <h2 className="text-[19px] font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                  <Settings size={20} className="text-indigo-600" />
                  Preferences
                </h2>

                <div className="space-y-4">
                  {/* Dark Mode */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Moon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">Dark Mode</p>
                        <p className="text-xs text-slate-400 mt-0.5">Switch to a darker interface.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTogglePref("darkMode")}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                        personalInfo.darkMode ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                        personalInfo.darkMode ? "left-6" : "left-0.5"
                      }`} />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">Push Notifications</p>
                        <p className="text-xs text-slate-400 mt-0.5">Enable real-time updates and push alerts.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTogglePref("pushNotifications")}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                        personalInfo.pushNotifications ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                        personalInfo.pushNotifications ? "left-6" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* DANGER ZONE */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                <h2 className="text-[19px] font-black text-rose-600 flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                  <AlertTriangle size={20} className="text-rose-500" />
                  Danger Zone
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Permanently delete your account and all associated data. This action is final and cannot be undone.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder='Type "DELETE" to confirm'
                    className="h-11 px-4 rounded-xl border border-rose-200 text-sm font-medium text-slate-800 bg-rose-50/20 focus:bg-white focus:border-rose-400 transition-all outline-none"
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isSaving}
                    className="h-11 px-6 bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold rounded-xl text-sm transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Subscription & Logs */}
            <div className="space-y-6">
              
              {/* SUBSCRIPTION CARD */}
              <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-[32px] p-6 text-white shadow-lg shadow-indigo-100/50">
                <span className="text-[10px] font-bold tracking-widest text-indigo-200 bg-white/10 px-3 py-1 rounded-full uppercase">
                  Subscription
                </span>
                
                <h3 className="text-[22px] font-black tracking-tight mt-4 leading-tight">
                  Pro Member
                </h3>
                <p className="text-xs text-indigo-100 font-bold mt-1">
                  Yearly Billing
                </p>

                {/* Progress bar */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs text-indigo-200 font-bold mb-2">
                    <span>Renewal Date</span>
                    <span>Jan 12, 2027</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-[78%]" />
                  </div>
                </div>

                <button
                  onClick={() => showMsg("Billing dashboard is available for premium card holders.", "success")}
                  className="w-full h-11 bg-white hover:bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm transition-all mt-6 shadow-md shadow-indigo-950/10"
                >
                  Manage Billing
                </button>
              </div>

              {/* RECENT ACTIVITY CARD */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                <h3 className="text-md font-black text-slate-800 uppercase tracking-widest mb-6">
                  Recent Activity
                </h3>

                <div className="relative border-l border-slate-100 pl-5 ml-2.5 space-y-6">
                  
                  {/* Item 1 */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">Security Settings Changed</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Password updated successfully.</p>
                      <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-1.5 block">Just Now</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">Logged in from Safari</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">New login detected in Mumbai, IN</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 block">2 hours ago</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">Plan Renewed</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Annual Pro subscription confirmed.</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 block">Jan 12, 2025</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* CONNECTED DEVICES CARD */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                <h3 className="text-md font-black text-slate-800 uppercase tracking-widest mb-6">
                  Connected Devices
                </h3>

                <div className="space-y-4">
                  {/* Laptop */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Laptop size={18} className="text-slate-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">MacBook Pro 14"</p>
                        <p className="text-[10px] text-emerald-500 font-bold">Active now</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                  </div>

                  {/* Mobile phone */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-slate-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">iPhone 15 Pro</p>
                        <p className="text-[10px] text-slate-400 font-medium">Last active: 1 hour ago</p>
                      </div>
                    </div>
                    <button
                      onClick={() => showMsg("Device access revoked.", "success")}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default Profile;
