import React, { useState } from 'react';
import {
  Camera,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  Truck,
  FileCheck,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

interface PaymentMilestone {
  id: string;
  label: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'UPCOMING';
}

export const VendorDashboardScreen: React.FC = () => {
  const { currentProject, formatCost } = useEvent();

  const [milestones, setMilestones] = useState<PaymentMilestone[]>([
    {
      id: 'm1',
      label: 'Uang Muka (DP 30%)',
      percentage: 30,
      amount: 6000000,
      dueDate: '10 Agustus 2026',
      status: 'PAID',
    },
    {
      id: 'm2',
      label: 'Termin II (Progress 40%)',
      percentage: 40,
      amount: 8000000,
      dueDate: '15 September 2026',
      status: 'PAID',
    },
    {
      id: 'm3',
      label: 'Pelunasan Akhir (30% Hari H)',
      percentage: 30,
      amount: 6000000,
      dueDate: '25 Oktober 2026',
      status: 'PENDING',
    },
  ]);

  const [checklist, setChecklist] = useState([
    { id: 'c1', title: 'Technical Meeting Panitia & Klien', done: true, time: 'H-7 Acara' },
    { id: 'c2', title: 'Loading Alat & Soundcheck Lokasi', done: false, time: 'H-1 Pukul 20:00 WIB' },
    { id: 'c3', title: 'Briefing Tim Dokumentasi / Crew', done: true, time: 'Hari-H Pukul 06:30 WIB' },
    { id: 'c4', title: 'Penyerahan File Foto & Video Teaser', done: false, time: 'H+3 Setelah Acara' },
  ]);

  const totalContract = milestones.reduce((sum, m) => sum + m.amount, 0);
  const totalPaid = milestones
    .filter((m) => m.status === 'PAID')
    .reduce((sum, m) => sum + m.amount, 0);
  const remaining = totalContract - totalPaid;

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Vendor Header Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Portal Rekanan Vendor Resmi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Mahkota Artistry & Vendor</h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>Acara: {currentProject.name} • {currentProject.date}</span>
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[220px]">
            <div className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
              Kategori Layanan
            </div>
            <div className="text-lg font-black mt-1">Dokumentasi & Catering</div>
            <div className="text-xs text-amber-100 mt-0.5">PIC Lapangan: Rendy Kurniawan</div>
          </div>
        </div>
      </div>

      {/* Financial Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai Kontrak Layanan</div>
          <div className="text-2xl font-black text-slate-900 mt-2">{formatCost(totalContract)}</div>
          <div className="text-xs text-slate-500 mt-1">Sesuai Perjanjian Kerjasama (MOU)</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Terbayar (Disbursed)</div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{formatCost(totalPaid)}</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">DP & Termin 2 Telah Diterima</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sisa Termin Pelunasan</div>
          <div className="text-2xl font-black text-orange-600 mt-2">{formatCost(remaining)}</div>
          <div className="text-xs text-slate-500 mt-1">Jatuh tempo saat acara selesai (H-0)</div>
        </div>
      </div>

      {/* Payment Timeline & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Milestones Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Jadwal Termin Pembayaran</h3>
              <p className="text-xs text-slate-500">Pencairan dana langsung ke rekening vendor terdaftar</p>
            </div>
            <FileCheck className="w-5 h-5 text-orange-600" />
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  m.status === 'PAID'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{m.label}</div>
                  <div className="text-[11px] text-slate-500">Jatuh Tempo: {m.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900">{formatCost(m.amount)}</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      m.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {m.status === 'PAID' ? 'Sudah Ditransfer' : 'Menunggu Hari-H'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load-In & Delivery Checklist */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Checklist & Jadwal Loading Perlengkapan</h3>
              <p className="text-xs text-slate-500">Koordinasi teknis penataan di lokasi venue</p>
            </div>
            <Truck className="w-5 h-5 text-amber-600" />
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      item.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-semibold ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.title}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="text-xs text-amber-900 font-semibold">
              Pintu Loading Grand Ballroom dibuka: H-1 Pukul 18:00 WIB.
            </div>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0"
            >
              Hubungi PIC EO
            </a>
          </div>
        </div>
      </div>

      <GoogleAdSlot />
    </div>
  );
};
