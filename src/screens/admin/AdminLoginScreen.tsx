import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useEvent } from '../../context/EventContext';

export const AdminLoginScreen: React.FC = () => {
  const { navigate } = useRouter();
  const { loginAdmin, currentUser } = useEvent();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in as ADMIN, allow direct transition to console
  if (currentUser?.role === 'ADMIN') {
    return (
      <div id="admin-already-authenticated-screen" className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sesi Administrator Aktif</h2>
          <p className="text-xs text-slate-400 mb-6">
            Anda telah terautentikasi sebagai <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.email}).
          </p>
          <div className="space-y-3">
            <button
              id="admin-continue-to-console-btn"
              onClick={() => navigate('/admin/dashboard')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Buka Konsol Administrator</span>
            </button>
            <button
              id="admin-return-home-btn"
              onClick={() => navigate('/')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
            >
              Halaman Depan
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Alamat email administrator wajib diisi.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi administrator wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdmin(password, email);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(result.error || 'Autentikasi gagal. Pastikan kredensial benar.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat verifikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="private-admin-login-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Top Banner Bar */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
        <button
          id="admin-login-back-to-public-btn"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-800/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center space-x-2 text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>Pintu Masuk Terisolasi &mdash; Hanya Administrator Berwenang</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-7 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/50 text-blue-400 mb-3 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Konsol Administrator</h1>
            <p className="text-xs text-slate-400 mt-1">
              Autentikasi privat sistem AA Event Maker Platform HQ
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div
              id="admin-login-error-alert"
              className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="admin-email-input">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="admin-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aa-eventmaker.my.id"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="admin-password-input">
                Kata Sandi Administrator
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-70 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Autentikasi Administrator</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Seluruh upaya akses dicatat dalam log audit keamanan. Percobaan akses tanpa hak akan diblokir oleh sistem rate-limiter terenkripsi.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 border-t border-slate-900 bg-slate-950">
        AA Event Maker Platform &bull; Security Console Core &bull; Sesi Terenkripsi
      </footer>
    </div>
  );
};
