/**
 * Image Optimizer Utility for AA : Event Maker
 * Automatically resizes and compresses images during the photo upload process
 * in the Invitation Builder to ensure faster load times for mobile users.
 */

export interface ResizeCompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (recommended 0.8 - 0.88)
  format?: 'auto' | 'image/webp' | 'image/jpeg' | 'image/png';
}

export type UploadPreset = 'cover' | 'couple' | 'gallery' | 'avatar' | 'thumbnail';

export interface OptimizedImageResult {
  dataUrl: string;
  blob?: Blob;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  fileName: string;
  mimeType: string;
  savingsPercentage: number;
  formattedOriginalSize: string;
  formattedCompressedSize: string;
}

/**
 * Standard preset configurations for different invitation elements
 */
export const UPLOAD_PRESETS: Record<UploadPreset, ResizeCompressOptions> = {
  cover: {
    maxWidth: 1400,
    maxHeight: 1000,
    quality: 0.85,
    format: 'auto',
  },
  couple: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.88,
    format: 'auto',
  },
  gallery: {
    maxWidth: 900,
    maxHeight: 900,
    quality: 0.82,
    format: 'auto',
  },
  avatar: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.90,
    format: 'auto',
  },
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.75,
    format: 'auto',
  },
};

/**
 * Formats byte size into human readable string (B, KB, MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Checks if a file is a supported image format
 */
export const isImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
  return validTypes.includes(file.type.toLowerCase());
};

/**
 * Automatically resizes and compresses an image file using browser HTML5 canvas.
 * Reduces payload size by up to 85%+ while maintaining high-DPI clarity for mobile screens.
 * 
 * @param file The image File object from an <input type="file"> or drop event
 * @param optionsOrMaxWidth Configuration options object or numeric maxWidth
 * @param maxHeightParam Optional numeric maxHeight if positional args are used
 * @param qualityParam Optional compression quality (0.1 - 1.0)
 */
export const resizeAndCompressImage = async (
  file: File,
  optionsOrMaxWidth: ResizeCompressOptions | number = 1200,
  maxHeightParam = 1200,
  qualityParam = 0.82
): Promise<OptimizedImageResult> => {
  return new Promise((resolve, reject) => {
    // 1. Validate file existence and type
    if (!file) {
      reject(new Error('File tidak ditemukan. Silakan pilih file gambar.'));
      return;
    }

    if (!isImageFile(file)) {
      reject(new Error('Format file tidak didukung. Silakan gunakan format JPG, PNG, atau WebP.'));
      return;
    }

    // 2. Parse configuration options
    let maxWidth = 1200;
    let maxHeight = 1200;
    let quality = 0.82;
    let targetFormat: 'auto' | 'image/webp' | 'image/jpeg' | 'image/png' = 'auto';

    if (typeof optionsOrMaxWidth === 'number') {
      maxWidth = optionsOrMaxWidth;
      maxHeight = maxHeightParam;
      quality = qualityParam;
    } else if (typeof optionsOrMaxWidth === 'object' && optionsOrMaxWidth !== null) {
      maxWidth = optionsOrMaxWidth.maxWidth ?? 1200;
      maxHeight = optionsOrMaxWidth.maxHeight ?? 1200;
      quality = optionsOrMaxWidth.quality ?? 0.82;
      targetFormat = optionsOrMaxWidth.format ?? 'auto';
    }

    // Ensure quality is bounded
    quality = Math.max(0.1, Math.min(1.0, quality));

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar dari perangkat.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses struktur file gambar.'));

      img.onload = () => {
        let { width, height } = img;

        // 3. Calculate proportional aspect-ratio scaling
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        // 4. Initialize HTML5 Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Gagal menginisialisasi canvas untuk kompresi gambar.'));
          return;
        }

        // Enable high-quality bicubic interpolation smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background handling: transparent for PNG, crisp white for JPEG
        const isPng = file.type === 'image/png';
        if (!isPng) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw scaled image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // 5. Determine destination MIME type
        let exportMime = 'image/jpeg';
        if (targetFormat === 'image/webp' || targetFormat === 'image/jpeg' || targetFormat === 'image/png') {
          exportMime = targetFormat;
        } else if (targetFormat === 'auto') {
          exportMime = isPng ? 'image/png' : 'image/jpeg';
        }

        // 6. Export to base64 data URL
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL(exportMime, quality);
        } catch {
          // Fallback to JPEG if custom export format fails
          exportMime = 'image/jpeg';
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // 7. Calculate compressed size & savings
        const header = `data:${exportMime};base64,`;
        const base64Content = dataUrl.startsWith(header)
          ? dataUrl.slice(header.length)
          : dataUrl.split(',')[1] || '';
        const compressedSize = Math.round((base64Content.length * 3) / 4);
        const savings = Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100));

        // Create Blob for storage/upload if needed
        canvas.toBlob(
          (blob) => {
            resolve({
              dataUrl,
              blob: blob || undefined,
              originalSize: file.size,
              compressedSize,
              width,
              height,
              fileName: file.name,
              mimeType: exportMime,
              savingsPercentage: savings,
              formattedOriginalSize: formatFileSize(file.size),
              formattedCompressedSize: formatFileSize(compressedSize),
            });
          },
          exportMime,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Convenient preset helper function specifically for the Invitation Builder.
 * Automatically applies pre-calibrated resolution and compression rules based
 * on the target component role (cover, couple, gallery, avatar).
 *
 * @param file The image File to process
 * @param preset Preset key ('cover' | 'couple' | 'gallery' | 'avatar' | 'thumbnail') or custom options
 */
export const compressImageForUpload = async (
  file: File,
  preset: UploadPreset | ResizeCompressOptions = 'cover'
): Promise<OptimizedImageResult> => {
  const options = typeof preset === 'string' ? UPLOAD_PRESETS[preset] || UPLOAD_PRESETS.cover : preset;
  return resizeAndCompressImage(file, options);
};

/**
 * Backward-compatible alias for existing imports
 */
export const compressAndOptimizeImage = resizeAndCompressImage;
