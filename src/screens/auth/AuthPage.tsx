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
  const { login, register, showToast } = useEvent();
  const { navigate, queryParams } = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('ORGANIZER');

  const selectedPackageId = queryParams.package as string | undefined;
  const redirectTarget = queryParams.redirect as string | undefined;
  const authRequiredNotice = queryParams.auth === 'required' || queryParams.error === 'auth_required';

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Mohon masukkan alamat email Anda.');
      return;
    }

    // Public login and registration must only assign normal user roles
    const safeRole: UserRole = role === 'ADMIN' ? 'ORGANIZER' : role;

    if (mode === 'signup') {
      register({
        name: name || email.split('@')[0],
        email,
        phone: phone.trim() || '081382000412',
        role: safeRole,
        packageId: selectedPackageId,
      });
      showToast('Pendaftaran berhasil! Selamat datang di AA Event Maker.');
    } else {
      login(email, safeRole);
      showToast('Berhasil masuk ke akun Anda.');
    }

    const dest = redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/dashboard';
    navigate(dest);
  };

  const handleGoogleLogin = () => {
    const safeRole: UserRole = role === 'ADMIN' ? 'ORGANIZER' : role;
    login('google-user@gmail.com', safeRole);
    showToast('Masuk instan via Google berhasil!');
    const dest = redirectTarget && !redirectTarget.startsWith('/admin') ? redirectTarget : '/dashboard';
    navigate(dest);
  };

  const handleQuickLogin = (demoRole: UserRole, demoEmail: string) => {
    // Normal roles only for public login
    const safeRole: UserRole = demoRole === 'ADMIN' ? 'ORGANIZER' : demoRole;
    login(demoEmail, safeRole);
    showToast(`Masuk sebagai ${safeRole} (${demoEmail})`);
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
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {/* 1-Click Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              atau via email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
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
                      placeholder="Nama Anda atau Nama Pengantin"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081382000412"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Peran Akses Utama</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                <option value="ORGANIZER">Penyelenggara Acara / WO (Event Organizer)</option>
                <option value="CLIENT">Calon Pengantin / Tuan Rumah</option>
                <option value="VENDOR">Vendor Acara (Fotografer/Katering)</option>
                <option value="GUEST">Tamu Undangan</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{mode === 'login' ? 'Masuk ke Dasbor' : 'Daftar Sekarang'}</span>
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
                onClick={() => handleQuickLogin('ORGANIZER', 'organizer@aa-eventmaker.my.id')}
                className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>📋 Organizer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('CLIENT', 'klien@aa-eventmaker.my.id')}
                className="py-2 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>💍 Pengantin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('VENDOR', 'vendor@aa-eventmaker.my.id')}
                className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>🏢 Vendor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-[11px] text-slate-400 py-3">
        © {new Date().getFullYear()} AA Event Maker. Aman & Terlindungi.
      </div>
    </div>
  );
};
