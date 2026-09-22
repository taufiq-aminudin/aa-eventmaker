import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  Send,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Shield,
  Eye,
  RotateCw,
  Settings,
  Sparkles,
  Smartphone,
  ChevronRight,
  Server,
  Radio,
  FileText,
  UserCheck,
  Check,
  X,
} from 'lucide-react';
import { EmailDeliveryLog, NotificationCategory } from '../../types';
import { NotificationService } from '../../services/NotificationService';
import { useEvent } from '../../context/EventContext';

export const AdminNotificationSuite: React.FC = () => {
  const { showToast } = useEvent();

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'config' | 'broadcast'>('logs');

  // Logs & Stats State
  const [logs, setLogs] = useState<EmailDeliveryLog[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    sent: 0,
    failed: 0,
    retrying: 0,
    deliveryRate: '100%',
  });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Log for Inspection
  const [inspectLog, setInspectLog] = useState<EmailDeliveryLog | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Email Config State
  const [emailConfig, setEmailConfig] = useState<any>(null);
  const [configSaving, setConfigSaving] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);

  // Broadcast Announcement State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastChannels, setBroadcastChannels] = useState<string[]>(['IN_APP', 'EMAIL']);
  const [broadcastAudience, setBroadcastAudience] = useState<'ALL' | 'ORGANIZER' | 'CLIENT' | 'GUEST'>('ALL');
  const [broadcastSending, setBroadcastSending] = useState(false);

  const fetchLogsAndStats = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'ALL') q.set('status', statusFilter);
      if (categoryFilter !== 'ALL') q.set('category', categoryFilter);
      if (searchQuery.trim()) q.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/notifications/logs?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }

      const statsRes = await fetch('/api/admin/notifications/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
    } catch (err) {
      console.warn('Failed to load notification logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailConfig = async () => {
    try {
      const res = await fetch('/api/admin/email-config');
      if (res.ok) {
        const data = await res.json();
        setEmailConfig(data.config);
      }
    } catch (err) {
      console.warn('Failed to load email config:', err);
    }
  };

  useEffect(() => {
    fetchLogsAndStats();
    fetchEmailConfig();
  }, [statusFilter, categoryFilter]);

  const handleResend = async (logId: string) => {
    setResendingId(logId);
    try {
      const res = await fetch(`/api/admin/notifications/resend/${logId}`, {
        method: 'POST',
      });
      if (res.ok) {
        showToast('Email dijadwalkan ulang untuk pengiriman segera.');
        fetchLogsAndStats();
      } else {
        showToast('Gagal mengirim ulang email.');
      }
    } catch {
      showToast('Koneksi gagal saat mengirim ulang email.');
    } finally {
      setResendingId(null);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailConfig) return;
    setConfigSaving(true);
    try {
      const res = await fetch('/api/admin/email-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig),
      });
      if (res.ok) {
        showToast('Konfigurasi Gateway Email berhasil disimpan.');
      } else {
        showToast('Gagal menyimpan konfigurasi email.');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan.');
    } finally {
      setConfigSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailInput.trim()) {
      showToast('Masukkan alamat email tujuan uji coba.');
      return;
    }
    setTestSending(true);
    setTestMessage(null);
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmailInput.trim(),
          name: 'Administrator AA Event Maker',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestMessage(`✓ ${data.message}`);
        showToast('Email diagnostik berhasil dikirim.');
        fetchLogsAndStats();
      } else {
        setTestMessage(`Gagal: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setTestMessage(`Error: ${err.message || 'Koneksi gagal'}`);
    } finally {
      setTestSending(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('Judul dan pesan pengumuman wajib diisi.');
      return;
    }

    setBroadcastSending(true);
    try {
      const res = await fetch('/api/admin/announcements/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          message: broadcastMessage.trim(),
          channels: broadcastChannels,
          targetAudience: broadcastAudience,
        }),
      });

      if (res.ok) {
        showToast('Pengumuman sistem berhasil disiarkan ke seluruh audiens sasaran.');
        setBroadcastTitle('');
        setBroadcastMessage('');
        setActiveSubTab('logs');
        fetchLogsAndStats();
      } else {
        showToast('Gagal menyiarkan pengumuman.');
      }
    } catch {
      showToast('Koneksi gagal saat menyiarkan pengumuman.');
    } finally {
      setBroadcastSending(false);
    }
  };

  const getStatusBadge = (status: EmailDeliveryLog['status']) => {
    const s = String(status || '').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Terkirim</span>
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Check className="w-3 h-3" />
            <span>Terkirim (SMTP)</span>
          </span>
        );
      case 'QUEUED':
      case 'PROCESSING':
      case 'RETRYING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
            <RotateCw className="w-3 h-3 animate-spin" />
            <span>Mengantri</span>
          </span>
        );
      case 'FAILED':
      case 'BOUNCED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>Gagal</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div id="admin-notification-suite" className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
            <Server className="w-3.5 h-3.5" />
            <span>Gateway Terpusat AA Event Maker</span>
          </div>
          <h1 className="text-2xl font-black text-white">Manajemen Email & Notifikasi</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pantau log pengiriman email transaksional, diagnostik gateway SMTP/API, dan siaran pengumuman ke seluruh pengguna.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'logs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Log Pengiriman</span>
          </button>
          <button
            onClick={() => setActiveSubTab('broadcast')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'broadcast'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Siaran Pengumuman</span>
          </button>
          <button
            onClick={() => setActiveSubTab('config')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'config'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Konfigurasi SMTP</span>
          </button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Terkirim</div>
          <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <Mail className="w-3 h-3 text-blue-400" />
            <span>Transaksional & Sistem</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Keberhasilan</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats.deliveryRate}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Delivered via Gateway</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Berhasil Terkirim</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{stats.sent + stats.delivered}</div>
          <div className="text-[11px] text-slate-500 mt-1">Diterima server tujuan</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gagal / Bounce</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{stats.failed}</div>
          <div className="text-[11px] text-slate-500 mt-1">Dapat dikirim ulang</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mengantri / Coba Ulang</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats.retrying}</div>
          <div className="text-[11px] text-slate-500 mt-1">Backoff worker otomatis</div>
        </div>
      </div>

      {/* SubTab 1: LOGS VIEW */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLogsAndStats()}
                placeholder="Cari email penerima, subjek, atau ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden"
              >
                <option value="ALL">Semua Status</option>
                <option value="DELIVERED">Terkirim (Delivered)</option>
                <option value="SENT">Terkirim (Sent)</option>
                <option value="FAILED">Gagal (Failed)</option>
                <option value="RETRYING">Mengantri (Retrying)</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="ACCOUNT">Akun & Auth</option>
                <option value="EVENT">Acara & Undangan</option>
                <option value="PAYMENT">Pembayaran & Paket</option>
                <option value="RSVP">RSVP & Tamu</option>
                <option value="SECURITY">Keamanan</option>
                <option value="SYSTEM">Sistem & Pengumuman</option>
              </select>

              <button
                onClick={fetchLogsAndStats}
                disabled={loading}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Delivery Logs Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Penerima & Email</th>
                    <th className="py-3 px-4">Subjek / Judul</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Percobaan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {loading && logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
                        <span>Memuat log pengiriman email...</span>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        Tidak ada log pengiriman yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                          {new Date(log.createdAt).toLocaleString('id-ID', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{log.recipientName || 'Pengguna'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{log.recipient}</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-slate-200 truncate">{log.subject}</div>
                          {log.errorMessage && (
                            <div className="text-[10px] text-rose-400 truncate mt-0.5 font-mono">
                              Err: {log.errorMessage}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {log.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                          {log.attempts} / {log.maxAttempts}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                          <button
                            onClick={() => setInspectLog(log)}
                            title="Lihat Detail Log & Pratinjau Email"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {String(log.status).toLowerCase() === 'failed' && (
                            <button
                              onClick={() => handleResend(log.id)}
                              disabled={resendingId === log.id}
                              title="Kirim Ulang Email"
                              className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <RotateCw className={`w-3.5 h-3.5 ${resendingId === log.id ? 'animate-spin' : ''}`} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: BROADCAST SYSTEM ANNOUNCEMENT */}
      {activeSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <Radio className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Siaran Pengumuman Sistem</h2>
            </div>
            <p className="text-xs text-slate-400">
              Kirimkan pengumuman serentak ke seluruh pengguna atau audiens spesifik melalui saluran In-App notification dan Email.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4 pt-2 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Judul Pengumuman <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="Contoh: Pembaruan Fitur Baru AI & Jadwal Pemeliharaan Server"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Isi Pesan Pengumuman <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={5}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Tuliskan pesan pengumuman lengkap di sini..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Audiens Sasaran
                  </label>
                  <select
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                  >
                    <option value="ALL">Semua Pengguna Terdaftar</option>
                    <option value="ORGANIZER">Hanya Penyelenggara (EO / WO)</option>
                    <option value="CLIENT">Hanya Klien / Calon Pengantin</option>
                    <option value="GUEST">Hanya Tamu Undangan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Saluran Pengiriman
                  </label>
                  <div className="flex items-center space-x-3 pt-2">
                    <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={broadcastChannels.includes('IN_APP')}
                        onChange={(e) => {
                          setBroadcastChannels((prev) =>
                            e.target.checked ? [...prev, 'IN_APP'] : prev.filter((c) => c !== 'IN_APP')
                          );
                        }}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600"
                      />
                      <span>In-App</span>
                    </label>

                    <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={broadcastChannels.includes('EMAIL')}
                        onChange={(e) => {
                          setBroadcastChannels((prev) =>
                            e.target.checked ? [...prev, 'EMAIL'] : prev.filter((c) => c !== 'EMAIL')
                          );
                        }}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600"
                      />
                      <span>Email Resmi</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={broadcastSending}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {broadcastSending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{broadcastSending ? 'Menyiarkan...' : 'Siarkan Pengumuman Sekarang'}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Panduan Siaran Admin</h3>
            <p className="text-slate-400 leading-relaxed">
              Pengumuman yang disiarkan dengan saluran In-App akan segera muncul pada bel notifikasi pengguna. Notifikasi email akan diproses melalui antrean email asynchronous dengan laju pengiriman terkendali.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-slate-400">
              <div className="font-bold text-slate-300">Praktik Terbaik:</div>
              <p>• Hindari mengirim pengumuman terlalu sering.</p>
              <p>• Periksa isi teks dan format sebelum menyiarkan.</p>
              <p>• Setiap pengumuman otomatis dicatat pada Audit Logger.</p>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: SMTP / GATEWAY CONFIG */}
      {activeSubTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center space-x-2 text-blue-400">
              <Server className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Konfigurasi Gateway Email (Aman)</h2>
            </div>
            <p className="text-xs text-slate-400">
              Kelola pengaturan provider pengiriman email transaksional AA Event Maker. Demi keamanan, password SMTP dan API Secret tidak pernah diekspos ke frontend.
            </p>

            {emailConfig ? (
              <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Provider Email</label>
                    <select
                      value={emailConfig.provider}
                      onChange={(e) => setEmailConfig({ ...emailConfig, provider: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                    >
                      <option value="SMTP">Custom SMTP (aa-eventmaker.my.id)</option>
                      <option value="RESEND">Resend Gateway</option>
                      <option value="SENDGRID">SendGrid API</option>
                      <option value="POSTMARK">Postmark API</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nama Pengirim (From Name)</label>
                    <input
                      type="text"
                      value={emailConfig.fromName}
                      onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email Pengirim (From Address)</label>
                    <input
                      type="email"
                      value={emailConfig.fromEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Reply-To Address</label>
                    <input
                      type="email"
                      value={emailConfig.replyToEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, replyToEmail: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {emailConfig.provider === 'SMTP' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-300 mb-1">SMTP Host</label>
                      <input
                        type="text"
                        value={emailConfig.host}
                        onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">SMTP Port</label>
                      <input
                        type="number"
                        value={emailConfig.port}
                        onChange={(e) => setEmailConfig({ ...emailConfig, port: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={emailConfig.secure}
                      onChange={(e) => setEmailConfig({ ...emailConfig, secure: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600"
                    />
                    <span className="font-semibold">Gunakan Koneksi Aman SSL/TLS</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Status Autentikasi: {emailConfig.hasAuthPassword ? '✓ Password Tersimpan di Lingkungan Server' : 'Otentikasi Default'}
                  </div>

                  <button
                    type="submit"
                    disabled={configSaving}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    {configSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{configSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center text-slate-500">Memuat konfigurasi email...</div>
            )}
          </div>

          {/* Test Dispatcher Diagnostic Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Send className="w-4 h-4" />
              <h3 className="font-bold text-white text-sm">Diagnostik Kirim Email</h3>
            </div>
            <p className="text-slate-400">
              Kirimkan email uji coba ke alamat mana pun untuk memastikan template HTML dan koneksi SMTP/Gateway berjalan lancar.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Tujuan Tes</label>
                <input
                  type="email"
                  value={testEmailInput}
                  onChange={(e) => setTestEmailInput(e.target.value)}
                  placeholder="admin@contoh.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testSending}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {testSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{testSending ? 'Mengirim Uji Coba...' : 'Kirim Email Uji Coba'}</span>
              </button>

              {testMessage && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 break-words">
                  {testMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INSPECT LOG MODAL */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-xs text-slate-300 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Detail Log Pengiriman Email</h3>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Penerima</span>
                  <div className="font-bold text-white">{inspectLog.recipientName}</div>
                  <div className="font-mono text-slate-400">{inspectLog.recipient}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Status Pengiriman</span>
                  <div>{getStatusBadge(inspectLog.status)}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Percobaan: {inspectLog.attempts} dari {inspectLog.maxAttempts}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Subjek Email</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-white">
                  {inspectLog.subject}
                </div>
              </div>

              {inspectLog.errorMessage && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Error Terakhir</span>
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 font-mono text-[11px]">
                    {inspectLog.errorMessage}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Pratinjau HTML Email</span>
                <div
                  className="p-4 rounded-xl bg-white text-slate-900 overflow-x-auto max-h-60 border border-slate-700"
                  dangerouslySetInnerHTML={{ __html: inspectLog.htmlPreview || '' }}
                />
              </div>

              {inspectLog.metadata && Object.keys(inspectLog.metadata).length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Metadata Event</span>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto">
                    {JSON.stringify(inspectLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Log ID: {inspectLog.id}
              </span>

              <div className="flex items-center space-x-2">
                {String(inspectLog.status).toLowerCase() === 'failed' && (
                  <button
                    onClick={() => {
                      handleResend(inspectLog.id);
                      setInspectLog(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Kirim Ulang Email Ini
                  </button>
                )}
                <button
                  onClick={() => setInspectLog(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
