interface Props {
  label: string;
  style: {
    paddingTop: number;
    paddingBottom: number;
    gap: number;
    maxWidth: number;
    titleSize: number;
    subtitleSize: number;
    labelSize: number;
    bgColor?: string;
  };
  onChange: (style: Partial<{
    paddingTop: number;
    paddingBottom: number;
    gap: number;
    maxWidth: number;
    titleSize: number;
    subtitleSize: number;
    labelSize: number;
    bgColor?: string;
  }>) => void;
}

export default function SectionStyleEditor({ label, style, onChange }: Props) {
  return (
    <div className="border border-gray-100 rounded-md p-4 space-y-4">
      <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Padding Top (px)</label>
          <input
            type="number"
            value={style.paddingTop}
            onChange={(e) => onChange({ paddingTop: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Padding Bottom (px)</label>
          <input
            type="number"
            value={style.paddingBottom}
            onChange={(e) => onChange({ paddingBottom: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Gap (px)</label>
          <input
            type="number"
            value={style.gap}
            onChange={(e) => onChange({ gap: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Max Width (px)</label>
          <input
            type="number"
            value={style.maxWidth}
            onChange={(e) => onChange({ maxWidth: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Title Size (px)</label>
          <input
            type="number"
            value={style.titleSize}
            onChange={(e) => onChange({ titleSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Subtitle Size (px)</label>
          <input
            type="number"
            value={style.subtitleSize}
            onChange={(e) => onChange({ subtitleSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Label Size (px)</label>
          <input
            type="number"
            value={style.labelSize}
            onChange={(e) => onChange({ labelSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Màu nền (tuỳ chọn)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.bgColor || '#ffffff'}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-12 h-10 rounded-md border border-gray-200 cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={style.bgColor || ''}
              onChange={(e) => onChange({ bgColor: e.target.value || undefined })}
              placeholder="#ffffff hoặc để trống"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}