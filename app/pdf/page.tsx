"use client";

import { useFileStore } from "@/store/useFileStore";
import imageCompression from "browser-image-compression";
import { jsPDF } from "jspdf";
import { useState } from "react";

export default function PdfPage() {
    const { pdfBlob, images } = useFileStore();
    const [isCompressing, setIsCompressing] = useState(false);

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}.pdf`;

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

    const downloadCompressed = async () => {
        if (images.length === 0) return;

        setIsCompressing(true);
        try {
            const pdf = new jsPDF();
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
                fileType: "image/jpeg",
            };

            for (let i = 0; i < images.length; i++) {
                const compressedFile = await imageCompression(images[i], options);
                const imgData = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(compressedFile);
                });

                if (i > 0) pdf.addPage();
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
            }

            pdf.save(`compressed_${fileName}`);
        } finally {
            setIsCompressing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-neutral-950 border border-gray-700 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Your PDF is ready</h2>
                    <p className="text-purple-400 font-mono text-sm tracking-wide">{fileName}</p>
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
                        disabled={isCompressing || images.length === 0}
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