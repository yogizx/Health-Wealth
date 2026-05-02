import { useState } from "react";
import SignIn from "./assets/pages/Signin";
import Dashboard from "./assets/pages/Dashboard";
import Finance from "./assets/pages/Finance";
import Mindset from "./assets/pages/Mindset";
import Health from "./assets/pages/Health";
import Profile from "./assets/pages/Profile";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sleepingQuality, setSleepingQuality] = useState({ hours: "7", minutes: "45" });

  if (!isLogin) {
    return <SignIn onLogin={() => setIsLogin(true)} />;
  }

  if (activePage === "finance") {
    return (
      <Finance
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={() => setIsLogin(false)}
      />
    );
  }

  if (activePage === "mindset") {
  return (
    <Mindset
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={() => setIsLogin(false)}
    />
  );
}

if (activePage === "health") {
  return (
    <Health
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={() => setIsLogin(false)}
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
      onLogout={() => setIsLogin(false)}
    />
  );
}

  return (
    <Dashboard
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={() => setIsLogin(false)}
      sleepingQuality={sleepingQuality}
    />
  );
}

export default App;