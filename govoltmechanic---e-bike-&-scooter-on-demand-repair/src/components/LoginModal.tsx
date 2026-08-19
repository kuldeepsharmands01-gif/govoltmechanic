import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Wrench,
  User,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserPlus,
  LogIn,
  RotateCcw,
  AlertCircle,
  MessageSquare,
  Building2,
  Check,
  Smartphone,
  Copy,
  CheckCheck,
  Eye,
  EyeOff,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { getRegisteredUsers, saveRegisteredUser, resetUserPassword, MOCK_USERS } from '../data/mockUsers';
import { playEtaChime } from '../utils/notifications';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  currentUser: UserProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  // Main mode: 'login' | 'register' | 'forgot_password'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Login method: 'otp' or 'password'
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('6397852208'); // Default demo phone
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSentTarget, setOtpSentTarget] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regVanId, setRegVanId] = useState('VAN-301 (Rapid Mobile Hub)');
  const [regSpecialty, setRegSpecialty] = useState('Master EV Battery & Controller Diagnostics');
  const [regAdminTitle, setRegAdminTitle] = useState('Senior Dispatch Supervisor');

  // Forgot Password States
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotGeneratedOtp, setForgotGeneratedOtp] = useState<string | null>(null);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request_otp' | 'verify_and_reset'>('request_otp');
  const [forgotCountdown, setForgotCountdown] = useState(0);

  // Messages & Banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [realtimeSmsNotification, setRealtimeSmsNotification] = useState<{
    phone: string;
    code: string;
    timestamp: string;
  } | null>(null);
  const [registeredUsersList, setRegisteredUsersList] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRegisteredUsersList(getRegisteredUsers());
      setErrorMessage(null);
      setSuccessBanner(null);
      setRealtimeSmsNotification(null);
    }
  }, [isOpen]);

  // Countdown timer for Login OTP
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Countdown timer for Forgot Password OTP
  useEffect(() => {
    if (forgotCountdown > 0) {
      const timer = setTimeout(() => setForgotCountdown(forgotCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [forgotCountdown]);

  if (!isOpen) return null;

  // Real-Time SMS Dispatcher
  const dispatchRealTimeSms = (target: string, code: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRealtimeSmsNotification({
      phone: target,
      code,
      timestamp: timeNow,
    });
    try {
      playEtaChime();
    } catch (e) {
      // Audio fallback
    }
  };

  // Send OTP handler for Login
  const handleSendLoginOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanInput = loginIdentifier.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your Mobile Number or Email ID.');
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSentTarget(cleanInput);
    setOtpCountdown(45);
    setSuccessBanner(`⚡ Real-Time SMS OTP sent to ${cleanInput}`);

    dispatchRealTimeSms(cleanInput, code);
  };

  // Verify OTP / Password & Login (Stays on current page)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInput = loginIdentifier.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your Mobile Number or Email ID.');
      return;
    }

    const allUsers = getRegisteredUsers();
    let userToAuth = allUsers.find(
      (u) =>
        u.phone.trim() === cleanInput ||
        u.email.trim().toLowerCase() === cleanInput.toLowerCase() ||
        cleanInput.includes(u.phone.trim())
    );

    if (loginMethod === 'otp') {
      if (!generatedOtp) {
        setErrorMessage('Please click "Send Real-Time OTP" first.');
        return;
      }
      if (enteredOtp.trim() !== generatedOtp.trim()) {
        setErrorMessage('Incorrect 6-digit OTP entered. Please check the code received on your mobile.');
        return;
      }

      // If user does not exist yet, auto-provision customer account for frictionless entry
      if (!userToAuth) {
        const isEmail = cleanInput.includes('@');
        userToAuth = {
          id: `u-cust-${Date.now()}`,
          name: isEmail ? cleanInput.split('@')[0] : `Customer ${cleanInput.slice(-4)}`,
          phone: isEmail ? '6397852208' : cleanInput,
          email: isEmail ? cleanInput : `user.${cleanInput.slice(-4)}@govolt.in`,
          role: 'customer',
          registeredAt: new Date().toISOString(),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        };
        saveRegisteredUser(userToAuth);
      }
    } else {
      // Password validation
      if (!userToAuth) {
        setErrorMessage(`No account found for "${cleanInput}". You can log in via OTP or Register a new account.`);
        return;
      }
      if (!loginPassword) {
        setErrorMessage('Please enter your account password.');
        return;
      }
      if (userToAuth.password && userToAuth.password !== loginPassword) {
        setErrorMessage('Invalid password for this registered account.');
        return;
      }
    }

    // Success! Log in and close modal (stays on current page)
    onLogin(userToAuth);
    onClose();
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid Email Address.');
      return;
    }
    if (!regPassword.trim()) {
      setErrorMessage('Please set a Password or Security PIN.');
      return;
    }

    // Check if phone or email already registered
    const allUsers = getRegisteredUsers();
    const alreadyExists = allUsers.some(
      (u) =>
        u.phone === regPhone.trim() ||
        u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (alreadyExists) {
      setErrorMessage('An account with this Mobile Number or Email already exists. Please Sign In.');
      return;
    }

    const newUser: UserProfile = {
      id: `u-${regRole}-${Date.now()}`,
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
      role: regRole,
      avatar:
        regRole === 'technician'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : regRole === 'admin'
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      technicianId: regRole === 'technician' ? `t-${Date.now()}` : undefined,
      vanId: regRole === 'technician' ? regVanId : undefined,
      specialty: regRole === 'technician' ? regSpecialty : undefined,
      adminTitle: regRole === 'admin' ? regAdminTitle : undefined,
      registeredAt: new Date().toISOString(),
    };

    saveRegisteredUser(newUser);
    setRegisteredUsersList(getRegisteredUsers());

    // Auto-login registered user and stay on current page
    onLogin(newUser);
    onClose();
  };

  // Handle Forgot Password - Step 1: Send OTP
  const handleSendForgotOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanInput = forgotIdentifier.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your registered Mobile Number or Email.');
      return;
    }

    const allUsers = getRegisteredUsers();
    const existingUser = allUsers.find(
      (u) =>
        u.phone.trim() === cleanInput ||
        u.email.trim().toLowerCase() === cleanInput.toLowerCase() ||
        cleanInput.includes(u.phone.trim())
    );

    if (!existingUser) {
      setErrorMessage(`No registered account found for "${cleanInput}". Please check the details or create a new account.`);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setForgotGeneratedOtp(code);
    setForgotCountdown(45);
    setForgotStep('verify_and_reset');
    setSuccessBanner(`⚡ Real-Time Reset OTP sent to ${cleanInput}`);

    dispatchRealTimeSms(cleanInput, code);
  };

  // Handle Forgot Password - Step 2: Verify OTP & Reset Password
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!forgotOtp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP sent to your mobile.');
      return;
    }
    if (forgotOtp.trim() !== forgotGeneratedOtp?.trim()) {
      setErrorMessage('Incorrect OTP. Please check the SMS code received on your phone.');
      return;
    }
    if (!forgotNewPassword.trim() || forgotNewPassword.length < 3) {
      setErrorMessage('Please enter a new password with at least 3 characters.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type your new password.');
      return;
    }

    const result = resetUserPassword(forgotIdentifier, forgotNewPassword);
    if (!result.success || !result.user) {
      setErrorMessage(result.message);
      return;
    }

    setSuccessBanner('✓ Password updated successfully! Logging you in...');
    setTimeout(() => {
      onLogin(result.user!);
      onClose();
    }, 800);
  };

  const handleQuickDemoSelect = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.25)] relative flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {authMode === 'login' ? (
                <Lock className="w-5 h-5" />
              ) : authMode === 'register' ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <KeyRound className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                {authMode === 'forgot_password'
                  ? 'Forgot Password & PIN Recovery'
                  : 'GOVOLT Access & Registration Hub'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login'
                  ? 'Sign in via Real-Time Mobile OTP or Password'
                  : authMode === 'register'
                  ? 'Register customer, technician van, or admin account'
                  : 'Verify your phone via SMS OTP and set a new password'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Top Auth Mode Toggle (Sign In vs Register vs Forgot Password) */}
          {authMode !== 'forgot_password' ? (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                  setSuccessBanner(null);
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage(null);
                  setSuccessBanner(null);
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Register Account
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
                setSuccessBanner(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          )}

          {/* Real-Time Mobile SMS Push Notification Simulation */}
          {realtimeSmsNotification && (
            <div className="p-4 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-400/50 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.3)] animate-fadeIn space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400 animate-bounce" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                    Real-Time SMS Delivered ({realtimeSmsNotification.timestamp})
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold rounded">
                  +91 {realtimeSmsNotification.phone}
                </span>
              </div>
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-200">
                  <strong className="text-cyan-400 font-mono">GOVOLT Alert:</strong> Your OTP code is{' '}
                  <strong className="text-white text-sm tracking-widest font-mono bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40">
                    {realtimeSmsNotification.code}
                  </strong>
                  . Valid for 5 min.
                </p>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (authMode === 'forgot_password') {
                        setForgotOtp(realtimeSmsNotification.code);
                      } else {
                        setEnteredOtp(realtimeSmsNotification.code);
                      }
                      copyToClipboard(realtimeSmsNotification.code);
                    }}
                    className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] uppercase rounded-lg transition-all flex items-center gap-1 shadow-md"
                  >
                    {copiedOtp ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedOtp ? 'Filled' : 'Auto-Fill'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successBanner && !realtimeSmsNotification && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-2 text-xs text-green-300 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span className="font-mono font-bold">{successBanner}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. SIGN IN (LOGIN) TAB */}
          {/* ========================================================================= */}
          {authMode === 'login' && (
            <div className="space-y-5">
              {/* Method Switcher: OTP vs Password */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Select Login Authentication Method
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('otp');
                      setErrorMessage(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      loginMethod === 'otp'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Mobile Real-Time OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('password');
                      setErrorMessage(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      loginMethod === 'password'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Password / PIN
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Customer Mobile Number or Email ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 6397852208 or customer@govolt.in"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* OTP Mode Fields */}
                {loginMethod === 'otp' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-Digit SMS OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-center font-mono font-bold text-white tracking-widest placeholder:text-slate-600 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendLoginOtp()}
                        disabled={otpCountdown > 0}
                        className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                          otpCountdown > 0
                            ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Send Real-Time OTP'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      ⚡ OTP is delivered instantly to the entered phone number.
                    </p>
                  </div>
                )}

                {/* Password Mode Fields */}
                {loginMethod === 'password' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-slate-400">
                        Account Password or PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot_password');
                          setForgotIdentifier(loginIdentifier);
                          setForgotStep('request_otp');
                          setErrorMessage(null);
                          setSuccessBanner(null);
                        }}
                        className="text-[11px] text-cyan-400 hover:underline font-bold"
                      >
                        Forgot Password / PIN?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none pr-10 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Verify and Enter Portal Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <span>Verify and enter portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Forgot Password link for general access */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot_password');
                    setForgotIdentifier(loginIdentifier);
                    setForgotStep('request_otp');
                    setErrorMessage(null);
                    setSuccessBanner(null);
                  }}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Forgot Password?
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  className="text-slate-300 hover:text-white font-bold"
                >
                  New to GOVOLT? <span className="text-cyan-400 underline">Register</span>
                </button>
              </div>

              {/* Quick 1-Click Demo Accounts */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                  Quick 1-Click Role Switcher:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {registeredUsersList.slice(0, 4).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickDemoSelect(user)}
                      className="p-2.5 bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 rounded-xl text-left flex items-center gap-2.5 transition-all group"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.2 bg-cyan-500/20 text-cyan-300 rounded">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{user.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. FORGOT PASSWORD / PIN RECOVERY MODULE */}
          {/* ========================================================================= */}
          {authMode === 'forgot_password' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <KeyRound className="w-4 h-4" />
                  <span>Password / PIN Reset Assistant</span>
                </div>
                <p className="text-xs text-slate-300">
                  Enter your registered mobile number or email. We will send a real-time SMS OTP to verify your identity and allow you to set a new password.
                </p>
              </div>

              {forgotStep === 'request_otp' ? (
                <form onSubmit={handleSendForgotOtp} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      Registered Mobile Number or Email ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6397852208 or customer@govolt.in"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send Real-Time Reset OTP via SMS</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  {/* Step 2: OTP & New Password Form */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      Enter 6-Digit SMS Verification OTP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-Digit OTP"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-center font-mono font-bold text-white tracking-widest placeholder:text-slate-600 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleSendForgotOtp()}
                        disabled={forgotCountdown > 0}
                        className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
                          forgotCountdown > 0
                            ? 'bg-white/5 text-slate-500 border border-white/5'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {forgotCountdown > 0 ? `Resend (${forgotCountdown}s)` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        New Password / PIN
                      </label>
                      <div className="relative">
                        <input
                          type={showForgotNewPassword ? 'text' : 'password'}
                          placeholder="New password"
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showForgotNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-green-500 hover:from-amber-400 hover:to-green-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Update Password & Enter Portal</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. REGISTER NEW ACCOUNT TAB */}
          {/* ========================================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Select Account Role to Register
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      regRole === 'customer'
                        ? 'bg-cyan-500 text-black font-black border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-bold block">Rider / Owner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('technician')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      regRole === 'technician'
                        ? 'bg-amber-500 text-black font-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-bold block">Technician</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      regRole === 'admin'
                        ? 'bg-purple-600 text-white font-black border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-bold block">Operations Admin</span>
                  </button>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    10-Digit Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 6397852208"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Set Account Password / PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none pr-8"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Technician Specific Fields */}
              {regRole === 'technician' && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                  <p className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Technician Van & Specialty Configuration
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Mobile Workshop Van ID
                      </label>
                      <input
                        type="text"
                        value={regVanId}
                        onChange={(e) => setRegVanId(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        EV Specialty Domain
                      </label>
                      <input
                        type="text"
                        value={regSpecialty}
                        onChange={(e) => setRegSpecialty(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Specific Fields */}
              {regRole === 'admin' && (
                <div className="p-3.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl space-y-3">
                  <p className="text-[10px] font-black uppercase text-purple-300 tracking-wider">
                    Admin Operations Role
                  </p>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Dispatch Title / Department
                    </label>
                    <input
                      type="text"
                      value={regAdminTitle}
                      onChange={(e) => setRegAdminTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Register Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Register Account & Log In</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-400"
                >
                  Already registered? <strong className="text-white underline">Sign In instead</strong>
                </button>
              </div>
            </form>
          )}

          {/* Security Assurance */}
          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-[11px] text-slate-400">
            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
            <span>256-bit AES encrypted authentication with real-time SMS push verification.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
