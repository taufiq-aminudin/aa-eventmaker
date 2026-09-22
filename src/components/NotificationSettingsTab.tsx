import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  ShieldCheck,
  Send,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { UserNotificationPreferences } from '../types';
import { NotificationService } from '../services/NotificationService';
import { useEvent } from '../context/EventContext';

export const NotificationSettingsTab: React.FC = () => {
  const { currentUser, showToast } = useEvent();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const [prefs, setPrefs] = useState<UserNotificationPreferences>({
    userId: currentUser?.id || 'current',
    channels: {
      inApp: true,
      email: true,
      whatsapp: false,
    },
    categories: {
      account: true,
      event: true,
      invitation: true,
      guest: true,
      rsvp: true,
      payment: true,
      subscription: true,
      security: true,
      system: true,
    },
    updatedAt: Date.now(),
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const data = await NotificationService.fetchPreferences();
        if (data) {
          setPrefs(data);
        }
      } catch (err) {
        console.warn('Failed to load notification preferences:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggleChannel = (channel: keyof UserNotificationPreferences['channels']) => {
    setPrefs((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel],
      },
    }));
  };

  const handleToggleCategory = (category: keyof UserNotificationPreferences['categories']) => {
    // Security notifications cannot be completely disabled for account safety
    if (category === 'security') {
      showToast('Pemberitahuan keamanan akun wajib selalu aktif demi perlindungan privasi.');
      return;
    }

    setPrefs((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category],
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ok = await NotificationService.updatePreferences(prefs);
      if (ok) {
        showToast('Preferensi notifikasi berhasil disimpan.');
      } else {
        showToast('Gagal menyimpan preferensi. Coba lagi.');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan preferensi.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    const targetEmail = currentUser?.email || 'user@aa-eventmaker.my.id';
    setTestSending(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: currentUser?.name || 'Pengguna AA Event Maker',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult(`✓ Email uji coba berhasil dikirim ke ${targetEmail}. Status gateway: ${data.emailLog?.status || 'SENT'}`);
        showToast('Email uji coba berhasil dikirim! Silakan periksa kotak masuk Anda.');
      } else {
        setTestResult(`Gagal mengirim email uji coba: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setTestResult(`Error: ${err.message || 'Koneksi gagal'}`);
    } finally {
      setTestSending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Memuat preferensi notifikasi...</p>
      </div>
    );
  }

  return (
    <div id="notification-settings-panel" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Sistem Notifikasi Terpusat</span>
          </div>
          <h2 className="text-xl font-extrabold">Preferensi Notifikasi & Email</h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Tentukan saluran dan jenis pemberitahuan yang ingin Anda terima untuk setiap aktivitas penting acara, konfirmasi RSVP, dan status pembayaran.
          </p>
        </div>

        <button
          onClick={handleSendTestEmail}
          disabled={testSending}
          className="shrink-0 flex items-center space-x-2 px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {testSending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-blue-600" />
          )}
          <span>{testSending ? 'Mengirim...' : 'Kirim Email Uji Coba'}</span>
        </button>
      </div>

      {testResult && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="font-semibold">{testResult}</p>
        </div>
      )}

      {/* Saluran Notifikasi (Channels) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <span>1. Saluran Pengiriman Utama</span>
        </h3>
        <p className="text-xs text-slate-500">
          Pilih di mana Anda ingin menerima notifikasi sistem dari AA Event Maker:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* In-App */}
          <div
            onClick={() => handleToggleChannel('inApp')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              prefs.channels.inApp
                ? 'border-blue-600 bg-blue-50/30'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.channels.inApp
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {prefs.channels.inApp && <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">In-App Notification</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pemberitahuan langsung di dalam aplikasi melalui lonceng header dan pop-up interaktif.
              </p>
            </div>
          </div>

          {/* Email */}
          <div
            onClick={() => handleToggleChannel('email')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              prefs.channels.email
                ? 'border-blue-600 bg-blue-50/30'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.channels.email
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {prefs.channels.email && <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Email Branded Resmi</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Kirim pesan HTML profesional ke <strong>{currentUser?.email || 'email Anda'}</strong>.
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div
            onClick={() => handleToggleChannel('whatsapp')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              prefs.channels.whatsapp
                ? 'border-blue-600 bg-blue-50/30'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.channels.whatsapp
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {prefs.channels.whatsapp && <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-bold text-slate-900">WhatsApp Alert</h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-green-100 text-green-800">
                  Resmi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tautan instan dan notifikasi WhatsApp untuk respons RSVP dan check-in resepsionis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Notifikasi (Categories) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <span>2. Jenis & Kategori Notifikasi</span>
        </h3>
        <p className="text-xs text-slate-500">
          Aktifkan atau nonaktifkan notifikasi spesifik sesuai preferensi Anda:
        </p>

        <div className="divide-y divide-slate-100">
          {[
            {
              id: 'security' as const,
              title: 'Keamanan Akun & Sesi Masuk',
              desc: 'Peringatan login baru, perubahan kata sandi, dan token verifikasi (Wajib Aktif)',
              mandatory: true,
            },
            {
              id: 'rsvp' as const,
              title: 'Konfirmasi RSVP Tamu Undangan',
              desc: 'Dapatkan pemberitahuan seketika saat tamu merespons kehadiran dan memberikan ucapan',
            },
            {
              id: 'payment' as const,
              title: 'Status Pembayaran & Tagihan Paket',
              desc: 'Konfirmasi bukti transfer, status persetujuan pembayaran oleh admin, dan invoice',
            },
            {
              id: 'invitation' as const,
              title: 'Siklus Undangan Digital (Live & Update)',
              desc: 'Konfirmasi saat undangan berhasil dibuat, diterbitkan ke publik, atau diperbarui',
            },
            {
              id: 'guest' as const,
              title: 'Buku Tamu & Check-In Resepsionis',
              desc: 'Ringkasan impor data tamu undangan dan check-in QR pass pada hari H',
            },
            {
              id: 'subscription' as const,
              title: 'Langganan & Pengingat Masa Aktif Paket',
              desc: 'Notifikasi peningkatan paket (upgrade) dan pengingat kedaluwarsa 7 hari sebelumnya',
            },
            {
              id: 'system' as const,
              title: 'Pengumuman Sistem & Pembaruan Fitur',
              desc: 'Informasi pembaruan platform, fitur baru AI, dan jadwal pemeliharaan server',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex items-center justify-between gap-4"
            >
              <div className="max-w-xl">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  {item.mandatory && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700">
                      Keamanan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={prefs.categories[item.id]}
                  disabled={item.mandatory}
                  onChange={() => handleToggleCategory(item.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Terakhir diperbarui: {new Date(prefs.updatedAt || Date.now()).toLocaleString('id-ID')}
          </p>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Preferensi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
