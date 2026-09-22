import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { AALogo } from '../../components/AALogo';
import { SeoMetadata } from '../../components/SeoMetadata';
import { useEvent } from '../../context/EventContext';

export const ForgotPasswordPage: React.FC = () => {
  const { navigate } = useRouter();
  const { showToast } = useEvent();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; resetToken?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Mohon masukkan alamat email yang valid.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal memproses permintaan reset kata sandi.');
      } else {
        setSuccessInfo({
          message: data.message || 'Instruksi reset kata sandi telah dikirim ke email Anda jika terdaftar.',
          resetToken: data.resetToken,
        });
        showToast('Tautan reset kata sandi telah dikirim.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal menghubungi server. Silakan periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="forgot-password-page" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/50 flex flex-col justify-between p-4 sm:p-6">
      <SeoMetadata
        title="Lupa Kata Sandi – AA Event Maker"
        description="Reset kata sandi akun AA Event Maker Anda dengan aman melalui email terdaftar."
        canonicalPath="/forgot-password"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Masuk</span>
        </button>
        <AALogo variant="header" size="sm" onClick={() => navigate('/')} />
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Lupa Kata Sandi?</h1>
            <p className="text-xs text-slate-500">
              Masukkan alamat email terdaftar Anda. Kami akan mengirimkan tautan aman satu kali untuk membuat kata sandi baru.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permintaan Reset Diterima</span>
                </div>
                <p className="text-emerald-700 leading-relaxed">
                  {successInfo.message}
                </p>
              </div>

              {/* Direct reset link for test preview environment */}
              {successInfo.resetToken && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-2.5">
                  <div className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Tautan Reset Cepat (Uji Langsung):</span>
                  </div>
                  <p className="text-[11px] text-blue-700">
                    Token reset aktif (kedaluwarsa dalam 15 menit & sekali pakai). Klik tombol di bawah untuk langsung menuju formulir pembuatan kata sandi baru:
                  </p>
                  <button
                    onClick={() => navigate(`/reset-password?token=${successInfo.resetToken}`)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Lanjutkan Reset Kata Sandi Sekarang &rarr;</span>
                  </button>
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sudah ingat kata sandi? Masuk di sini
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Email Akun</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden disabled:bg-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? 'Memproses Permintaan...' : 'Kirim Tautan Reset'}</span>
              </button>

              <div className="pt-2 text-center">
                <span className="text-slate-500">Ingat kata sandi Anda? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-400 py-3">
        © {new Date().getFullYear()} AA Event Maker. Aman & Terlindungi.
      </div>
    </div>
  );
};
