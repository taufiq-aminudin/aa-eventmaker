import React from 'react';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Leaf,
  Globe2,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  const values = [
    {
      icon: Heart,
      color: 'text-rose-600 bg-rose-50',
      title: 'Pelestarian Budaya Nusantara',
      description:
        'Kami mendokumentasikan dan memvisualisasikan keanggunan ornamen adat Jawa, Sunda, Bali, Minang, dan tradisi nusantara ke dalam medium digital kontemporer bernilai seni tinggi.',
    },
    {
      icon: Leaf,
      color: 'text-emerald-600 bg-emerald-50',
      title: 'Ramah Lingkungan & Zero Waste',
      description:
        'Menggantikan ribuan cetak kertas undangan konvensional dengan undangan digital interaktif yang lebih hemat, cepat tersebar, dan menjaga kelestarian bumi.',
    },
    {
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50',
      title: 'Keamanan Data & Privasi Terjaga',
      description:
        'Informasi daftar tamu, kontak keluarga, dan catatan kehadiran Anda dienkripsi dengan standar industri tanpa pernah dibagikan kepada pihak ketiga manapun.',
    },
    {
      icon: Globe2,
      color: 'text-purple-600 bg-purple-50',
      title: 'Aksesibilitas Seluruh Tamu',
      description:
        'Dioptimalkan agar ringan dibuka di semua jenis gawai dan peramban ponsel, dari kota metropolitan hingga pelosok daerah dengan loading super cepat.',
    },
  ];

  const targetAudiences = [
    {
      role: 'Calon Pengantin',
      description: 'Ingin pernikahan penuh estetika personal, kepastian kehadiran tamu real-time, dan penyambutan VIP tanpa antrean.',
    },
    {
      role: 'Wedding & Event Organizer',
      description: 'Memerlukan manajemen multi-acara profesional, rekap data kehadiran, scanner QR cepat, dan portal kerja vendor terpadu.',
    },
    {
      role: 'Perusahaan & Lembaga',
      description: 'Menyelenggarakan gala dinner, seminar nasional, atau gathering tahunan dengan tiket E-Pass resmi dan validasi ketat.',
    },
  ];

  return (
    <div id="about-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Tentang AA Event Maker – Platform Undangan & Manajemen Acara"
        description="Pelajari visi, misi, dan nilai-nilai AA Event Maker dalam memadukan estetika seni budaya dan teknologi digital modern untuk momen berharga Anda."
        canonicalPath="/about"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Visi & Komitmen Kami</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Tentang AA Event Maker
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
              AA Event Maker lahir dari satu keyakinan sederhana: bahwa setiap awal perjalanan cinta dan momen perayaan berharga layak disambut dengan keanggunan, ketelitian, dan kenyamanan tanpa beban kerumitan teknis.
            </p>
          </div>

          {/* Mission Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm mb-14 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Misi Kami
            </div>
            <blockquote className="text-xl sm:text-2xl font-serif font-bold text-slate-900 max-w-3xl mx-auto leading-relaxed">
              &ldquo;Memberdayakan setiap pasangan dan penyelenggara acara dengan teknologi undangan digital terintegrasi yang memadukan kekayaan estetika budaya dan kemudahan manajemen tamu modern.&rdquo;
            </blockquote>
          </div>

          {/* Core Values */}
          <div className="space-y-6 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Nilai & Fondasi Kami</h2>
              <p className="text-xs text-slate-500 mt-1">Prinsip yang membimbing setiap fitur yang kami bangun.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${v.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* For Whom */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-12">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-black">Solusi yang Dirancang untuk Anda</h2>
              <p className="text-xs text-slate-400 mt-1">
                Dari acara personal hingga manajemen acara berskala besar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {targetAudiences.map((aud) => (
                <div key={aud.role} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                  <h3 className="text-base font-bold text-amber-400">{aud.role}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{aud.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center pt-4 border-t border-slate-800">
              <button
                onClick={() => navigate('/create')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Mulai Buat Undangan Bersama Kami ➔
              </button>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
