import React, { useState } from 'react';
import {
  Home,
  Mail,
  Users,
  CheckSquare,
  Wallet,
  Sparkles,
  MapPin,
  QrCode,
  Eye,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { EventType } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentProject,
    projects,
    selectProject,
    createProject,
    setShowPublicPreview,
    setShowQrCheckinModal,
  } = useEvent();

  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<EventType>('Wedding');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const navItems = [
    { id: 0, label: 'Home', icon: Home },
    { id: 1, label: 'Undangan', icon: Mail },
    { id: 2, label: 'Tamu', icon: Users },
    { id: 3, label: 'Planner', icon: CheckSquare },
    { id: 4, label: 'Budget', icon: Wallet },
    { id: 5, label: 'Studio', icon: Sparkles },
    { id: 6, label: 'Lokasi & Memori', icon: MapPin },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createProject(
      newName,
      newType,
      newDate || 'Tanggal Belum Ditentukan',
      newTime || '10:00 - 15:00 WIB',
      newLocation || 'Jakarta'
    );
    setShowNewProjectModal(false);
    setNewName('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
  };

  return (
    <>
      <header
        id="app-header"
        className="sticky top-0 z-40 bg-white border-b border-[#e4e7ec] shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Project Selector */}
            <div className="flex items-center space-x-3">
              <div
                id="brand-logo"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6d28d9] to-[#ec4899] text-white font-black text-lg shadow-sm cursor-pointer"
                onClick={() => setActiveTab(0)}
              >
                AA
              </div>

              <div className="relative">
                <button
                  id="project-selector-btn"
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="flex items-center space-x-2 text-left px-2 py-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#6d28d9]">
                        EVENT MAKER
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-sm font-semibold text-slate-900 max-w-[200px] sm:max-w-[320px] truncate">
                      {currentProject.name}
                    </div>
                  </div>
                </button>

                {showProjectMenu && (
                  <div
                    id="project-menu-dropdown"
                    className="absolute left-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95"
                  >
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Daftar Proyek Acara
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {projects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => {
                            selectProject(proj);
                            setShowProjectMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm flex flex-col hover:bg-slate-50 transition-colors ${
                            proj.id === currentProject.id
                              ? 'bg-purple-50 text-[#6d28d9] font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          <span className="truncate">{proj.name}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            {proj.type} • {proj.date}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          setShowProjectMenu(false);
                          setShowNewProjectModal(true);
                        }}
                        className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-[#6d28d9] bg-purple-50 hover:bg-purple-100 py-2 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Buat Acara Baru</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav
              id="desktop-nav"
              aria-label="Navigasi Utama"
              className="hidden md:flex items-center space-x-1"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-50 text-[#6d28d9]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-[#6d28d9]' : 'text-slate-400'}`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Header Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                id="btn-quick-qr-scanner"
                onClick={() => setShowQrCheckinModal(true)}
                title="Buka QR Scanner Tamu"
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#6d28d9]" />
                <span className="hidden sm:inline">Check-In QR</span>
              </button>

              <button
                id="btn-quick-preview-invitation"
                onClick={() => setShowPublicPreview(true)}
                title="Lihat Undangan Publik"
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#6d28d9] to-[#ec4899] hover:opacity-95 rounded-lg shadow-xs transition-opacity"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Undangan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex overflow-x-auto border-t border-slate-100 px-2 py-1.5 no-scrollbar bg-slate-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-[#6d28d9] font-bold shadow-xs border border-purple-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#6d28d9]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Buat Acara Baru</h3>
            <p className="text-xs text-slate-500 mb-4">
              Mulai manajemen persiapan, undangan digital, dan buku tamu untuk acara baru Anda.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Acara / Pasangan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian & Nabila Wedding Celebration"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Acara
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EventType)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                >
                  <option value="Wedding">Pernikahan (Wedding)</option>
                  <option value="Birthday">Ulang Tahun (Birthday)</option>
                  <option value="Corporate">Korporat & Seminar (Corporate)</option>
                  <option value="Baby Shower">Akikah / Baby Shower</option>
                  <option value="Graduation">Wisuda / Kelulusan (Graduation)</option>
                  <option value="Custom Event">Acara Lainnya (Custom)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Acara
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 12 Des 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    placeholder="10:00 - 14:00 WIB"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi / Venue
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Hotel Mulia Senayan, Jakarta"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] rounded-lg shadow-xs"
                >
                  Simpan & Mulai Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
