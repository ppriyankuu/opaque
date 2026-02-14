"use client";

import CompressButton from "@/components/compress/compressButton";
import ImageCompressionUploader from "@/components/compress/imgToCompressUploader";
import ImagePreview from "@/components/jpg-to-png/imagePreview";
import { useState } from "react";

export default function ImageCompressionPage() {
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="card w-full max-w-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-8 space-y-6">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">
                        Image Compression Tool
                    </h1>

                    <p className="text-gray-400 text-sm md:text-base">
                        Compress PNG and JPG images to reduce file size.
                        <br />
                        100% local. No uploads. No tracking.
                    </p>
                </div>

                {!file && (
                    <ImageCompressionUploader onFileSelect={setFile} />
                )}

                {file && (
                    <>
                        <ImagePreview file={file} />

                        <CompressButton file={file} />

                        <button
                            onClick={() => setFile(null)}
                            className="btn btn-neutral border py-5 border-primary btn-sm w-full"
                        >
                            Choose another image
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
