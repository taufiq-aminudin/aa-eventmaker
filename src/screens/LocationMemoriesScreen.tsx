import React, { useState } from 'react';
import { MapPin, Plus, ExternalLink, MessageSquare, Heart, Clock, Send } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export const LocationMemoriesScreen: React.FC = () => {
  const { locations, addLocation, memories, addMemory } = useEvent();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locName, setLocName] = useState('');
  const [locType, setLocType] = useState('Akad Nikah');
  const [locAddress, setLocAddress] = useState('');
  const [locTime, setLocTime] = useState('');
  const [locMapUrl, setLocMapUrl] = useState('');

  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName.trim()) return;
    addLocation(locName, locType, locAddress, locTime, locMapUrl);
    setShowLocationModal(false);
    setLocName('');
    setLocAddress('');
    setLocTime('');
    setLocMapUrl('');
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) return;
    addMemory(guestName, message);
    setGuestName('');
    setMessage('');
  };

  return (
    <div id="location-memories-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900">Lokasi Venue & Buku Tamu / Memori</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Petunjuk rute Google Maps gedung dan arsip doa restu serta pesan dari para sahabat.
          </p>
        </div>

        <button
          onClick={() => setShowLocationModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lokasi Acara</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Locations List (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Rangkaian Tempat Acara ({locations.length})
          </h2>

          <div className="space-y-3">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {loc.type}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{loc.time}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{loc.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{loc.address}</p>
                </div>

                <a
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors w-full justify-center"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Wishes & Memories Wall (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Buku Tamu Digital & Doa ({memories.length})
          </h2>

          {/* New Memory Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-pink-500" />
              <span>Tuliskan Ucapan / Doa Baru</span>
            </h3>

            <form onSubmit={handleAddMemory} className="space-y-2.5">
              <input
                type="text"
                placeholder="Nama Pengirim (Contoh: dr. Siti & Rekan)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              />
              <textarea
                rows={2}
                placeholder="Tuliskan ucapan selamat atau doa..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan ke Buku Tamu</span>
              </button>
            </form>
          </div>

          {/* Memories Stream */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                    <span>{mem.guestName}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{mem.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{mem.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD LOCATION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Lokasi Acara</h3>
            <p className="text-xs text-slate-500 mb-4">
              Cantumkan alamat gedung dan tautan Google Maps untuk navigasi tamu.
            </p>

            <form onSubmit={handleAddLocation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Gedung / Lokasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Plataran Dharmawangsa"
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Rangkaian
                  </label>
                  <input
                    type="text"
                    placeholder="Akad Nikah / Resepsi"
                    value={locType}
                    onChange={(e) => setLocType(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu Acara
                  </label>
                  <input
                    type="text"
                    placeholder="10:00 - 14:00 WIB"
                    value={locTime}
                    onChange={(e) => setLocTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. Dharmawangsa Raya No. 6, Kebayoran Baru, Jakarta Selatan"
                  value={locAddress}
                  onChange={(e) => setLocAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tautan Google Maps (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/..."
                  value={locMapUrl}
                  onChange={(e) => setLocMapUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
