"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Props {
    onFileSelect: (file: File) => void;
}

export default function JpgToPngUploader({ onFileSelect }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File) => {
        if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
            setError("Only JPG / JPEG files are allowed.");
            return false;
        }
        setError("");
        return true;
    };

    const handleFile = (file: File) => {
        if (validateFile(file)) {
            onFileSelect(file);
        }
    };

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

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
        },
        []
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="relative w-full space-y-2">
            <div
                className={`flex flex-col items-center justify-center 
        w-full h-48 sm:h-56 md:h-64 
        border-2 border-dashed rounded-xl 
        transition-all duration-200 cursor-pointer
        ${isDragging
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-600 hover:border-purple-400 hover:bg-gray-900/20"
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
            >
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 text-purple-400" />

                <p className="text-sm sm:text-base md:text-lg font-medium text-white text-center px-4">
                    Click to upload or drag & drop
                </p>

                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    JPG or JPEG only
                </p>
            </div>

            <input
                type="file"
                accept="image/jpeg"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {error && (
                <p className="text-error text-xs sm:text-sm text-center">
                    {error}
                </p>
            )}
        </div>
    );
}