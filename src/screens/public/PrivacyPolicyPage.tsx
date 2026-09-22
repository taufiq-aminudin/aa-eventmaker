import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';
import { useRouter } from '../../context/RouterContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Kebijakan Privasi – AA Event Maker"
        description="Kebijakan privasi dan perlindungan data pribadi serta informasi tamu di platform AA Event Maker."
        canonicalPath="/privacy"
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
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-100">
              <Shield className="w-3.5 h-3.5" />
              <span>Privasi Terjamin & Terenkripsi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kebijakan Privasi AA Event Maker
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>1. Komitmen Perlindungan Data</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              AA Event Maker berkomitmen penuh untuk melindungi privasi data pribadi pengguna terdaftar, calon pengantin, penyelenggara acara (EO/WO), dan seluruh tamu undangan yang terdata di sistem kami. Kami tidak pernah memperjualbelikan data kontak, nomor WhatsApp, ataupun daftar tamu kepada pihak ketiga mana pun.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>2. Informasi yang Kami Kumpulkan</span>
            </h2>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 leading-relaxed">
              <li><strong>Data Akun:</strong> Nama, alamat email, nomor telepon/WhatsApp, dan peran pengguna untuk kebutuhan otentikasi serta administrasi.</li>
              <li><strong>Data Acara & Undangan:</strong> Nama pasangan, tanggal acara, lokasi seremoni dan resepsi, galeri foto, serta preferensi musik latar.</li>
              <li><strong>Data Tamu:</strong> Nama tamu, nomor telepon, status RSVP (hadir/tidak hadir), ucapan/doa restu, dan riwayat check-in QR Code.</li>
              <li><strong>Data Bukti Transfer:</strong> Foto struk transfer dan nomor referensi perbankan yang hanya diproses secara aman untuk verifikasi paket langganan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>3. Keamanan & Hak Akses Data Tamu</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Data buku tamu dan E-Pass QR hanya dapat diakses oleh penyelenggara acara yang sah dan tamu undangan yang bersangkutan melalui tautan undangan privat. Akses administrator platform dilindungi oleh sistem otorisasi berlapis dan hanya digunakan untuk keperluan teknis serta verifikasi transaksi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>4. Hak Pengguna & Penghapusan Data</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda berhak memperbarui, mengekspor (dalam format Excel atau PDF), atau meminta penghapusan menyeluruh atas data proyek acara dan daftar tamu kapan saja melalui menu pengaturan akun atau dengan menghubungi tim dukungan resmi kami.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
