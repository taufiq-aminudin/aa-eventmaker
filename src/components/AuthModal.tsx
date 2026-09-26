import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Heart,
  Camera,
  Ticket,
  User,
  ExternalLink,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { UserRole, SavedDeviceAccount } from '../types';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    loginWithGoogle,
    currentUser,
    setShowPublicLanding,
    deviceAccounts,
    removeDeviceAccount,
  } = useEvent();

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const deviceName = isMobile ? 'HP' : 'Laptop';

  const [deviceGoogleAccount] = useState<{ email: string; name: string }>(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('aa_device_google_email');
      const savedName = localStorage.getItem('aa_device_google_name');
      if (savedEmail) {
        return { email: savedEmail, name: savedName || savedEmail.split('@')[0] };
      }
    }
    return {
      email: 'suryautama0001@gmail.com',
      name: 'Surya Utama',
    };
  });

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ORGANIZER');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!showAuthModal) return null;

  const handleGoogleSignIn = async (account?: SavedDeviceAccount) => {
    setIsProcessing(true);
    try {
      if (account) {
        await loginWithGoogle({
          name: account.name,
          email: account.email,
          avatar: account.avatar,
          role: account.role,
        });
      } else if (customEmail.trim()) {
        const email = customEmail.trim();
        const derivedName = customName.trim() || email.split('@')[0].replace(/[._-]/g, ' ');
        await loginWithGoogle({
          name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
          email: email.includes('@') ? email : `${email}@gmail.com`,
          role: selectedRole,
        });
      } else {
        // Fallback to detected device Google account
        await loginWithGoogle({
          name: deviceGoogleAccount.name,
          email: deviceGoogleAccount.email,
          role: selectedRole,
        });
      }
      setShowAuthModal(false);
      setShowPublicLanding(false);
    } catch (err) {
      console.error('Google sign in error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-orange-600 px-6 pt-7 pb-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex justify-center mb-3">
            <div className="w-13 h-13 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
              <img src="/icon.svg" alt="AA-EventMaker" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">AA-EventMaker</h2>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            Plan • Manage • Make It Happen
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900">Masuk dengan Google</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Akses instan dasbor acara, buat undangan digital, dan kelola RSVP tanpa perlu mengingat kata sandi.
            </p>
          </div>

          {/* If already logged in */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="text-slate-500">Masuk sebagai: </span>
                  <strong className="text-slate-900">{currentUser.name}</strong>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setShowPublicLanding(false);
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline shrink-0 ml-2"
              >
                Buka Dasbor
              </button>
            </div>
          )}

          {/* Ambil Data Akun Google Perangkat Ini (1-Klik) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-amber-50/40 border border-blue-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-blue-200 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {deviceGoogleAccount.name}
                  </div>
                  <div className="text-[11px] text-blue-700 font-semibold truncate">
                    {deviceGoogleAccount.email}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                Google {deviceName}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleGoogleSignIn({
                id: 'device-google',
                name: deviceGoogleAccount.name,
                email: deviceGoogleAccount.email,
                role: selectedRole,
                lastLoginAt: Date.now(),
              })}
              disabled={isProcessing}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gunakan Akun Google {deviceName} Ini</span>
            </button>
          </div>

          {/* Primary Google One-Click Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowCustomInput((prev) => !prev)}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-blue-400 rounded-2xl shadow-xs font-bold text-xs flex items-center justify-center space-x-3 transition-all hover:shadow-md cursor-pointer disabled:opacity-60"
            >
              {/* Official Google Vector Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.37 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>
                {showCustomInput
                  ? `Tutup Pilihan Akun Lain`
                  : `Pilih / Masukkan Akun Google Lain di ${deviceName}`}
              </span>
            </button>
          </div>

          {deviceAccounts.length > 0 && (
            <>
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center space-x-1">
                  {isMobile ? <Smartphone className="w-3 h-3 text-blue-600 inline mr-1" /> : <Laptop className="w-3 h-3 text-blue-600 inline mr-1" />}
                  <span>Akun di {deviceName} Ini</span>
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Accounts on this device */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                {deviceAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    className="w-full text-left p-2.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
                  >
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn(acc)}
                      disabled={isProcessing}
                      className="flex items-center space-x-3 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        {acc.avatar ? (
                          <img
                            src={acc.avatar}
                            alt={acc.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-slate-200">
                            {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-xs">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                          {acc.name || acc.email}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                      </div>
                    </button>
                    <div className="shrink-0 flex items-center space-x-1.5 pl-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-800">
                        {acc.role}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDeviceAccount(acc.email);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus dari perangkat"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Toggle Custom Google Account Option */}
          <div className="pt-1">
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors block mx-auto text-center"
              >
                + Gunakan alamat email Google lainnya di {deviceName}
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-800">
                  Masukkan Akun Google Anda:
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rian Pratama"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email Google (@gmail.com)
                  </label>
                  <input
                    type="email"
                    placeholder="namaanda@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Peran Akun
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['ORGANIZER', 'CLIENT', 'VENDOR', 'GUEST'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg border transition-all ${
                          selectedRole === r
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r === 'ORGANIZER' && 'Event Organizer'}
                        {r === 'CLIENT' && 'Klien / Pengantin'}
                        {r === 'VENDOR' && 'Vendor Mitra'}
                        {r === 'GUEST' && 'Tamu Undangan'}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={!customEmail.trim() || isProcessing}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Masuk dengan Email Google Ini</span>
                </button>
              </div>
            )}
          </div>

          {/* Security & Privacy Disclaimer */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Google OAuth 2.0 Aman • Tanpa Akses Password</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Dengan masuk, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi AA-EventMaker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
