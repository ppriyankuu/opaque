"use client";

import ConvertButton from "@/components/jpg-to-png/convertButton";
import ImagePreview from "@/components/jpg-to-png/imagePreview";
import JpgToPngUploader from "@/components/jpg-to-png/jpgToPngUploader";
import { useState } from "react";

export default function JpgToPngPage() {
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="card w-full max-w-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">JPG to PNG Converter</h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Convert JPG/JPEG images to PNG. 100% local. No uploads.
                    </p>
                </div>

                {!file && <JpgToPngUploader onFileSelect={setFile} />}

                {file && (
                    <>
                        <ImagePreview file={file} />
                        <ConvertButton file={file} />
                        <button
                            onClick={() => setFile(null)}
                            className="btn btn-neutral border-primary py-5 btn-sm btn-w-full"
                        >
                            Choose another image
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}