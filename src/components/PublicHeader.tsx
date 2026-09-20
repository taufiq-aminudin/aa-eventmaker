import React, { useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  LogIn,
  LayoutGrid,
  Zap,
  QrCode,
  CreditCard,
  Info,
  HelpCircle,
  Phone,
  Plus,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { useRouter, Link } from '../context/RouterContext';
import { AALogo } from './AALogo';
import { PWAInstallButton } from './PWAInstallButton';

export const PublicHeader: React.FC = () => {
  const { currentUser } = useEvent();
  const { currentPath, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Koleksi Template', href: '/templates', icon: LayoutGrid },
    { label: 'Fitur Unggulan', href: '/features', icon: Zap },
    { label: 'Cek E-Pass Tamu', href: '/guest-pass', icon: QrCode },
    { label: 'Paket Harga', href: '/pricing', icon: CreditCard },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <AALogo
          variant="header"
          size="sm"
          onClick={() => navigate('/')}
        />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600">
          {navLinks.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-blue-600 font-extrabold border-b-2 border-blue-600'
                    : 'hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <PWAInstallButton variant="navbar" />

          {currentUser ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Dasbor Saya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Masuk</span>
              </Link>

              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Buat Undangan</span>
              </button>
            </>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2">
            Menu Utama
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Informasi Lainnya
            </div>
            <button
              onClick={() => handleNavClick('/about')}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>Tentang AA Event Maker</span>
            </button>
            <button
              onClick={() => handleNavClick('/help')}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Pusat Bantuan & FAQ</span>
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Phone className="w-4 h-4 text-slate-400" />
              <span>Hubungi Kami</span>
            </button>
          </div>

          {!currentUser && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('/login')}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Masuk ke Akun</span>
              </button>
              <button
                onClick={() => handleNavClick('/create')}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Undangan Baru</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
