import React, { useState } from 'react';
import {
  FolderPlus,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { useRouter } from '../../context/RouterContext';
import { EventProject } from '../../types';

export const ProjectsPage: React.FC = () => {
  const {
    projects,
    currentProject,
    selectProject,
    createProject,
    guests,
    showToast,
  } = useEvent();
  const { navigate } = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectType, setNewProjectType] = useState<'Wedding' | 'Corporate' | 'Birthday' | 'Baby Shower' | 'Graduation' | 'Custom Event'>('Wedding');
  const [newProjectDate, setNewProjectDate] = useState('2026-11-20');
  const [newProjectVenue, setNewProjectVenue] = useState('Grand Ballroom Jakarta');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) {
      showToast('Mohon masukkan nama proyek acara.');
      return;
    }

    createProject(
      newProjectTitle,
      newProjectType,
      newProjectDate,
      '10:00 - 15:00 WIB',
      newProjectVenue
    );

    setShowCreateModal(false);
    setNewProjectTitle('');
    showToast(`Proyek "${newProjectTitle}" berhasil dibuat!`);
  };

  return (
    <div id="projects-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manajemen Multi-Acara</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Daftar Proyek Acara</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola seluruh pernikahan, syukuran, dan event Anda dalam satu dasbor terpadu.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Buat Proyek Acara Baru</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <FolderPlus className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Belum Ada Proyek Acara</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Akun Anda belum memiliki proyek acara aktif. Klik tombol di bawah untuk membuat undangan pernikahan atau acara pertama Anda.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center space-x-2 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Buat Proyek Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const isActive = currentProject.id === proj.id;
            return (
              <div
                key={proj.id}
                className={`rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-2 border-blue-600 shadow-lg ring-4 ring-blue-50'
                    : 'bg-white border border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isActive ? '✓ Acara Aktif' : proj.type}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      ID: {proj.id.slice(0, 8)}
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-slate-900 leading-snug">{proj.name}</h2>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{proj.date || 'Belum diatur'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{proj.location || 'Lokasi Venue'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{guests.filter((g) => g.projectId === proj.id).length} Tamu Terdaftar</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  {!isActive ? (
                    <button
                      onClick={() => {
                        selectProject(proj);
                        showToast(`Beralih ke proyek: ${proj.name}`);
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Pilih & Jadikan Aktif
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate('/editor')}
                        className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Undangan</span>
                      </button>
                      <button
                        onClick={() => navigate('/guests')}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Data Tamu</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Buat Proyek */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Buat Proyek Acara Baru</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Proyek / Acara *</label>
                <input
                  type="text"
                  required
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Contoh: Pernikahan Andi & Ayu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Acara</label>
                  <select
                    value={newProjectType}
                    onChange={(e) => setNewProjectType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    <option value="Wedding">Pernikahan</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Ulang Tahun</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Acara</label>
                  <input
                    type="date"
                    value={newProjectDate}
                    onChange={(e) => setNewProjectDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi / Venue</label>
                <input
                  type="text"
                  value={newProjectVenue}
                  onChange={(e) => setNewProjectVenue(e.target.value)}
                  placeholder="Contoh: Plataran Dharmawangsa Jakarta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
