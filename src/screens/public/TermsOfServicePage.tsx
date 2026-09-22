import React from 'react';
import { FileText, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';
import { useRouter } from '../../context/RouterContext';

export const TermsOfServicePage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Ketentuan Layanan – AA Event Maker"
        description="Syarat dan ketentuan penggunaan layanan platform undangan digital dan manajemen tamu AA Event Maker."
        canonicalPath="/terms"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-100">
              <FileText className="w-3.5 h-3.5" />
              <span>Syarat & Ketentuan Penggunaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ketentuan Layanan AA Event Maker
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Berlaku efektif sejak: 1 Januari 2026 • Dokumen Legal Platform
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>1. Penerimaan Ketentuan</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dengan mengakses dan menggunakan platform AA Event Maker (melalui web resmi maupun aplikasi PWA), Anda menyetujui untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak menyetujui salah satu poin dalam ketentuan ini, Anda disarankan untuk tidak melanjutkan penggunaan layanan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>2. Penggunaan Akun & Layanan Undangan</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pengguna bertanggung jawab menjaga kerahasiaan kata sandi akun masing-masing. Seluruh materi konten undangan digital—termasuk foto pasangan, video, teks sambutan, dan musik pengiring—wajib mematuhi hukum yang berlaku di Republik Indonesia serta tidak mengandung unsur SARA atau konten ilegal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>3. Paket Langganan & Kebijakan Pembayaran</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paket Starter disediakan secara gratis tanpa batas waktu. Pembayaran untuk paket Wedding Professional dan EO &amp; Agency dilakukan melalui transfer resmi ke Bank Mandiri atau akun DANA atas nama Taufiq Aminudin. Verifikasi aktivasi paket diproses oleh tim kami maksimal 1x24 jam setelah bukti konfirmasi diunggah.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>4. Batasan Tanggung Jawab</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              AA Event Maker menjamin keandalan uptime server dan kelancaran check-in tamu QR. Kami tidak bertanggung jawab atas gangguan konektivitas jaringan seluler pengguna di lokasi acara atau kesalahan input nomor rekening pembayaran oleh pengguna.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>5. Bantuan & Kontak Layanan</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pertanyaan seputar ketentuan layanan atau permohonan kerja sama agency dapat disampaikan langsung ke tim customer service melalui halaman Hubungi Kami atau kontak WhatsApp resmi AA Event Maker.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
