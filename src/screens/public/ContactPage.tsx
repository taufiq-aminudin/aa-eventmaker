import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { SeoMetadata } from '../../components/SeoMetadata';

export const ContactPage: React.FC = () => {
  const { showToast } = useEvent();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Pernikahan',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Mohon lengkapi nama dan nomor WhatsApp Anda.');
      return;
    }

    setSubmitted(true);
    showToast('Pesan Anda berhasil terkirim. Tim AA Event Maker akan segera menghubungi Anda.');
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo AA Event Maker, saya ${formData.name || 'Pengguna'} ingin berkonsultasi mengenai undangan acara ${formData.eventType}.`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div id="contact-page" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <SeoMetadata
        title="Hubungi Kami – AA Event Maker"
        description="Hubungi tim layanan dan dukungan pelanggan AA Event Maker melalui WhatsApp, email, atau formulir konsultasi acara."
        canonicalPath="/contact"
        imageUrl="https://aa-eventmaker.my.id/pwa-512x512.png"
        type="website"
      />

      <PublicHeader />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">
              <Phone className="w-3.5 h-3.5" />
              <span>Layanan Pelanggan & Konsultasi Acara</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Hubungi Tim Kami
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Punya pertanyaan mengenai paket, kustomisasi desain khusus, atau butuh bantuan saat hari-H? Tim kami siap mendampingi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Information Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h2 className="text-lg font-black text-slate-900">Saluran Resmi</h2>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">WhatsApp Resmi</div>
                      <div className="text-slate-600 mt-0.5">+62 812-3456-7890</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                        Respons Cepat: Setiap Hari (08.00 - 22.00 WIB)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Email Resmi</div>
                      <div className="text-slate-600 mt-0.5">support@aa-eventmaker.my.id</div>
                      <div className="text-[10px] text-slate-400 mt-1">halo@aa-eventmaker.my.id</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Kantor Operasional</div>
                      <div className="text-slate-600 mt-0.5">
                        Jakarta & Surakarta, Indonesia
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Domain: https://aa-eventmaker.my.id/</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleOpenWhatsApp}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Langsung via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inquiry Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h2 className="text-lg font-black text-slate-900 mb-1">
                  Kirim Pesan atau Permintaan Khusus
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Isi formulir di bawah ini dan kami akan membalas via WhatsApp atau email dalam kurun waktu 1x24 jam.
                </p>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-base font-bold text-emerald-900">
                      Terima Kasih! Pesan Berhasil Dikirim
                    </h3>
                    <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
                      Tim konsultan acara kami telah menerima pesan Anda dan akan menghubungi nomor WhatsApp {formData.phone} segera.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Kirim Pesan Lainnya
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nama Anda"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@anda.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Jenis Acara</label>
                        <select
                          value={formData.eventType}
                          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                        >
                          <option value="Pernikahan">Pernikahan (Wedding)</option>
                          <option value="Lamaran / Tunangan">Lamaran / Tunangan</option>
                          <option value="Ulang Tahun / Sweet 17">Ulang Tahun / Sweet 17</option>
                          <option value="Acara Perusahaan / Gala">Acara Perusahaan / Gala</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pesan atau Pertanyaan</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tuliskan detail rencana tanggal acara, perkiraan tamu, atau pertanyaan spesifik..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Formulir Konsultasi</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
