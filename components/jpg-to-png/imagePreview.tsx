"use client";

import { useEffect, useState } from "react";

interface Props {
  file: File;
}

export default function ImagePreview({ file }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
      setPreview(null); // Also clear the preview state on cleanup
    };
  }, [file]);

  // Don't render anything if preview is null
  if (!preview) {
    return (
      <div className="flex flex-col items-center space-y-3">
        <p className="text-sm text-gray-400">Preview</p>
        <div className="max-h-80 rounded-lg border border-neutral-700 flex items-center justify-center p-8">
          <p className="text-gray-500">Loading preview...</p>
        </div>
        <p className="text-xs text-gray-500">
          {file.name} • {(file.size / 1024).toFixed(2)} KB
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <p className="text-sm text-gray-400">Preview</p>
      <img
        src={preview}
        alt="Preview"
        className="max-h-80 rounded-lg border border-neutral-700"
      />
      <p className="text-xs text-gray-500">
        {file.name} • {(file.size / 1024).toFixed(2)} KB
      </p>
    </div>
  );
}
