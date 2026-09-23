import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  X,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { AALogo } from '../../components/AALogo';
import { SeoMetadata } from '../../components/SeoMetadata';
import { UserRole } from '../../types';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { login, register, loginWithGoogle, showToast } = useEvent();
  const { navigate, queryParams } = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('ORGANIZER');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Google Account Chooser Modal state
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleRole, setCustomGoogleRole] = useState<UserRole>('ORGANIZER');

  const selectedPackageId = queryParams.package as string | undefined;
  const redirectTarget = queryParams.redirect as string | undefined;
  const authRequiredNotice = queryParams.auth === 'required' || queryParams.error === 'auth_required';

  const quickGoogleAccounts = [
    {
      name: 'International Surya Utama',
      email: 'internationalsuryautama@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      role: 'ORGANIZER' as UserRole,
      badge: 'Sesi Aktif (EO)',
    },
    {
      name: 'Taufiq Aminudin',
      email: 'taufiq.aminudin@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'ORGANIZER' as UserRole,
      badge: 'Admin EO',
    },
    {
      name: 'Dimas & Ayu Maharani',
      email: 'dimas.ayu.wedding@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=120&q=80',
      role: 'CLIENT' as UserRole,
      badge: 'Pengantin',
    },
    {
      name: 'Mahkota Creative Studio',
      email: 'vendor@aa-eventmaker.my.id',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      role: 'VENDOR' as UserRole,
      badge: 'Vendor Mitra',
    },
  ];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAuthError('Mohon masukkan alamat email yang valid.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setAuthError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const safeRole: UserRole = role === 'ADMIN' ? 'ORGANIZER' : role;
    setLoading(true);

    if (mode === 'signup') {
      const res = await register({
        name: name.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: phone.trim() || '081382000412',
        password,
        role: safeRole,
        packageId: selectedPackageId,
      });
      setLoading(false);
      if (!res.success) {
        setAuthError(res.error || 'Pendaftaran gagal. Silakan coba lagi.');
        return;
      }
    } else {
      const res = await login(cleanEmail, password, safeRole);
      setLoading(false);
      if (!res.success) {
        setAuthError(res.error || 'Email atau kata sandi tidak cocok.');
        return;
      }
    }

    const dest = redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/dashboard';
    navigate(dest);
  };

  const executeGoogleAuth = async (googleData: {
    email: string;
    name: string;
    avatar?: string;
    role?: UserRole;
  }) => {
    setAuthError(null);
    setLoading(true);
    setShowGooglePicker(false);

    const res = await loginWithGoogle({
      name: googleData.name,
      email: googleData.email,
      avatar: googleData.avatar,
      role: googleData.role || (role === 'ADMIN' ? 'ORGANIZER' : role),
    });

    setLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Autentikasi Google gagal.');
      return;
    }

    const dest = redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/dashboard';
    navigate(dest);
  };

  const handleGoogleButtonClick = () => {
    // If user already typed an email into the email input, use that email directly!
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      const derivedName = name.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      executeGoogleAuth({
        email: cleanEmail,
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        role: role === 'ADMIN' ? 'ORGANIZER' : role,
      });
      return;
    }

    // Otherwise open Google Account Chooser
    setShowGooglePicker(true);
  };

  const handleQuickLogin = async (demoRole: UserRole, demoEmail: string, demoPass: string) => {
    setAuthError(null);
    setEmail(demoEmail);
    setPassword(demoPass);
    setRole(demoRole);
    setLoading(true);

    const safeRole: UserRole = demoRole === 'ADMIN' ? 'ORGANIZER' : demoRole;
    const res = await login(demoEmail, demoPass, safeRole);
    setLoading(false);

    if (!res.success) {
      setAuthError(res.error || 'Akses demo gagal.');
      return;
    }

    const dest = redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/dashboard';
    navigate(dest);
  };

  return (
    <div id="auth-page" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/50 flex flex-col justify-between p-4 sm:p-6">
      <SeoMetadata
        title={mode === 'login' ? 'Masuk ke Akun – AA Event Maker' : 'Daftar Akun Baru – AA Event Maker'}
        description="Masuk atau daftar ke AA Event Maker untuk mengelola undangan digital, RSVP tamu, dan buku tamu QR."
        canonicalPath={mode === 'login' ? '/login' : '/signup'}
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      {/* Top Header Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <AALogo variant="header" size="sm" onClick={() => navigate('/')} />
      </div>

      {/* Centered Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900">
              {mode === 'login' ? 'Selamat Datang Kembali' : 'Mulai Bersama AA Event Maker'}
            </h1>
            <p className="text-xs text-slate-500">
              {mode === 'login'
                ? 'Masuk untuk mengelola undangan dan memantau kehadiran tamu.'
                : 'Buat undangan digital impian Anda secara praktis dalam hitungan menit.'}
            </p>
          </div>

          {authRequiredNotice && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sesi ini memerlukan masuk terlebih dahulu untuk mengakses halaman tujuan.</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => {
                setMode('login');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {/* 1-Click Google OAuth */}
          <button
            onClick={handleGoogleButtonClick}
            disabled={loading}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-60 hover:border-slate-400"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Akun Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold tracking-wider shrink-0">
              atau via email & kata sandi
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Andi Pratama"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor WhatsApp <span className="text-slate-400 font-normal">(untuk RSVP/E-Pass)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081382000412"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'signup' && selectedPackageId && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold flex items-center justify-between">
                <span>Paket Terpilih: <strong>{selectedPackageId.toUpperCase()}</strong></span>
                <span className="text-[10px] text-blue-600">
                  {selectedPackageId === 'starter' ? 'Gratis (Aktif Otomatis)' : 'Perlu Konfirmasi Pembayaran'}
                </span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-xs"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{authError}</span>
                  {mode === 'login' && authError.includes('tidak cocok') && (
                    <div className="mt-1 text-[11px] text-rose-600">
                      Belum memiliki akun?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setAuthError(null);
                        }}
                        className="underline font-bold hover:text-rose-800 cursor-pointer"
                      >
                        Klik Daftar Baru di sini
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Kata Sandi {mode === 'signup' && <span className="text-slate-400 font-normal">(min. 6 karakter)</span>}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-xs"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">
                    Kata sandi belum sama.
                  </p>
                )}
              </div>
            )}

            {/* Role selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Peran Akses Utama</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="ORGANIZER">Penyelenggara Acara / WO (Event Organizer)</option>
                <option value="CLIENT">Calon Pengantin / Tuan Rumah</option>
                <option value="VENDOR">Vendor Acara (Fotografer / Katering)</option>
                <option value="GUEST">Tamu Undangan</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{loading ? 'Memproses...' : mode === 'login' ? 'Masuk ke Dasbor' : 'Daftar Akun Baru'}</span>
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 block text-center uppercase tracking-wider">
              Akses Cepat Pengujian (1-Klik):
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('ORGANIZER', 'organizer@aa-eventmaker.my.id', 'Organizer@2026!')}
                className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
                title="Masuk sebagai Event Organizer"
              >
                <span>📋 Organizer</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('CLIENT', 'klien@aa-eventmaker.my.id', 'Client@2026!')}
                className="py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
                title="Masuk sebagai Calon Pengantin"
              >
                <span>💍 Pengantin</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('VENDOR', 'vendor@aa-eventmaker.my.id', 'Vendor@2026!')}
                className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
                title="Masuk sebagai Vendor Mitra"
              >
                <span>🏢 Vendor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Account Picker Modal */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
            <button
              onClick={() => setShowGooglePicker(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h2 className="text-base font-bold text-slate-900">Masuk dengan Google</h2>
              <p className="text-xs text-slate-500 mt-0.5">Pilih akun Google untuk melanjutkan ke AA Event Maker</p>
            </div>

            {/* Quick Profiles */}
            <div className="p-6 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Akun Terdeteksi:
              </div>
              <div className="space-y-2">
                {quickGoogleAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => executeGoogleAuth(acc)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center space-x-1.5 pl-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-800">
                        {acc.badge}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Google Email Input */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 mb-2">
                  Atau gunakan alamat Google lainnya:
                </div>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="contoh@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Nama Lengkap (Opsional)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    disabled={!customGoogleEmail.trim() || loading}
                    onClick={() => {
                      const email = customGoogleEmail.trim().toLowerCase();
                      const derivedName = customGoogleName.trim() || email.split('@')[0].replace(/[._-]/g, ' ');
                      executeGoogleAuth({
                        email: email.includes('@') ? email : `${email}@gmail.com`,
                        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
                        role: customGoogleRole,
                      });
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Lanjutkan dengan Email Ini</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="text-center text-[11px] text-slate-400 py-3">
        © {new Date().getFullYear()} AA Event Maker. Aman & Terlindungi.
      </div>
    </div>
  );
};
