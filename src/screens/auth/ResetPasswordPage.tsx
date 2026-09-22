import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, Check } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { AALogo } from '../../components/AALogo';
import { SeoMetadata } from '../../components/SeoMetadata';
import { useEvent } from '../../context/EventContext';

export const ResetPasswordPage: React.FC = () => {
  const { navigate, queryParams } = useRouter();
  const { showToast } = useEvent();

  const token = queryParams.token || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Token reset tidak valid atau tidak ditemukan pada tautan ini.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mengatur ulang kata sandi. Token mungkin sudah kedaluwarsa atau telah digunakan.');
      } else {
        setIsSuccess(true);
        showToast('Kata sandi berhasil diperbarui!');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal menghubungi server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="reset-password-page" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/50 flex flex-col justify-between p-4 sm:p-6">
      <SeoMetadata
        title="Atur Ulang Kata Sandi – AA Event Maker"
        description="Tetapkan kata sandi baru untuk akun AA Event Maker Anda."
        canonicalPath="/reset-password"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      {/* Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ke Halaman Masuk</span>
        </button>
        <AALogo variant="header" size="sm" onClick={() => navigate('/')} />
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Atur Ulang Kata Sandi</h1>
            <p className="text-xs text-slate-500">
              Buat kata sandi baru yang aman untuk melindungi akun AA Event Maker Anda.
            </p>
          </div>

          {!token && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col space-y-2">
              <div className="flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Token Reset Tidak Ditemukan</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Tautan yang Anda buka tidak memiliki parameter token verifikasi. Silakan minta tautan baru melalui formulir Lupa Password.
              </p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="mt-1 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs"
              >
                Kirim Permintaan Baru
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-4 text-center animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Check className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Kata Sandi Berhasil Diperbarui!</h2>
              <p className="text-xs text-slate-600">
                Kata sandi baru Anda telah aktif. Silakan masuk menggunakan kata sandi yang baru saja dibuat.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Masuk Sekarang
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    disabled={loading || !token}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden disabled:bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    disabled={loading || !token}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden disabled:bg-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{loading ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 py-3">
        © {new Date().getFullYear()} AA Event Maker. Akses Terenkripsi.
      </div>
    </div>
  );
};
