import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  ArrowRight,
  Activity
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "../../lib/api";

function SignIn({ onLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isSignup = authMode === "signup";
  const isForgotPassword = authMode === "forgot";
  const passwordRules = useMemo(() => getPasswordRules(password), [password]);
  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordRules),
    [passwordRules]
  );

  const switchMode = (mode) => {
    setAuthMode(mode);
    setNotice("");
    setHasSubmitted(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUserName("");
    setPhoneNumber("");
  };

  const handleSignIn = async () => {
    setHasSubmitted(true);
    const validationError = validateLogin({ email, password });
    if (validationError) {
      setNotice("");
      return;
    }

    setIsLoading(true);
    setNotice("");
    try {
      const { session } = await signInWithEmail(email.trim(), password);
      if (session) {
        onLogin(session);
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setHasSubmitted(true);
    const trimmedUserName = userName.trim();
    const trimmedEmail = email.trim();
    const validationError = validateSignup({
      userName: trimmedUserName,
      email: trimmedEmail,
      phoneNumber,
      password,
      confirmPassword,
    });

    if (validationError) {
      setNotice("");
      return;
    }

    setIsLoading(true);
    setNotice("");
    try {
      const { session } = await signUpWithEmail(trimmedEmail, password, {
        userName: trimmedUserName,
        phoneNumber: `+91${phoneNumber}`,
      });

      if (session) {
        onLogin(session);
      } else {
        setNotice("Account created. Check your email to confirm your login.");
        switchMode("login");
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = resetEmail.trim();

    if (!trimmedEmail) {
      setNotice("Email address is required.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setNotice("Enter a valid email address with @.");
      return;
    }

    setIsLoading(true);
    setNotice("");
    try {
      await sendPasswordResetEmail(trimmedEmail);
      setNotice("Password reset link sent. Please check your email.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setNotice("");
    try {
      await signInWithGoogle();
    } catch (error) {
      setNotice(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isForgotPassword) {
      handleForgotPassword();
    } else if (isSignup) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] text-[#111827] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="h-[70px] flex items-center justify-between px-6 md:px-12 relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Activity size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">HealthWealth</h1>
        </div>

        <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors hidden md:block">Features</a>
          <a href="#" className="hover:text-blue-600 transition-colors hidden md:block">Support</a>
          <button
            type="button"
            onClick={() => switchMode(isSignup ? "login" : "signup")}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-10 py-10">
        <div className="w-full max-w-[480px]">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isForgotPassword
                ? "Reset Password"
                : isSignup
                ? "Create an Account"
                : "Welcome Back"}
            </h2>
            <p className="text-slate-500 mt-2 text-[15px] font-medium">
              {isForgotPassword ? (
                "Enter your email to receive a password reset link."
              ) : isSignup ? (
                "Join us to track your health and wealth effortlessly."
              ) : (
                "Enter your credentials to access your dashboard."
              )}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-2xl shadow-blue-900/5 p-6 sm:p-10">
            <form onSubmit={handleSubmit} noValidate>
              
              {/* Google Sign In - Prominent for Login */}
              {!isForgotPassword && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-[54px] rounded-xl border-2 border-slate-100 flex items-center justify-center gap-3 text-[15px] font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 my-7">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      Or continue with email
                    </span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>
                </>
              )}

              <div className="space-y-5">
                {isSignup && (
                  <>
                    <AuthInput
                      icon={<User size={18} className="text-slate-400" />}
                      label="Full Name"
                      placeholder="Alex Rivera"
                      value={userName}
                      onChange={(value) =>
                        setUserName(value.replace(/[^a-zA-Z ]/g, ""))
                      }
                    />
                    <PhoneInput
                      value={phoneNumber}
                      onChange={(value) =>
                        setPhoneNumber(value.replace(/\D/g, "").slice(0, 10))
                      }
                      error={
                        hasSubmitted && (!phoneNumber || phoneNumber.length !== 10)
                          ? "Phone number must be exactly 10 digits."
                          : ""
                      }
                    />
                  </>
                )}

                {!isForgotPassword && (
                  <AuthInput
                    icon={<Mail size={18} className="text-slate-400" />}
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={setEmail}
                    error={
                      hasSubmitted && (!email || !email.includes("@"))
                        ? "Email address must include @."
                        : hasSubmitted && !isValidEmail(email)
                        ? "Enter a valid email address."
                        : ""
                    }
                  />
                )}

                {isForgotPassword ? (
                  <AuthInput
                    icon={<Mail size={18} className="text-slate-400" />}
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    value={resetEmail}
                    onChange={setResetEmail}
                    error={
                      hasSubmitted && (!resetEmail || !resetEmail.includes("@"))
                        ? "Email address must include @."
                        : hasSubmitted && !isValidEmail(resetEmail)
                        ? "Enter a valid email address."
                        : ""
                    }
                  />
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                        Password
                      </label>
                      {!isSignup && (
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <PasswordInput
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••"
                    />

                    {isSignup && (
                      <div className="mt-4">
                        <PasswordChecklist
                          rules={passwordRules}
                          strength={passwordStrength}
                        />
                      </div>
                    )}

                    {isSignup && (
                      <div className="mt-5">
                        <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">
                          Confirm Password
                        </label>
                        <PasswordInput
                          value={confirmPassword}
                          onChange={setConfirmPassword}
                          placeholder="••••••••"
                        />
                        <InlineMessage
                          text={
                            hasSubmitted && confirmPassword && password !== confirmPassword
                              ? "Passwords do not match."
                              : confirmPassword && password === confirmPassword
                              ? "Passwords match."
                              : ""
                          }
                          tone={password === confirmPassword ? "success" : "error"}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isSignup && !isForgotPassword && (
                <div className="mt-5 flex items-center gap-3">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">
                    Remember me for 30 days
                  </label>
                </div>
              )}

              <InlineMessage text={notice} tone="error" />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[54px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl mt-6 text-[15px] font-bold shadow-lg shadow-blue-600/30 disabled:opacity-70 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    {getSubmitText({ isLoading, isSignup, isForgotPassword })}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-8 text-[14px] font-medium text-slate-500">
              {isForgotPassword
                ? "Remembered your password? "
                : isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                type="button"
                onClick={() => switchMode(isSignup || isForgotPassword ? "login" : "signup")}
                className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
              >
                {isSignup || isForgotPassword ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function getSubmitText({ isLoading, isSignup, isForgotPassword }) {
  if (isForgotPassword) return "Send Reset Link";
  if (isSignup) return "Create Account";
  return "Sign In";
}

function validateLogin({ email, password }) {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) return "Email address is required.";
  if (!trimmedEmail.includes("@")) return "Email address must include @.";
  if (!isValidEmail(trimmedEmail)) return "Enter a valid email address.";
  if (!password) return "Password is required.";
  return "";
}

function validateSignup({ userName, email, phoneNumber, password, confirmPassword }) {
  const rules = getPasswordRules(password);
  if (!userName) return "User name is required.";
  if (userName.length < 2) return "User name must be at least 2 letters.";
  if (!/^[a-zA-Z ]+$/.test(userName)) return "User name can only contain letters and spaces.";
  if (!email) return "Email address is required.";
  if (!email.includes("@")) return "Email address must include @.";
  if (!isValidEmail(email)) return "Enter a valid email address.";
  if (!phoneNumber) return "Phone number is required.";
  if (!/^[0-9]{10}$/.test(phoneNumber)) return "Phone number must be exactly 10 digits.";
  if (!password) return "Password is required.";
  if (!rules.minLength) return "Password must be at least 8 characters.";
  if (!rules.uppercase) return "Password must include one uppercase letter.";
  if (!rules.special) return "Password must include one special character.";
  if (!confirmPassword) return "Confirm password is required.";
  if (password !== confirmPassword) return "Password and confirm password do not match.";
  return "";
}

function getPasswordRules(value) {
  return {
    minLength: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };
}

function getPasswordStrength(rules) {
  const score = Object.values(rules).filter(Boolean).length;
  if (score >= 5) return { label: "Strong", color: "text-emerald-600" };
  if (score >= 3) return { label: "Medium", color: "text-amber-500" };
  return { label: "Weak", color: "text-rose-500" };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function AuthInput({ icon, label, value, onChange, type = "text", placeholder, error }) {
  return (
    <div>
      {label && <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">{label}</label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          className={`w-full h-[52px] bg-slate-50 border ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl pl-12 pr-4 text-[15px] font-medium text-slate-900 outline-none transition-all focus:ring-4 focus:bg-white`}
        />
      </div>
      <InlineMessage text={error} tone="error" />
    </div>
  );
}

function PhoneInput({ value, onChange, error }) {
  return (
    <div>
      <label className="text-xs font-bold tracking-wider text-slate-500 uppercase block mb-2">Phone Number</label>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Phone size={18} className="text-slate-400" />
        </div>
        <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none">
          <span className="text-[15px] font-semibold text-slate-700 border-r border-slate-200 pr-3">+91</span>
        </div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="9876543210"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={10}
          required
          className={`w-full h-[52px] bg-slate-50 border ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'} rounded-xl pl-[100px] pr-4 text-[15px] font-medium text-slate-900 outline-none transition-all focus:ring-4 focus:bg-white`}
        />
      </div>
      <InlineMessage text={error} tone="error" />
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Lock size={18} className="text-slate-400" />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full h-[52px] bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white rounded-xl pl-12 pr-12 text-[15px] font-medium text-slate-900 outline-none transition-all"
      />
      <button 
        type="button" 
        onClick={() => setShowPassword(!showPassword)} 
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function PasswordChecklist({ rules, strength }) {
  const strengthScores = { Weak: 1, Medium: 2, Strong: 3 };
  const score = strengthScores[strength.label] || 0;
  
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-[13px] shadow-sm">
      <div className="flex items-center justify-between font-bold mb-3 text-xs uppercase tracking-wider">
        <span className="text-slate-500">Strength</span>
        <span className={strength.color}>{strength.label}</span>
      </div>
      
      <div className="flex gap-1.5 mb-4 h-1.5 w-full">
        <div className={`h-full flex-1 rounded-full transition-colors ${score >= 1 ? (score === 1 ? 'bg-rose-500' : score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`}></div>
        <div className={`h-full flex-1 rounded-full transition-colors ${score >= 2 ? (score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`}></div>
        <div className={`h-full flex-1 rounded-full transition-colors ${score >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-medium">
        <Rule active={rules.minLength} text="Min 8 chars" />
        <Rule active={rules.uppercase} text="1 uppercase" />
        <Rule active={rules.special} text="1 special char" />
      </div>
    </div>
  );
}

function Rule({ active, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center justify-center w-4 h-4 rounded-full ${active ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}>
        {active ? <ShieldCheck size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
      </div>
      <span className={active ? "text-slate-800" : "text-slate-500"}>{text}</span>
    </div>
  );
}

function InlineMessage({ text, tone }) {
  if (!text) return null;
  return (
    <p className={`mt-2 text-xs font-bold ${tone === "success" ? "text-emerald-600" : "text-rose-500"}`}>
      {text}
    </p>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

export default SignIn;
