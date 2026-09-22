import React from 'react';
import { useEvent } from '../context/EventContext';
import { useRouter, Link } from '../context/RouterContext';
import { AALogo } from './AALogo';
import { Heart, Sparkles, Shield, Smartphone, QrCode } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <AALogo variant="header" size="sm" className="text-white" onClick={() => navigate('/')} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Platform undangan digital interaktif dan sistem manajemen tamu terpadu No. 1.
              Hadirkan keanggunan seni visual, musik sinematik, RSVP real-time, dan check-in QR cepat untuk perayaan istimewa Anda.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privasi Terlindungi</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>PWA Offline Ready</span>
              </span>
            </div>
          </div>

          {/* Navigation Col: Produk */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Produk & Layanan
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/templates" className="hover:text-white transition-colors">
                  Koleksi Template
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Fitur Unggulan
                </Link>
              </li>
              <li>
                <Link to="/guest-pass" className="hover:text-white transition-colors">
                  Cek E-Pass & QR Tamu
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Paket & Biaya
                </Link>
              </li>
              <li>
                <Link to="/payment" className="hover:text-white transition-colors">
                  Metode Pembayaran & Konfirmasi
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-amber-400 transition-colors font-semibold">
                  Buat Undangan Baru ➔
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col: Perusahaan & Informasi */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Informasi
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Tentang AA Event Maker
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Pusat Bantuan & FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Ketentuan Layanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support & Community */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Bantuan Cepat
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Butuh panduan atau kustomisasi khusus acara pernikahan dan perusahaan Anda?
            </p>
            <div className="pt-1">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                <span>Kontak & WhatsApp ➔</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} AA Event Maker. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span>Domain Resmi: https://aa-eventmaker.my.id/</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
