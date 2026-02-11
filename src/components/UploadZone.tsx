'use client';

import { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { fileToBase64, cropToPortrait, compressImage } from '@/lib/utils';

interface UploadZoneProps {
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
  label?: string;
  showCrop?: boolean;
}

export function UploadZone({
  photo,
  onPhotoChange,
  label = 'Загрузите фото',
  showCrop = true,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = async (base64: string) => {
    setIsProcessing(true);
    try {
      let processed = base64;
      if (showCrop) {
        processed = await cropToPortrait(processed);
      }
      processed = await compressImage(processed);
      onPhotoChange(processed);
    } catch (error) {
      console.error('Error processing image:', error);
      onPhotoChange(base64);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      await processImage(base64);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Ошибка при чтении файла');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 1280 },
          aspectRatio: { ideal: 1 },
        },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);

      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Не удалось открыть камеру. Проверьте разрешения.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror the image for selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    closeCamera();
    await processImage(base64);
  };

  const clearPhoto = () => {
    onPhotoChange(null);
  };

  // Camera mode view
  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="relative flex-1">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Portrait guide overlay */}
          <div className="absolute inset-0 viewfinder-overlay pointer-events-none">
            <div className="absolute inset-x-8 inset-y-16 border-2 border-white/30 rounded-3xl" />
          </div>

          {/* Close button */}
          <button
            onClick={closeCamera}
            className="absolute top-4 right-4 p-3 bg-black/50 rounded-full text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Capture button */}
        <div className="bg-black p-6 flex justify-center">
          <button
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 rounded-full border-4 border-black" />
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Photo preview mode
  if (photo) {
    return (
      <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)]">
        <img
          src={photo}
          alt="Загруженное фото"
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={clearPhoto}
            icon={<RefreshCw size={18} />}
            fullWidth
          >
            Заменить
          </Button>
        </div>
      </div>
    );
  }

  // Upload mode
  return (
    <div className="space-y-4">
      <p className="text-center text-[var(--muted)]">{label}</p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          aspect-[3/4] max-w-sm mx-auto rounded-2xl border-2 border-dashed
          flex flex-col items-center justify-center gap-4 p-6
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-[var(--accent)] bg-[var(--accent)]/10'
            : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        {isProcessing ? (
          <>
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--muted)]">Обработка...</p>
          </>
        ) : (
          <>
            <Upload size={48} className="text-[var(--accent)]" />
            <p className="text-center text-sm">
              Нажмите или перетащите фото сюда
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex gap-3 max-w-sm mx-auto">
        <Button
          variant="primary"
          size="lg"
          onClick={openCamera}
          icon={<Camera size={22} />}
          fullWidth
        >
          Камера
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => fileInputRef.current?.click()}
          icon={<Upload size={22} />}
          fullWidth
        >
          Галерея
        </Button>
      </div>
    </div>
  );
}
