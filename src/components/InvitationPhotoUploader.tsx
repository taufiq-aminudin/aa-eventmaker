import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { compressAndOptimizeImage, formatFileSize } from '../utils/imageOptimizer';
import { useEvent } from '../context/EventContext';

export const InvitationPhotoUploader: React.FC = () => {
  const { invitation, updateInvitation, showToast } = useEvent();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCompressionInfo, setLastCompressionInfo] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const coupleInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const result = await compressAndOptimizeImage(file, 1400, 1000, 0.85);
      updateInvitation({ coverPhoto: result.dataUrl });
      setLastCompressionInfo(
        `Foto sampul dioptimalkan (${formatFileSize(result.originalSize)} ➔ ${formatFileSize(
          result.compressedSize
        )})`
      );
      showToast('Foto sampul berhasil diperbarui!');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto.');
    } finally {
      setIsProcessing(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const handleCoupleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const result = await compressAndOptimizeImage(file, 800, 800, 0.88);
      updateInvitation({ couplePhoto: result.dataUrl });
      setLastCompressionInfo(
        `Foto mempelai dioptimalkan (${formatFileSize(result.originalSize)} ➔ ${formatFileSize(
          result.compressedSize
        )})`
      );
      showToast('Foto mempelai berhasil diperbarui!');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah foto.');
    } finally {
      setIsProcessing(false);
      if (coupleInputRef.current) coupleInputRef.current.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      const currentGallery = invitation.galleryPhotos || [];
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await compressAndOptimizeImage(file, 900, 900, 0.82);
        newUrls.push(res.dataUrl);
      }

      updateInvitation({ galleryPhotos: [...currentGallery, ...newUrls] });
      showToast(`${newUrls.length} foto berhasil ditambahkan ke galeri!`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah beberapa foto.');
    } finally {
      setIsProcessing(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleRemoveCover = () => {
    updateInvitation({ coverPhoto: undefined });
    showToast('Foto sampul dihapus (menggunakan default tema).');
  };

  const handleRemoveCouple = () => {
    updateInvitation({ couplePhoto: undefined });
    showToast('Foto mempelai dihapus.');
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    const current = [...(invitation.galleryPhotos || [])];
    current.splice(index, 1);
    updateInvitation({ galleryPhotos: current });
    showToast('Foto galeri dihapus.');
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Upload Foto & Galeri Undangan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah foto mempelai / tuan rumah dan koleksi foto momen. Foto otomatis dikompresi agar undangan cepat dibuka di smartphone tamu.
          </p>
        </div>

        {lastCompressionInfo && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lastCompressionInfo}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Cover Photo Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <span>Foto Sampul / Banner Utama</span>
            </label>
            {invitation.coverPhoto && (
              <button
                type="button"
                onClick={handleRemoveCover}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>

          <div className="relative h-44 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden group bg-slate-50 flex items-center justify-center">
            {invitation.coverPhoto ? (
              <>
                <img
                  src={invitation.coverPhoto}
                  alt="Foto Sampul"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ganti Foto</span>
                  </button>
                </div>
              </>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="text-center p-4 cursor-pointer hover:bg-slate-100/80 transition-colors w-full h-full flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Pilih Foto Sampul</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, atau WebP (Maks 10MB)</span>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* 2. Couple / Host Photo Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <span>Foto Mempelai / Tokoh Utama</span>
            </label>
            {invitation.couplePhoto && (
              <button
                type="button"
                onClick={handleRemoveCouple}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>

          <div className="relative h-44 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden group bg-slate-50 flex items-center justify-center">
            {invitation.couplePhoto ? (
              <div className="relative flex items-center justify-center w-full h-full">
                <img
                  src={invitation.couplePhoto}
                  alt="Foto Mempelai"
                  className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-white ring-4 ring-purple-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => coupleInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ganti Foto</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => coupleInputRef.current?.click()}
                className="text-center p-4 cursor-pointer hover:bg-slate-100/80 transition-colors w-full h-full flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-2">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Pilih Foto Mempelai / Pasangan</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Format potret atau persegi</span>
              </div>
            )}
            <input
              ref={coupleInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoupleUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* 3. Gallery Photos Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800">Galeri Foto Momen Bahagia</span>
            <span className="text-[11px] text-slate-500 ml-2">
              ({(invitation.galleryPhotos || []).length} foto tersimpan)
            </span>
          </div>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={isProcessing}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Foto Galeri</span>
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleGalleryUpload}
            className="hidden"
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {(invitation.galleryPhotos || []).map((photoUrl, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs"
            >
              <img src={photoUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveGalleryPhoto(idx)}
                className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hapus foto ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add more button tile */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={isProcessing}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-purple-600"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};
