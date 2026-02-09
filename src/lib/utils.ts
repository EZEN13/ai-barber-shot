/**
 * Utility functions for the AI Barber Shot app
 */

/**
 * Converts a File object to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts base64 data from a data URL
 */
export function extractBase64(dataUrl: string): string {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (matches && matches[2]) {
    return matches[2];
  }
  return dataUrl;
}

/**
 * Compresses an image to reduce size for API calls
 */
export async function compressImage(
  base64: string,
  maxWidth: number = 1024,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64;
  });
}

/**
 * Crops an image to portrait aspect ratio (3:4)
 */
export async function cropToPortrait(base64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetRatio = 3 / 4;
      const imgRatio = img.width / img.height;

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (imgRatio > targetRatio) {
        // Image is wider, crop sides
        sourceWidth = img.height * targetRatio;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        // Image is taller, crop top/bottom
        sourceHeight = img.width / targetRatio;
        sourceY = (img.height - sourceHeight) / 2;
      }

      // Set canvas to reasonable output size
      canvas.width = 768;
      canvas.height = 1024;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height
      );

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64;
  });
}

/**
 * Downloads a base64 image as a file
 */
export function downloadImage(base64: string, filename: string = 'barber-result.jpg'): void {
  const link = document.createElement('a');
  link.href = base64;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Shares an image using Web Share API if available
 */
export async function shareImage(base64: string, title: string = 'AI Barber Shot'): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    // Convert base64 to blob for sharing
    const response = await fetch(base64);
    const blob = await response.blob();
    const file = new File([blob], 'barber-result.jpg', { type: 'image/jpeg' });

    await navigator.share({
      title,
      text: 'Моя новая стрижка от AI Barber Shot',
      files: [file],
    });

    return true;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Classnames utility for conditional classes
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
