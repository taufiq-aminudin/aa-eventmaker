import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Camera,
  Ticket,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { UserRole } from '../types';
import { AALogo } from './AALogo';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    lastRegisteredUser,
    switchRole,
  } = useEvent();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('ORGANIZER');
  const [regOrgName, setRegOrgName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAgreeTerms, setRegAgreeTerms] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!loginEmail.trim()) {
      setFormError('Silakan masukkan email Anda.');
      return;
    }
    login(loginEmail);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    switchRole(role);
    setShowAuthModal(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!regName.trim()) {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }
    if (!regEmail.trim()) {
      setFormError('Alamat email wajib diisi.');
      return;
    }
    if (!regPhone.trim()) {
      setFormError('Nomor WhatsApp wajib diisi untuk verifikasi E-Pass & notifikasi.');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 6) {
      setFormError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (!regAgreeTerms) {
      setFormError('Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.');
      return;
    }

    register({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: regRole,
      organizationName: regOrgName.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Modal Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Branding */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-orange-600 px-6 pt-7 pb-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
              <img src="/icon.svg" alt="AA-EventMaker" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">AA-EventMaker</h2>
          <p className="text-xs text-blue-100 font-medium">Plan • Manage • Make It Happen</p>
        </div>

        {/* Modal Body: Login / Register / Success */}
        <div className="p-6 sm:p-7">
          {authModalMode === 'login' && (
            <div>
              <div className="text-center mb-5">
                <h3 className="text-lg font-bold text-slate-900">Masuk ke Akun Anda</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Akses dasbor acara, manajemen tamu, dan kalkulator budget
                </p>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                  {formError}
                </div>
              )}

              {/* Quick Role Tester / Demo Logins */}
              <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Login Cepat Uji Coba (Pilih Peran):</span>
                  <span className="text-[10px] text-blue-600 font-semibold">1-Click Test</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('ORGANIZER')}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">Event Organizer</div>
                      <div className="text-[10px] text-slate-400">Dasbor EO Penuh</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('CLIENT')}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-300 text-left transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">Klien / Pengantin</div>
                      <div className="text-[10px] text-slate-400">Countdown & Angpao</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('VENDOR')}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">Vendor Partner</div>
                      <div className="text-[10px] text-slate-400">Termin & Rundown PIC</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('GUEST')}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">Tamu Undangan</div>
                      <div className="text-[10px] text-slate-400">E-Pass QR & Rute</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-slate-200" />
                <span className="shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">Atau Masuk Email</span>
                <div className="grow border-t border-slate-200" />
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-600">Ingat Saya</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Fitur reset sandi telah dikirim ke email terdaftar.')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Lupa Sandi?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-600">
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="text-orange-600 hover:text-orange-700 font-bold"
                >
                  Daftar Akun Baru
                </button>
              </div>
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Daftar Akun Baru</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bergabunglah dengan AA-EventMaker untuk mengelola event dengan mudah
                </p>
              </div>

              {formError && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Role Selector Cards */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pilih Peran Akun Anda:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('ORGANIZER')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        regRole === 'ORGANIZER'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-xs">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        <span>Penyelenggara / EO</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Kelola tim, budget & vendor</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('CLIENT')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        regRole === 'CLIENT'
                          ? 'border-pink-600 bg-pink-50/70 text-pink-900 ring-2 ring-pink-600/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-xs">
                        <Heart className="w-3.5 h-3.5 text-pink-600" />
                        <span>Pengantin / Klien</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Pantau RSVP & angpao</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('VENDOR')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        regRole === 'VENDOR'
                          ? 'border-orange-600 bg-orange-50/70 text-orange-900 ring-2 ring-orange-600/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-xs">
                        <Camera className="w-3.5 h-3.5 text-orange-600" />
                        <span>Vendor Partner</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Jadwal loading & termin</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('GUEST')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        regRole === 'GUEST'
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-xs">
                        <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tamu Undangan</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">E-Pass QR & rute lokasi</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Contoh: Dimas Aditya"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="08123456789"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {(regRole === 'ORGANIZER' || regRole === 'VENDOR') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Usaha / Organizer
                    </label>
                    <input
                      type="text"
                      value={regOrgName}
                      onChange={(e) => setRegOrgName(e.target.value)}
                      placeholder="Contoh: Royal Wedding Organizer"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Buat Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regAgreeTerms}
                      onChange={(e) => setRegAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      Saya menyetujui Ketentuan Layanan & Kebijakan Privasi AA-EventMaker untuk keamanan data acara.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Daftar Sekarang & Aktifkan Akun</span>
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-slate-600">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  Masuk di sini
                </button>
              </div>
            </div>
          )}

          {authModalMode === 'registered_success' && (
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Notifikasi Pendaftaran Berhasil</span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Selamat Datang, {lastRegisteredUser?.name || 'Member Baru'}!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Akun peran <strong>{lastRegisteredUser?.role}</strong> Anda telah berhasil diverifikasi dan siap digunakan.
              </p>

              {/* Role specific highlight */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Ringkasan Akun Anda:</span>
                  <span className="text-blue-600 font-bold uppercase text-[10px]">{lastRegisteredUser?.role}</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  • Email: <strong>{lastRegisteredUser?.email}</strong>
                </div>
                <div className="text-slate-600 text-[11px]">
                  • WhatsApp: <strong>{lastRegisteredUser?.phone}</strong>
                </div>
                {lastRegisteredUser?.role === 'ORGANIZER' && (
                  <div className="text-purple-700 text-[11px] font-medium pt-1">
                    💡 Fitur aktif: Buat acara, undang vendor, kelola budget multi-mata uang, dan scanner QR tamu.
                  </div>
                )}
                {lastRegisteredUser?.role === 'CLIENT' && (
                  <div className="text-pink-700 text-[11px] font-medium pt-1">
                    💡 Fitur aktif: Countdown hari-H, live tracker tamu RSVP, dan amplop digital transfer.
                  </div>
                )}
                {lastRegisteredUser?.role === 'VENDOR' && (
                  <div className="text-orange-700 text-[11px] font-medium pt-1">
                    💡 Fitur aktif: Jadwal loading perlengkapan, termin termin pembayaran, & kontak PIC panitia.
                  </div>
                )}
                {lastRegisteredUser?.role === 'GUEST' && (
                  <div className="text-emerald-700 text-[11px] font-medium pt-1">
                    💡 Fitur aktif: E-Pass QR Check-in, petunjuk rute Google Maps, dan buku ucapan digital.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Buka Dasbor {lastRegisteredUser?.role} Saya Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
