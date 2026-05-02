import { Mail, Lock, Eye, ShieldCheck, RotateCcw, Shield } from "lucide-react";
import { useState } from "react";
function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#111827]">
      <header className="h-[68px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
        <h1 className="text-[22px] font-bold text-[#0b57d0]">MinimalAuth</h1>

        <nav className="flex items-center gap-9 text-[16px] text-gray-600">
          <a href="#">Features</a>
          <a href="#">Support</a>
          <button className="bg-[#0757e6] text-white px-7 py-3 rounded-lg font-semibold">
            Sign Up
          </button>
        </nav>
      </header>

      <main className="flex flex-col items-center">
        <section className="w-[460px] bg-white mt-0 rounded-xl border border-gray-200 shadow-2xl shadow-blue-100 px-12 py-12">
          <div className="flex justify-center">
            <div className="w-[52px] h-[52px] rounded-xl bg-[#0757e6] flex items-center justify-center shadow-lg shadow-blue-300">
              <ShieldCheck className="text-white" size={30} />
            </div>
          </div>

          <h2 className="text-center text-[34px] font-bold mt-6">
            Welcome Back
          </h2>

          <p className="text-[17px] text-gray-600 mt-2 leading-7">
            Enter your credentials to access your <br /> account
          </p>

          <form className="mt-14">
            <label className="text-[13px] font-bold tracking-[2px] text-gray-500">
              EMAIL ADDRESS
            </label>

            <div className="mt-3 h-[56px] bg-gray-100 rounded-lg flex items-center px-4 gap-4">
              <Mail size={21} className="text-gray-500" />
            <input
  type="email"
  placeholder="name@company.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="bg-transparent outline-none w-full text-[17px]"
/>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <label className="text-[13px] font-bold tracking-[2px] text-gray-500">
                PASSWORD
              </label>
              <a href="#" className="text-[15px] text-[#073ea8] font-medium">
                Forgot Password?
              </a>
            </div>

            <div className="mt-3 h-[56px] bg-gray-100 rounded-lg flex items-center px-4 gap-4">
              <Lock size={21} className="text-gray-500" />
            <input
  type="password"
  placeholder="••••••••"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="bg-transparent outline-none w-full"
/>
              <Eye size={21} className="text-gray-500" />
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="w-[22px] h-[22px] border border-gray-300 rounded-md bg-white"></div>
              <p className="text-[15px] text-gray-600">
                Remember me for 30 days
              </p>
            </div>

           <button
  type="button"
  onClick={() => {
    if (email === "admin@gmail.com" && password === "1234") {
      onLogin();
    } else {
      alert("Invalid credentials");
    }
  }}
  className="w-full h-[60px] bg-[#0648d6] text-white rounded-lg mt-7 text-[17px] font-bold shadow-md shadow-blue-300"
>
  Sign In
</button>

            <div className="flex items-center gap-4 mt-8">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-500 text-[13px] font-semibold">OR</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

           <button
  type="button"
  onClick={onLogin}
  className="w-full h-[57px] border border-gray-200 rounded-lg mt-7 flex items-center justify-center gap-4 text-[18px] font-medium bg-white"
>
  <span className="text-[22px] font-bold text-[#4285F4]">G</span>
  Continue with Google
</button>
          </form>

          <p className="text-center mt-14 text-[15px] text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-[#073ea8] font-bold">
              Sign Up
            </a>
          </p>
        </section>

        <section className="mt-12 text-center">
          <p className="text-[13px] font-bold tracking-[3px] text-gray-400">
            TRUSTED BY SECURE TEAMS
          </p>

          <div className="flex justify-center gap-8 mt-7 text-gray-500">
            <ShieldCheck size={18} />
            <RotateCcw size={18} />
            <Shield size={18} />
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 h-[70px] border-t border-gray-100 flex items-center justify-between px-8 text-[14px] text-gray-400">
        <p>© 2024 MinimalAuth Inc. All rights reserved.</p>

        <div className="flex gap-8">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </footer>
    </div>
  );
}

export default SignIn;