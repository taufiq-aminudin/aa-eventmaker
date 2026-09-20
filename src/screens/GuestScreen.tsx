import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  QrCode,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  Zap,
  Mail,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { Guest, CampaignTarget, ScheduleTiming } from '../types';
import { exportCsvReport, printPdfReport, GuestExportFilter } from '../utils/reportExporter';
import { renderEmailTemplate, AVAILABLE_TAGS } from '../utils/templateEngine';

export const GuestScreen: React.FC<{ initialOpenScanner?: boolean }> = ({
  initialOpenScanner,
}) => {
  const {
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    checkInGuest,
    setSelectedGuestForPass,
    setShowQrCheckinModal,
    autoRsvpConfig,
    toggleAutoRsvpScheduler,
    toggleAutoReminderRule,
    triggerPendingRsvpRemindersNow,
    sendSingleRsvpReminder,
    updateAutoReminderTemplate,
    campaigns,
    scheduleCampaign,
    deleteCampaign,
    emailTemplates,
    invitation,
    currentProject,
    showToast,
  } = useEvent();

  // Active Sub-Tab: 'list' | 'auto_rsvp' | 'campaigns'
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'auto_rsvp' | 'campaigns'>('list');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal states
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // Form State for Add/Edit Guest
  const [guestForm, setGuestForm] = useState({
    name: '',
    group: 'General',
    pax: 2,
    phone: '',
    email: '',
    tableNumber: 'Table 01',
    rsvpStatus: 'Confirmed' as 'Confirmed' | 'Pending' | 'Declined' | 'Maybe',
  });

  // Export Filter State
  const [exportFilter, setExportFilter] = useState<GuestExportFilter>('ALL');

  // New Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    title: 'Pengumuman Resmi Acara',
    templateId: emailTemplates[0]?.id || '',
    subject: 'Undangan Resmi: {{event_title}} ({{guest_name}})',
    bodyTemplate: emailTemplates[0]?.body || '',
    target: 'ALL' as CampaignTarget,
    scheduleTiming: 'IMMEDIATE' as ScheduleTiming,
  });

  // Auto RSVP edit message state
  const [editingAutoTemplate, setEditingAutoTemplate] = useState(false);
  const [autoSubject, setAutoSubject] = useState(autoRsvpConfig.emailSubject);
  const [autoBody, setAutoBody] = useState(autoRsvpConfig.emailBody);

  // KPIs
  const totalGuests = guests.length;
  const totalPax = guests.reduce((acc, g) => acc + g.pax, 0);
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const confirmedPax = guests
    .filter((g) => g.rsvpStatus === 'Confirmed')
    .reduce((acc, g) => acc + g.pax, 0);
  const checkedInCount = guests.filter((g) => g.isCheckedIn).length;
  const pendingCount = guests.filter(
    (g) => g.rsvpStatus === 'Pending' || g.rsvpStatus === 'Maybe'
  ).length;

  // Filtered guest list
  const filteredGuests = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.checkInCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);

    const matchGroup = filterGroup === 'ALL' || g.group.toLowerCase() === filterGroup.toLowerCase();
    const matchStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'CHECKED_IN' && g.isCheckedIn) ||
      (filterStatus === 'CONFIRMED' && g.rsvpStatus === 'Confirmed') ||
      (filterStatus === 'PENDING' && (g.rsvpStatus === 'Pending' || g.rsvpStatus === 'Maybe')) ||
      (filterStatus === 'DECLINED' && g.rsvpStatus === 'Declined');

    return matchSearch && matchGroup && matchStatus;
  });

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name.trim()) return;

    if (editingGuest) {
      updateGuest({
        ...editingGuest,
        name: guestForm.name,
        group: guestForm.group,
        pax: Number(guestForm.pax),
        phone: guestForm.phone,
        email: guestForm.email,
        tableNumber: guestForm.tableNumber,
        rsvpStatus: guestForm.rsvpStatus,
      });
      setEditingGuest(null);
    } else {
      addGuest({
        name: guestForm.name,
        group: guestForm.group,
        pax: Number(guestForm.pax),
        phone: guestForm.phone,
        email: guestForm.email,
        tableNumber: guestForm.tableNumber,
        rsvpStatus: guestForm.rsvpStatus,
      });
    }

    setShowAddGuestModal(false);
    setGuestForm({
      name: '',
      group: 'General',
      pax: 2,
      phone: '',
      email: '',
      tableNumber: 'Table 01',
      rsvpStatus: 'Confirmed',
    });
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleCampaign({
      title: campaignForm.title,
      templateId: campaignForm.templateId,
      subject: campaignForm.subject,
      bodyTemplate: campaignForm.bodyTemplate,
      target: campaignForm.target,
      scheduleTiming: campaignForm.scheduleTiming,
    });
    setShowCampaignModal(false);
  };

  return (
    <div id="guest-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#6d28d9]" />
            <h1 className="text-lg font-bold text-slate-900">Manajemen Tamu & E-Pass Resepsionis</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola daftar undangan, check-in QR hari-H, otomatisasi blast RSVP, dan ekspor laporan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-scan-qr-guest"
            onClick={() => setShowQrCheckinModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <QrCode className="w-4 h-4 text-[#6d28d9]" />
            <span>Scan QR</span>
          </button>

          <button
            id="btn-export-reports"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor Laporan</span>
          </button>

          <button
            id="btn-add-guest"
            onClick={() => {
              setEditingGuest(null);
              setGuestForm({
                name: '',
                group: 'General',
                pax: 2,
                phone: '',
                email: '',
                tableNumber: 'Table 01',
                rsvpStatus: 'Confirmed',
              });
              setShowAddGuestModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#6d28d9] to-[#ec4899] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 transition-opacity flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Tamu</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Tamu</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {totalGuests}{' '}
            <span className="text-xs font-normal text-slate-500">({totalPax} Pax)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase">RSVP Hadir</div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-700 mt-1">
            {confirmedCount}{' '}
            <span className="text-xs font-normal text-slate-500">({confirmedPax} Pax)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Hadir di Lokasi</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">
            {checkedInCount}{' '}
            <span className="text-xs font-normal text-slate-500">Check-in</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase">Pending RSVP</div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1">
            {pendingCount}{' '}
            <span className="text-xs font-normal text-slate-500">Belum konfirmasi</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveSubTab('list')}
          className={`pb-3 text-xs font-bold transition-colors flex items-center space-x-1.5 border-b-2 ${
            activeSubTab === 'list'
              ? 'border-[#6d28d9] text-[#6d28d9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Tamu ({guests.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('auto_rsvp')}
          className={`pb-3 text-xs font-bold transition-colors flex items-center space-x-1.5 border-b-2 ${
            activeSubTab === 'auto_rsvp'
              ? 'border-[#6d28d9] text-[#6d28d9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Auto RSVP Scheduler</span>
          {autoRsvpConfig.isEnabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`pb-3 text-xs font-bold transition-colors flex items-center space-x-1.5 border-b-2 ${
            activeSubTab === 'campaigns'
              ? 'border-[#6d28d9] text-[#6d28d9]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Broadcast & Blast ({campaigns.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: GUEST LIST */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          {/* Filter & Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, kode E-Pass, meja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="text-xs px-2.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-700"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="VIP">VIP</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="General">General</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-2.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-700"
              >
                <option value="ALL">Semua Status</option>
                <option value="CHECKED_IN">Sudah Hadir</option>
                <option value="CONFIRMED">Konfirmasi Hadir</option>
                <option value="PENDING">Pending / Ragu</option>
                <option value="DECLINED">Berhalangan</option>
              </select>
            </div>
          </div>

          {/* Guest List: Mobile Cards (< 640px) */}
          <div className="block sm:hidden space-y-3">
            {filteredGuests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                Tidak ada data tamu yang sesuai filter.
              </div>
            ) : (
              filteredGuests.map((guest) => {
                const cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
                const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

                return (
                  <div
                    key={guest.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{guest.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          E-Pass: <span className="text-purple-700 font-bold">{guest.checkInCode}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            guest.rsvpStatus === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : guest.rsvpStatus === 'Declined'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {guest.rsvpStatus}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-[#6d28d9]">
                          {guest.group}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Meja:</span>
                        <span className="font-bold text-slate-800">{guest.tableNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Jumlah Pax:</span>
                        <span className="font-bold text-slate-800">{guest.pax} Orang</span>
                      </div>
                    </div>

                    {/* Check-In Status & Primary Action */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div>
                        {guest.isCheckedIn ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Hadir ({guest.checkInTime || 'Checked-in'})</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Belum Hadir</span>
                        )}
                      </div>

                      {!guest.isCheckedIn ? (
                        <button
                          onClick={() => checkInGuest(guest.id)}
                          className="px-3.5 py-1.5 text-xs font-bold bg-[#6d28d9] text-white rounded-xl shadow-xs active:scale-95 transition-transform"
                        >
                          Check-In Sekarang
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedGuestForPass(guest)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg flex items-center space-x-1"
                        >
                          <QrCode className="w-3.5 h-3.5 text-purple-700" />
                          <span>E-Pass</span>
                        </button>
                      )}
                    </div>

                    {/* Mobile Quick Action Buttons Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                      <div className="flex items-center space-x-2">
                        {waNumber && (
                          <a
                            href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(guest.name)},%20berikut%20tiket%20dan%20undangan%20acara%20kami:%20${window.location.origin}%23invitation`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center space-x-1 text-xs font-semibold"
                            title="Kirim Pesan WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="text-[11px]">WA</span>
                          </a>
                        )}

                        {guest.phone && (
                          <a
                            href={`tel:${guest.phone}`}
                            className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center space-x-1 text-xs font-semibold"
                            title="Telepon Tamu"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Telp</span>
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedGuestForPass(guest)}
                          className="p-2 rounded-xl bg-purple-50 text-[#6d28d9] hover:bg-purple-100 flex items-center space-x-1 text-xs font-semibold"
                          title="Lihat Tiket QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span className="text-[11px]">E-Pass</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingGuest(guest);
                            setGuestForm({
                              name: guest.name,
                              group: guest.group,
                              pax: guest.pax,
                              phone: guest.phone,
                              email: guest.email,
                              tableNumber: guest.tableNumber,
                              rsvpStatus: guest.rsvpStatus,
                            });
                            setShowAddGuestModal(true);
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
                          title="Edit Tamu"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteGuest(guest.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50"
                          title="Hapus Tamu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop/Tablet Table View (>= 640px) */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Meja</th>
                    <th className="py-3 px-2 text-center">Pax</th>
                    <th className="py-3 px-3">Status RSVP</th>
                    <th className="py-3 px-3">Check-In</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Tidak ada data tamu yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div className="flex items-center space-x-2">
                            <div>
                              <div className="font-bold">{guest.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {guest.checkInCode} {guest.phone ? `• ${guest.phone}` : ''}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-[#6d28d9]">
                            {guest.group}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-medium text-slate-600">
                          {guest.tableNumber}
                        </td>

                        <td className="py-3 px-2 text-center font-bold text-slate-800">
                          {guest.pax}
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              guest.rsvpStatus === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : guest.rsvpStatus === 'Declined'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {guest.rsvpStatus}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {guest.isCheckedIn ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{guest.checkInTime || 'Hadir'}</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => checkInGuest(guest.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-[#6d28d9] rounded-lg transition-colors"
                            >
                              Check-In
                            </button>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => setSelectedGuestForPass(guest)}
                              title="Buka Tiket E-Pass"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#6d28d9]"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {guest.rsvpStatus === 'Pending' && (
                              <button
                                onClick={() => sendSingleRsvpReminder(guest.id)}
                                title="Kirim Pengingat RSVP Personal"
                                className="p-1.5 rounded-lg hover:bg-purple-50 text-[#6d28d9]"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setEditingGuest(guest);
                                setGuestForm({
                                  name: guest.name,
                                  group: guest.group,
                                  pax: guest.pax,
                                  phone: guest.phone,
                                  email: guest.email,
                                  tableNumber: guest.tableNumber,
                                  rsvpStatus: guest.rsvpStatus,
                                });
                                setShowAddGuestModal(true);
                              }}
                              title="Edit Data Tamu"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => deleteGuest(guest.id)}
                              title="Hapus Tamu"
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* SUB-TAB 2: AUTO RSVP SCHEDULER */}
      {activeSubTab === 'auto_rsvp' && (
        <div className="space-y-6">
          {/* Master Switch Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Otomatisasi Pengingat RSVP Berkala
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">
                Sistem akan secara cerdas menjadwalkan dan mengirimkan pesan pengingat ke tamu
                dengan status pending pada H-7, H-3, dan H-1 menjelang perhelatan acara.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-700">
                {autoRsvpConfig.isEnabled ? 'Aktif Otomatis' : 'Nonaktif'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRsvpConfig.isEnabled}
                  onChange={(e) => toggleAutoRsvpScheduler(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6d28d9]"></div>
              </label>
            </div>
          </div>

          {/* Rules & Immediate Trigger Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Rules List (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Jadwal Waktu & Aturan Blast
                </h4>
                <span className="text-[11px] text-[#6d28d9] font-semibold">
                  Total Terkirim: {autoRsvpConfig.totalRemindersSent} Pengingat
                </span>
              </div>

              <div className="space-y-3">
                {autoRsvpConfig.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{rule.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {rule.scheduledTimeDisplay}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-medium text-slate-600">
                        {rule.isEnabled ? 'Aktif' : 'Mati'}
                      </span>
                      <input
                        type="checkbox"
                        checked={rule.isEnabled}
                        onChange={(e) => toggleAutoReminderRule(rule.id, e.target.checked)}
                        className="rounded-sm text-[#6d28d9] focus:ring-[#6d28d9]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Instant Blast Trigger */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Tamu Pending Sekarang: <strong className="text-amber-600">{pendingCount} Tamu</strong>
                </div>
                <button
                  id="btn-trigger-rsvp-now"
                  onClick={() => triggerPendingRsvpRemindersNow('Eksekusi Cepat Dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 transition-opacity flex items-center space-x-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Kirim Blast Sekarang ({pendingCount} Tamu)</span>
                </button>
              </div>
            </div>

            {/* Template Editor / Preview (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Format Pesan Pengingat
                </h4>
                <button
                  onClick={() => {
                    if (editingAutoTemplate) {
                      updateAutoReminderTemplate(autoSubject, autoBody);
                    }
                    setEditingAutoTemplate(!editingAutoTemplate);
                  }}
                  className="text-xs font-bold text-[#6d28d9] hover:underline"
                >
                  {editingAutoTemplate ? 'Simpan Format' : 'Edit Pesan'}
                </button>
              </div>

              {editingAutoTemplate ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Subjek Pesan
                    </label>
                    <input
                      type="text"
                      value={autoSubject}
                      onChange={(e) => setAutoSubject(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Isi Pesan
                    </label>
                    <textarea
                      rows={8}
                      value={autoBody}
                      onChange={(e) => setAutoBody(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-semibold text-slate-800">
                    Subjek: {autoRsvpConfig.emailSubject}
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-600 whitespace-pre-wrap max-h-56 overflow-y-auto">
                    {autoRsvpConfig.emailBody}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Riwayat Pengiriman Blast (Audit Trail)
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {autoRsvpConfig.logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-slate-900">{log.summary}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Penerima: {log.recipientNames.slice(0, 3).join(', ')}
                      {log.recipientNames.length > 3
                        ? ` +${log.recipientNames.length - 3} lainnya`
                        : ''}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {log.timestamp} • {log.triggerSource}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CAMPAIGNS */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              Kirim broadcast undangan resmi, pengingat, petunjuk jalan, atau ucapan terima kasih.
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="px-4 py-2 bg-[#6d28d9] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#5b21b6] transition-colors flex items-center space-x-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>Jadwalkan Blast Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-900">{camp.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        camp.status === 'SENT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : camp.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{camp.subject}</div>
                  <div className="text-[11px] text-slate-400">
                    Target: <strong>{camp.target}</strong> ({camp.recipientCount} Tamu) • Jadwal:{' '}
                    {camp.scheduledTimeDisplay}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteCampaign(camp.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT GUEST MODAL */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingGuest ? 'Edit Tamu Undangan' : 'Tambah Tamu Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Isi data detail tamu untuk penataan nomor meja, alokasi kursi, dan tiket E-Pass.
            </p>

            <form onSubmit={handleSaveGuest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Tamu
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang Pamungkas & Partner"
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6d28d9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Tamu
                  </label>
                  <select
                    value={guestForm.group}
                    onChange={(e) => setGuestForm({ ...guestForm, group: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Kursi (Pax)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={guestForm.pax}
                    onChange={(e) => setGuestForm({ ...guestForm, pax: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Meja
                  </label>
                  <input
                    type="text"
                    placeholder="VIP 01 / Table 05"
                    value={guestForm.tableNumber}
                    onChange={(e) => setGuestForm({ ...guestForm, tableNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={guestForm.email}
                  onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status RSVP Awal
                </label>
                <select
                  value={guestForm.rsvpStatus}
                  onChange={(e) =>
                    setGuestForm({
                      ...guestForm,
                      rsvpStatus: e.target.value as any,
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="Confirmed">Confirmed (Konfirmasi Hadir)</option>
                  <option value="Pending">Pending (Menunggu Respon)</option>
                  <option value="Maybe">Maybe (Ragu-ragu)</option>
                  <option value="Declined">Declined (Berhalangan)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] rounded-lg shadow-xs"
                >
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT REPORT DIALOG */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Ekspor Data Tamu & Laporan Kehadiran
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Unduh data buku tamu dalam format CSV untuk Microsoft Excel / Google Sheets atau cetak
              laporan PDF resmi.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Filter Data Tamu yang Diekspor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ALL', label: 'Semua Tamu' },
                    { id: 'CHECKED_IN', label: 'Sudah Check-In' },
                    { id: 'CONFIRMED', label: 'RSVP Hadir' },
                    { id: 'PENDING', label: 'Pending RSVP' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExportFilter(item.id as GuestExportFilter)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-left ${
                        exportFilter === item.id
                          ? 'border-[#6d28d9] bg-purple-50 text-[#6d28d9]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* KPI Summary Preview */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Total Tamu Terpilih:</span>
                  <span className="font-bold text-slate-900">
                    {exportFilter === 'ALL'
                      ? totalGuests
                      : exportFilter === 'CHECKED_IN'
                      ? checkedInCount
                      : exportFilter === 'CONFIRMED'
                      ? confirmedCount
                      : pendingCount}{' '}
                    Tamu
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Acara:</span>
                  <span className="font-medium text-slate-900">{invitation.title}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    exportCsvReport(guests, invitation, currentProject, exportFilter);
                    setShowExportModal(false);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Unduh CSV Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    printPdfReport(guests, invitation, currentProject, exportFilter);
                    setShowExportModal(false);
                  }}
                  className="px-4 py-2.5 bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak PDF</span>
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW CAMPAIGN MODAL */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Jadwalkan Blast Kampanye Undangan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Kirim blast pesan personal ke tamu menggunakan variabel dinamis (&#123;&#123;guest_name&#125;&#125;, &#123;&#123;check_in_url&#125;&#125;, &#123;&#123;table_number&#125;&#125;).
            </p>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Templat Email
                </label>
                <select
                  value={campaignForm.templateId}
                  onChange={(e) => {
                    const sel = emailTemplates.find((t) => t.id === e.target.value);
                    setCampaignForm({
                      ...campaignForm,
                      templateId: e.target.value,
                      subject: sel ? sel.subject : campaignForm.subject,
                      bodyTemplate: sel ? sel.body : campaignForm.bodyTemplate,
                    });
                  }}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {emailTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Tamu Penerima
                </label>
                <select
                  value={campaignForm.target}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      target: e.target.value as CampaignTarget,
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="ALL">Semua Tamu ({totalGuests} Orang)</option>
                  <option value="PENDING_RSVP">Tamu Belum RSVP ({pendingCount} Orang)</option>
                  <option value="CONFIRMED_RSVP">
                    Tamu Sudah Konfirmasi Hadir ({confirmedCount} Orang)
                  </option>
                  <option value="VIP_FAMILY">Khusus VIP & Keluarga Besar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Waktu Pengiriman
                </label>
                <select
                  value={campaignForm.scheduleTiming}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      scheduleTiming: e.target.value as ScheduleTiming,
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="IMMEDIATE">Langsung Kirim Sekarang</option>
                  <option value="H_MINUS_7">H-7 Sebelum Acara (09:00 WIB)</option>
                  <option value="H_MINUS_3">H-3 Sebelum Acara (10:00 WIB)</option>
                  <option value="H_MINUS_1">H-1 Sebelum Acara (08:00 WIB)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjek Pesan
                </label>
                <input
                  type="text"
                  value={campaignForm.subject}
                  onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pesan (Dengan Variabel Dinamis)
                </label>
                <textarea
                  rows={6}
                  value={campaignForm.bodyTemplate}
                  onChange={(e) =>
                    setCampaignForm({ ...campaignForm, bodyTemplate: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#6d28d9] hover:bg-[#5b21b6] rounded-lg shadow-xs"
                >
                  Jadwalkan Blast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
