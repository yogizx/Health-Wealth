import { useEffect, useState } from "react";
import SignIn from "./assets/pages/SignIn";
import Dashboard from "./assets/pages/Dashboard";
import Finance from "./assets/pages/Finance";
import Mindset from "./assets/pages/Mindset";
import Health from "./assets/pages/Health";
import Profile from "./assets/pages/Profile";
import AdminLogin from "./assets/pages/AdminLogin";
import AdminDashboard from "./assets/pages/AdminDashboard";
import { getCurrentSession, signOut, getAdminSession } from "./lib/api";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

function App() {
  const [session, setSession] = useState(null);
  const [adminSession, setAdminSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [activePage, setActivePage] = useState("dashboard");
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [sleepingQuality, setSleepingQuality] = useState({ hours: "7", minutes: "45" });
  const user = session?.user || null;

  useEffect(() => {
    // Sync state with URL
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);

    // Validate Admin Session
    const admin = getAdminSession();
    if (admin) {
      setAdminSession(admin);
    }

    if (!isSupabaseConfigured) {
      setIsCheckingSession(false);
      return;
    }

    getCurrentSession()
      .then((currentSession) => {
        setSession(currentSession);
      })
      .catch((error) => console.error("Session Error:", error.message))
      .finally(() => setIsCheckingSession(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (currentPath.startsWith("/admin")) {
        setAdminSession(null);
        localStorage.removeItem("admin_session");
        window.history.pushState({}, "", "/");
        setCurrentPath("/");
        return; // Stop here for admin logout
      }
      
      if (isSupabaseConfigured) {
        await signOut();
      }
      setSession(null);
      setActivePage("dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, "", "/admin/");
    setCurrentPath("/admin/");
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#f8fbff] text-[#111827] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">HealthWealth</p>
            <p className="text-sm font-bold text-slate-400">Verifying security protocols...</p>
          </div>
        </div>
      </div>
    );
  }

  // Strict Admin Routing for /admin or /admin/
  const isAdminPath = currentPath === "/admin" || currentPath === "/admin/";
  
  if (isAdminPath) {
    if (!adminSession) {
      return <AdminLogin onLoginSuccess={(s) => setAdminSession(s)} />;
    }
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (!session) {
    return (
      <div className="relative min-h-screen">
        <SignIn onLogin={setSession} />
        {/* Portal Entry */}
        <button 
          onClick={navigateToAdmin}
          className="fixed bottom-6 right-6 bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl px-5 py-3 rounded-2xl text-[11px] text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all uppercase font-black tracking-widest flex items-center gap-2 group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></div>
          Admin Portal
        </button>
      </div>
    );
  }

  if (activePage === "finance") {
    return (
      <Finance
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  if (activePage === "mindset") {
    return (
      <Mindset
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  if (activePage === "health") {
    return (
      <Health
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        user={user}
        sleepingQuality={sleepingQuality}
        onSaveSleepingQuality={setSleepingQuality}
      />
    );
  }

  if (activePage === "profile") {
    return (
      <Profile
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  return (
    <Dashboard
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
      sleepingQuality={sleepingQuality}
      user={user}
    />
  );
}

export default App;
