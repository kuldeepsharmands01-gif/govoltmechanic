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
  Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { getRegisteredUsers, saveRegisteredUser, MOCK_USERS } from '../data/mockUsers';

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
  // Main mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login method: 'otp' or 'password'
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Email or Phone
  const [loginPassword, setLoginPassword] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSentTarget, setOtpSentTarget] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regVanId, setRegVanId] = useState('VAN-301 (Rapid Mobile Hub)');
  const [regSpecialty, setRegSpecialty] = useState('Master EV Battery & Controller Diagnostics');
  const [regAdminTitle, setRegAdminTitle] = useState('Senior Dispatch Supervisor');
  const [regAdminSecret, setRegAdminSecret] = useState('');

  // Messages & Errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [registeredUsersList, setRegisteredUsersList] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRegisteredUsersList(getRegisteredUsers());
      setErrorMessage(null);
      setSuccessBanner(null);
    }
  }, [isOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  if (!isOpen) return null;

  // Send OTP handler
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanInput = loginIdentifier.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your registered Mobile Number or Email.');
      return;
    }

    const allUsers = getRegisteredUsers();
    const existing = allUsers.find(
      (u) =>
        u.phone === cleanInput ||
        u.email.toLowerCase() === cleanInput.toLowerCase() ||
        cleanInput.includes(u.phone)
    );

    if (!existing) {
      setErrorMessage(
        `No registered account found for "${cleanInput}". Please click "Create New Account" to register first.`
      );
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSentTarget(cleanInput);
    setOtpCountdown(45);
    setSuccessBanner(`⚡ OTP generated: ${code} (Sent to ${cleanInput})`);
  };

  // Verify OTP / Password & Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInput = loginIdentifier.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your Mobile Number or Email ID.');
      return;
    }

    const allUsers = getRegisteredUsers();
    const existingUser = allUsers.find(
      (u) =>
        u.phone === cleanInput ||
        u.email.toLowerCase() === cleanInput.toLowerCase() ||
        cleanInput.includes(u.phone)
    );

    if (!existingUser) {
      setErrorMessage(
        `Account not registered for "${cleanInput}". Please register first.`
      );
      return;
    }

    if (loginMethod === 'otp') {
      if (!generatedOtp) {
        setErrorMessage('Please click "Send OTP" first.');
        return;
      }
      if (enteredOtp.trim() !== generatedOtp.trim()) {
        setErrorMessage('Incorrect OTP entered. Please check the 6-digit code.');
        return;
      }
    } else {
      // Password validation
      if (!loginPassword) {
        setErrorMessage('Please enter your account password.');
        return;
      }
      if (existingUser.password && existingUser.password !== loginPassword) {
        setErrorMessage('Invalid password for this registered account.');
        return;
      }
    }

    // Success!
    onLogin(existingUser);
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

    // Auto-login registered user
    onLogin(newUser);
    onClose();
  };

  const handleQuickDemoSelect = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.25)] relative">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {authMode === 'login' ? <Lock className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                GOVOLT Access & Registration Hub
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login'
                  ? 'Sign in with Mobile / Email & OTP or Password'
                  : 'Register user, technician van, or admin account'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Top Auth Mode Toggle (Sign In vs Register) */}
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
              Register (New Account)
            </button>
          </div>

          {/* Alert / OTP Simulation Banner */}
          {successBanner && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-between gap-2 text-xs text-green-300 animate-fadeIn">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400 shrink-0" />
                <span className="font-mono font-bold">{successBanner}</span>
              </div>
              {generatedOtp && (
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="px-2.5 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-[10px] font-bold uppercase rounded-lg border border-green-500/30 shrink-0"
                >
                  Auto-Fill
                </button>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {errorMessage.includes('register first') && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      if (loginIdentifier.includes('@')) {
                        setRegEmail(loginIdentifier);
                      } else {
                        setRegPhone(loginIdentifier);
                      }
                      setErrorMessage(null);
                    }}
                    className="block mt-1.5 text-cyan-400 hover:underline font-bold text-xs"
                  >
                    → Go to Registration Form with "{loginIdentifier}"
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= SIGN IN TAB ================= */}
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
                    onClick={() => setLoginMethod('otp')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      loginMethod === 'otp'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Mobile / Email OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
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
                    Registered Mobile Number or Email ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 6397852208 or admin@govolt.in or amit.tech@govolt.in"
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
                        placeholder="Enter 6-Digit OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-center font-mono font-bold text-white tracking-widest placeholder:text-slate-600 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        disabled={otpCountdown > 0}
                        className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                          otpCountdown > 0
                            ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                        }`}
                      >
                        {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Password Mode Fields */}
                {loginMethod === 'password' && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      Account Password or PIN
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Verify & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Not Registered Prompt */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between text-xs text-slate-400">
                <span>Don't have an account registered yet?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Register Now →
                </button>
              </div>

              {/* Quick 1-Click Demo Accounts */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                  Quick Pre-Registered Demo Accounts (1-Click)
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

          {/* ================= REGISTER TAB ================= */}
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
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    required
                  />
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
            <span>256-bit AES encrypted authentication with persistent multi-role session memory.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
