import { useState, useRef, useCallback, useEffect } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  helpText?: string;
}

function resizeImageToDataUrl(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> {
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
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function compressUntilSmall(file: File): Promise<string> {
  // Try progressively smaller sizes until base64 < 200KB
  const attempts = [
    { size: 600, quality: 0.6 },
    { size: 400, quality: 0.55 },
    { size: 300, quality: 0.5 },
  ];

  for (const attempt of attempts) {
    const dataUrl = await resizeImageToDataUrl(file, attempt.size, attempt.size, attempt.quality);
    const base64Size = Math.round(dataUrl.length * 0.75);
    if (base64Size <= 200 * 1024) {
      return dataUrl;
    }
  }

  // Last resort: 200px, quality 0.4
  return resizeImageToDataUrl(file, 200, 200, 0.4);
}

export default function ImageUpload({ value, onChange, label, helpText }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(value);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editCountRef = useRef(0);

  useEffect(() => {
    if (editCountRef.current === 0 && value !== previewUrl) {
      setPreviewUrl(value);
    }
  }, [value]);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Vui lòng chọn file ảnh');
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setErrorMsg('Ảnh quá lớn (>3MB), vui lòng chọn ảnh nhỏ hơn');
        setTimeout(() => setErrorMsg(''), 4000);
        return;
      }
      setProcessing(true);
      setErrorMsg('');
      try {
        const dataUrl = await compressUntilSmall(file);
        const base64Size = Math.round(dataUrl.length * 0.75);
        console.log('[ImageUpload] Compressed to', Math.round(base64Size / 1024), 'KB');
        editCountRef.current += 1;
        setPreviewUrl(dataUrl);
        onChange(dataUrl);
      } catch (err) {
        console.error('[ImageUpload] Process error:', (err as Error).message);
        setErrorMsg('Không thể xử lý ảnh, vui lòng thử lại');
        setTimeout(() => setErrorMsg(''), 4000);
      } finally {
        setProcessing(false);
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
        {processing ? (
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

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={previewUrl}
          onChange={(e) => {
            editCountRef.current += 1;
            setPreviewUrl(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Hoặc nhập URL ảnh"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}
      {helpText && <p className="text-xs text-gray-400">{helpText}</p>}
    </div>
  );
}