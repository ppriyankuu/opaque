"use client";

import { generatePDFFromImages } from "@/lib/pdf-helper";
import { useFileStore } from "@/store/useFileStore";
import imageCompression from "browser-image-compression";
import { useState } from "react";

export default function PdfPage() {
    const { pdfBlob, imageFiles } = useFileStore();
    const [isCompressing, setIsCompressing] = useState(false);

    // ---------- Filename ----------
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}.pdf`;

    // ---------- Download Original ----------
    const downloadStandard = () => {
        if (!pdfBlob) return;

        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // ---------- Download Compressed ----------
    const downloadCompressed = async () => {
        if (imageFiles.length === 0) return;

        setIsCompressing(true);

        try {
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                fileType: "image/jpeg",
            };

            // 1️⃣ Compress all images first
            const compressedFiles = await Promise.all(
                imageFiles.map((img) =>
                    imageCompression(img.file, compressionOptions)
                )
            );

            // 2️⃣ Reuse the same PDF generator
            const compressedBlob = await generatePDFFromImages(
                compressedFiles
            );

            // 3️⃣ Trigger download
            const url = URL.createObjectURL(compressedBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `compressed_${fileName}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } finally {
            setIsCompressing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-neutral-950 border border-gray-700 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Your PDF is ready
                    </h2>
                    <p className="text-purple-400 font-mono text-sm tracking-wide">
                        {fileName}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        className="btn btn-outline btn-block text-white border-gray-700 hover:border-purple-500 hover:bg-gray-800 transition-colors"
                        onClick={downloadStandard}
                        disabled={!pdfBlob}
                    >
                        Download Original
                    </button>

                    <button
                        className={`btn btn-primary btn-block ${isCompressing ? "opacity-80 cursor-not-allowed" : ""
                            }`}
                        onClick={downloadCompressed}
                        disabled={isCompressing || imageFiles.length === 0}
                    >
                        {isCompressing ? (
                            <>
                                <span className="loading loading-spinner loading-sm mr-2"></span>
                                Compressing...
                            </>
                        ) : (
                            "Download Compressed (Smaller Size)"
                        )}
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
                    🔒 All processing happened in your browser — no files were uploaded or stored.
                </p>
            </div>
        </div>
    );
}
