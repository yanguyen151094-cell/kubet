import { useState, useRef, useCallback, useEffect } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  helpText?: string;
}

function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ value, onChange, label, helpText }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(value);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview with prop value when it changes externally (and is different)
  useEffect(() => {
    if (value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setUploading(true);
      try {
        const dataUrl = await resizeImage(file, 1200, 1200);
        setPreviewUrl(dataUrl);
        onChange(dataUrl);
      } catch {
        // ignore
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {uploading ? (
          <span className="text-sm text-gray-500">Đang xử lý ảnh...</span>
        ) : previewUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img src={previewUrl} alt="Preview" className="h-20 w-auto object-contain rounded-md" />
            <span className="text-xs text-gray-500">Nhấn để thay đổi ảnh</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">
              <i className="ri-upload-cloud-2-line w-6 h-6 flex items-center justify-center" />
            </span>
            <span className="text-sm text-gray-500">Kéo thả hoặc nhấn để chọn ảnh</span>
          </div>
        )}
      </div>
      {previewUrl && !previewUrl.startsWith('data:') && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={previewUrl}
            onChange={(e) => {
              setPreviewUrl(e.target.value);
              onChange(e.target.value);
            }}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      )}
      {previewUrl && previewUrl.startsWith('data:') && (
        <p className="text-xs text-gray-400">Ảnh đã được lưu dưới dạng base64 (tự động resize)</p>
      )}
      {helpText && <p className="text-xs text-gray-400">{helpText}</p>}
    </div>
  );
}