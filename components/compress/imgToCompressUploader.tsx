"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Props {
    onFileSelect: (file: File) => void;
}

export default function ImageCompressionUploader({ onFileSelect }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File) => {
        if (
            !file.type.includes("jpeg") &&
            !file.type.includes("jpg") &&
            !file.type.includes("png")
        ) {
            setError("Only PNG, JPG or JPEG files are allowed.");
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
                        ? "border-primary bg-primary/10"
                        : "border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/40"
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
            >
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:h-12 md:w-12 mb-3 text-primary" />

                <p className="text-sm sm:text-base md:text-lg font-medium text-white text-center px-4">
                    Click to upload or drag & drop
                </p>

                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    PNG, JPG or JPEG
                </p>
            </div>

            <input
                type="file"
                accept="image/png, image/jpeg"
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
