import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export function FileUpload({ onFilesSelect }: { onFilesSelect: (files: File[]) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            onFilesSelect(files);
        }
    }, [onFilesSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            onFilesSelect(files);
        }
    };

    return (
        <div className="relative w-full">
            <div
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200 ${isDragging
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-gray-600 hover:border-purple-400 hover:bg-gray-900/20"
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
            >
                <Upload className="w-12 h-12 mb-4 text-purple-400" />
                <p className="text-lg font-medium text-white">
                    Click to upload or drag & drop images
                </p>
                <p className="text-sm text-gray-400 mt-2">Supports JPG, JPEG, & PNG</p>
            </div>

            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
}
