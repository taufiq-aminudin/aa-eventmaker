/**
 * Image Optimizer Utility for AA-EventMaker
 * Compresses and resizes uploaded photos in the browser using HTML5 Canvas.
 * Ensures fast load times, crisp display, and lightweight storage.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  fileName: string;
  mimeType: string;
}

export const compressAndOptimizeImage = async (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<OptimizedImageResult> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      reject(new Error('Format file tidak didukung. Silakan gunakan JPG, PNG, atau WebP.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memuat gambar untuk kompresi.'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio scaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Gagal menginisialisasi canvas untuk pengoptimalan.'));
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill background white in case of transparent PNG converted to JPEG
        if (file.type === 'image/png') {
          // Keep as PNG if transparent or convert to WebP/JPEG if large
          ctx.drawImage(img, 0, 0, width, height);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Export as WebP if supported, otherwise JPEG
        const targetMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(targetMime, quality);

        // Approximate size in bytes
        const head = `data:${targetMime};base64,`;
        const base64Length = dataUrl.length - head.length;
        const compressedSize = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize,
          width,
          height,
          fileName: file.name,
          mimeType: targetMime,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
