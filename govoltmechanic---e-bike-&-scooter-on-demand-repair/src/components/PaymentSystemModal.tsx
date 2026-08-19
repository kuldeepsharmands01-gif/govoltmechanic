import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  Building2,
  Receipt,
  Download,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Zap,
} from 'lucide-react';
import { PaymentMethod, PaymentTransaction, Appointment } from '../types';

interface PaymentSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  appointment?: Appointment | null;
  serviceTitle?: string;
  onPaymentSuccess: (transaction: PaymentTransaction) => void;
}

export const PaymentSystemModal: React.FC<PaymentSystemModalProps> = ({
  isOpen,
  onClose,
  amount,
  appointment,
  serviceTitle = 'Doorstep Bike Repair & Service',
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [upiSubOption, setUpiSubOption] = useState<'apps' | 'id' | 'qr'>('apps');

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [qrTimer, setQrTimer] = useState(300);

  // Credit/Debit Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('Pradeep');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [saveCard, setSaveCard] = useState(true);

  // Flow & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  // QR Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && selectedMethod === 'upi' && upiSubOption === 'qr' && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, selectedMethod, upiSubOption, qrTimer]);

  if (!isOpen) return null;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Card Network Detector
  const getCardNetwork = (num: string): 'visa' | 'mastercard' | 'rupay' | 'amex' => {
    const cleaned = num.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('51') || cleaned.startsWith('52') || cleaned.startsWith('55')) return 'mastercard';
    if (cleaned.startsWith('60') || cleaned.startsWith('65') || cleaned.startsWith('81') || cleaned.startsWith('50')) return 'rupay';
    if (cleaned.startsWith('34') || cleaned.startsWith('37')) return 'amex';
    return 'rupay';
  };

  const handleVerifyUpiId = () => {
    if (upiId.includes('@') && upiId.length >= 5) {
      setUpiVerified(true);
    }
  };

  const handleCopyUpiLink = () => {
    const upiLink = `upi://pay?pa=govoltmechanic@icici&pn=GoVoltMechanic&am=${amount}&cu=INR&tn=BikeService`;
    navigator.clipboard?.writeText(upiLink);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2500);
  };

  // Trigger Payment Submission
  const handleInitiatePayment = () => {
    setIsProcessing(true);

    if (selectedMethod === 'credit_card' || selectedMethod === 'debit_card') {
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtpScreen(true);
      }, 1000);
      return;
    }

    // UPI or COD flow
    setTimeout(() => {
      completeTransaction();
    }, 1800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      completeTransaction();
    }, 1200);
  };

  const completeTransaction = () => {
    setIsProcessing(false);
    setShowOtpScreen(false);

    const txnId = `PAY_GVM_${Math.floor(10000000 + Math.random() * 90000000)}`;
    const invoiceNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTxn: PaymentTransaction = {
      id: txnId,
      appointmentId: appointment?.id || 'APPT-NEW',
      amount,
      method: selectedMethod,
      status: 'paid',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      upiId: selectedMethod === 'upi' ? (upiSubOption === 'id' ? upiId : `${selectedUpiApp}@govolt`) : undefined,
      upiApp: selectedMethod === 'upi' ? selectedUpiApp : undefined,
      cardLast4: cardNumber ? cardNumber.replace(/\s/g, '').slice(-4) || '4028' : '8821',
      cardNetwork: getCardNetwork(cardNumber),
      cardHolderName: cardHolder,
      bankName: selectedMethod === 'debit_card' ? selectedBank : 'HDFC Bank',
      invoiceNumber: invoiceNum,
      gstNumber: '09AABCU9603R1ZM',
    };

    setCompletedTxn(newTxn);
    setIsPaid(true);
    onPaymentSuccess(newTxn);
  };

  const subtotal = Math.round(amount / 1.18);
  const gst = amount - subtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="payment-system-modal"
        className="bg-[#0D0E15] border border-cyan-500/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.25)] relative flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#101422] to-slate-900 p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
                  SECURE 256-BIT PAYMENT GATEWAY
                </span>
                <span className="px-1.5 py-0.2 bg-green-500/20 text-green-400 text-[9px] font-mono font-bold rounded border border-green-500/30">
                  RBI COMPLIANT
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isPaid ? 'Payment Successful' : 'Complete Doorstep Service Payment'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* PAID RECEIPT VIEW */}
          {isPaid && completedTxn ? (
            <div className="space-y-6 text-center py-2 animate-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-3xl bg-green-500/20 border-2 border-green-400 flex items-center justify-center text-green-400 mx-auto shadow-[0_0_30px_rgba(74,222,128,0.4)] animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">₹{completedTxn.amount.toLocaleString('en-IN')} Received</h4>
                <p className="text-xs text-green-400 font-bold mt-0.5">
                  Payment Confirmed via {completedTxn.method === 'upi' ? 'UPI' : completedTxn.method === 'credit_card' ? 'Credit Card' : 'Debit Card'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">Txn ID: {completedTxn.id}</p>
              </div>

              {/* Digital Tax Invoice Breakdown */}
              <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <p className="font-bold text-white text-xs">GoVoltMechanic Doorstep Services</p>
                    <p className="text-[10px] text-slate-400 font-mono">GSTIN: {completedTxn.gstNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Invoice</p>
                    <p className="font-mono text-cyan-400 font-bold text-xs">{completedTxn.invoiceNumber}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Service Description</span>
                    <span className="text-white font-medium">{serviceTitle}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Net Amount (Excl. Tax)</span>
                    <span className="font-mono text-slate-300">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>CGST + SGST (18%)</span>
                    <span className="font-mono text-slate-300">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Doorstep Workshop Van Surcharge</span>
                    <span className="text-green-400 font-mono font-bold">₹0 (Waived)</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                    <span>Total Paid</span>
                    <span className="text-cyan-400 font-mono">₹{completedTxn.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Warranty & Guarantee Confirmation */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-center gap-2.5 max-w-lg mx-auto text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-300">
                  <strong>10-Day / 1000 KM Warranty Active</strong>. Digital invoice and warranty certificate synced with your vehicle garage.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-lg mx-auto">
                <button
                  onClick={() => {
                    alert(`Tax invoice ${completedTxn.invoiceNumber} downloaded.`);
                  }}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download GST Invoice</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_0_15px_#22d3ee] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : showOtpScreen ? (
            /* 3D SECURE / BANK OTP VERIFICATION MODAL */
            <div className="space-y-5 max-w-md mx-auto py-3 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-white">Bank 3D-Secure Verification</h4>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit OTP sent to registered mobile linked with{' '}
                  <strong className="text-white">
                    {selectedMethod === 'credit_card' ? 'Credit Card' : selectedBank}
                  </strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-2 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest block">
                    Paying Amount
                  </span>
                  <p className="text-2xl font-black font-mono text-cyan-400">₹{amount.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Merchant: GoVoltMechanic Auto Care Pvt Ltd</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-bold block">One-Time Password (OTP)</label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="Enter 6-digit OTP (e.g. 482910)"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>Resend OTP in 24s</span>
                    <button
                      type="button"
                      onClick={() => setOtpValue('739104')}
                      className="text-cyan-400 hover:underline font-mono"
                    >
                      Use Demo OTP (739104)
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_#22d3ee] flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authorizing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirm &amp; Pay ₹{amount.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* MAIN PAYMENT SELECTION VIEW */
            <div className="space-y-6">
              {/* Order / Bill Summary Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Payable Balance</span>
                  <h4 className="text-xl sm:text-2xl font-black font-mono text-white">₹{amount.toLocaleString('en-IN')}</h4>
                  <p className="text-[11px] text-slate-400">{serviceTitle}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold rounded-lg border border-cyan-500/20">
                    100% Secure
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Incl. 18% GST</p>
                </div>
              </div>

              {/* Payment Method Selector Tabs (UPI, Credit Card, Debit Card) */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. UPI */}
                <button
                  type="button"
                  id="tab-method-upi"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'upi'
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'upi' ? 'bg-cyan-500 text-black font-black' : 'bg-white/10 text-cyan-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black">UPI</span>
                  <span className="text-[9px] text-cyan-300 font-mono">GPay • PhonePe • QR</span>
                </button>

                {/* 2. Credit Card */}
                <button
                  type="button"
                  id="tab-method-credit"
                  onClick={() => setSelectedMethod('credit_card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'credit_card'
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'credit_card' ? 'bg-cyan-500 text-black font-black' : 'bg-white/10 text-cyan-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black">Credit Card</span>
                  <span className="text-[9px] text-slate-400 font-mono">Visa • Master • RuPay</span>
                </button>

                {/* 3. Debit Card */}
                <button
                  type="button"
                  id="tab-method-debit"
                  onClick={() => setSelectedMethod('debit_card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'debit_card'
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedMethod === 'debit_card' ? 'bg-cyan-500 text-black font-black' : 'bg-white/10 text-cyan-400'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black">Debit Card</span>
                  <span className="text-[9px] text-slate-400 font-mono">All Indian Banks</span>
                </button>
              </div>

              {/* METHOD 1: UPI CONTAINER */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4 bg-black/40 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 animate-in fade-in duration-200">
                  {/* UPI Submode Toggles */}
                  <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setUpiSubOption('apps')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        upiSubOption === 'apps' ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      UPI Apps
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubOption('qr')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                        upiSubOption === 'qr' ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" /> Scan QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubOption('id')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        upiSubOption === 'id' ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      UPI ID
                    </button>
                  </div>

                  {/* Submode A: Fast UPI Apps (GPay, PhonePe, Paytm, BHIM, CRED) */}
                  {upiSubOption === 'apps' && (
                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        Select Your Preferred UPI App:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'gpay', name: 'Google Pay', badge: 'GPay', color: 'from-blue-600 to-emerald-600' },
                          { id: 'phonepe', name: 'PhonePe', badge: 'Pe', color: 'from-purple-600 to-indigo-700' },
                          { id: 'paytm', name: 'Paytm UPI', badge: 'Paytm', color: 'from-sky-500 to-blue-700' },
                          { id: 'bhim', name: 'BHIM UPI', badge: 'BHIM', color: 'from-orange-500 to-green-600' },
                          { id: 'cred', name: 'CRED UPI', badge: 'CRED', color: 'from-slate-800 to-black' },
                        ].map((app) => (
                          <div
                            key={app.id}
                            onClick={() => setSelectedUpiApp(app.id as any)}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                              selectedUpiApp === app.id
                                ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                                : 'bg-slate-900 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.color} text-white font-black text-[10px] flex items-center justify-center border border-white/20 shadow`}>
                              {app.badge}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-white">{app.name}</p>
                              <p className="text-[9px] text-slate-400 font-mono">Instant Pay</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submode B: Dynamic QR Code */}
                  {upiSubOption === 'qr' && (
                    <div className="space-y-4 text-center py-2">
                      <div className="inline-block p-4 bg-white rounded-2xl shadow-xl border-4 border-cyan-400/80">
                        {/* High Quality Stylized QR Visual with UPI Logo */}
                        <div className="w-48 h-48 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden">
                          {/* Stylized QR Matrix simulation */}
                          <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2 bg-white rounded-lg">
                            {Array.from({ length: 36 }).map((_, i) => (
                              <div
                                key={i}
                                className={`rounded-sm ${
                                  i === 0 || i === 5 || i === 30 || i === 7 || i === 14 || i === 21 || i === 28 || i === 11 || i === 17 || i === 24 || i === 33
                                    ? 'bg-black'
                                    : i % 3 === 0
                                    ? 'bg-slate-900'
                                    : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          {/* Center UPI Badge */}
                          <div className="absolute inset-0 m-auto w-10 h-10 rounded-lg bg-black border-2 border-cyan-400 flex items-center justify-center text-cyan-400 font-black text-[9px] font-mono shadow-md">
                            UPI
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)</p>
                        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>QR Expires in {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyUpiLink}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-all"
                        >
                          {copiedUPI ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUPI ? 'UPI Link Copied' : 'Copy UPI Intent Link'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submode C: Manual UPI ID Input */}
                  {upiSubOption === 'id' && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-300 block">Enter Your UPI ID / VPA</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setUpiVerified(false);
                          }}
                          placeholder="e.g. 9876543210@paytm or name@okhdfcbank"
                          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyUpiId}
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10"
                        >
                          Verify
                        </button>
                      </div>
                      {upiVerified && (
                        <p className="text-xs text-green-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified: Pradeep Kumar (HDFC Bank)</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* METHOD 2 & 3: CREDIT OR DEBIT CARD */}
              {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
                <div className="space-y-4 bg-black/40 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 animate-in fade-in duration-200">
                  {/* Bank selector for Debit cards */}
                  {selectedMethod === 'debit_card' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                      </select>
                    </div>
                  )}

                  {/* Card Number Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {selectedMethod === 'credit_card' ? 'Credit Card Number' : 'Debit Card Number'}
                      </label>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                        {getCardNetwork(cardNumber).toUpperCase()}
                      </span>
                    </div>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 8920 1928 4028"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono tracking-wider"
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name as printed on card"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Valid Thru</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY (e.g. 08/28)"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CVV</label>
                        <span className="text-[9px] text-slate-500">3 or 4 digits</span>
                      </div>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  {/* Save Card Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-1">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-white/20 text-cyan-400 focus:ring-0"
                    />
                    <span>Save card securely for 1-click doorstep service checkout</span>
                  </label>
                </div>
              )}

              {/* Bottom CTA Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-green-400" />
                  <span>256-Bit SSL Encrypted by GoVolt Gateway</span>
                </div>

                <button
                  id="pay-now-primary-btn"
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_#22d3ee] active:scale-95 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Contacting Bank Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{amount.toLocaleString('en-IN')} via {selectedMethod.toUpperCase().replace('_', ' ')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
