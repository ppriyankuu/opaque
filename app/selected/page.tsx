"use client";

import { useFileStore } from "@/store/useFileStore";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { ImageCard } from "@/components/imageCard";

export default function SelectedPage() {
    const { images, selectedIndices, toggleSelection, selectAll, deselectAll, setPDFBlob } =
        useFileStore();
    const router = useRouter();
    const [isConverting, setIsConverting] = useState(false);

    useEffect(() => {
        if (images.length === 0) {
            router.replace("/");
        }
    }, [images, router]);

    const generatePdf = async () => {
        const selectedFiles = Array.from(selectedIndices)
            .sort((a, b) => a - b) // maintain order
            .map((i) => images[i]);

        if (selectedFiles.length === 0) return;

        setIsConverting(true);
        const pdf = new jsPDF();

        for (let i = 0; i < selectedFiles.length; i++) {
            const imgData = await fileToDataUrl(selectedFiles[i]);

            const img = new Image();
            img.src = imgData;

            await new Promise((resolve) => (img.onload = resolve));

            if (i > 0) pdf.addPage();

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = img.width;
            const imgHeight = img.height;

            // Calculate scale ratio (fit inside page)
            const widthRatio = pageWidth / imgWidth;
            const heightRatio = pageHeight / imgHeight;
            const scale = Math.min(widthRatio, heightRatio);

            const renderWidth = imgWidth * scale;
            const renderHeight = imgHeight * scale;

            // Center image
            const x = (pageWidth - renderWidth) / 2;
            const y = (pageHeight - renderHeight) / 2;

            const format =
                selectedFiles[i].type.split("/")[1].toUpperCase() === "PNG"
                    ? "PNG"
                    : "JPEG";

            pdf.addImage(
                imgData,
                format,
                x,
                y,
                renderWidth,
                renderHeight,
                undefined,
                "FAST"
            );
        }

        const blob = pdf.output("blob");
        setPDFBlob(blob);
        setIsConverting(false);
        router.push("/pdf");
    };

    const fileToDataUrl = (file: File): Promise<string> =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
        });

    const noneSelected = selectedIndices.size === 0;

    return (
        <div className="space-y-8">
            {/* Selection Controls */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="text-[15px] text-gray-400">
                    {selectedIndices.size} of {images.length} selected
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn btn-sm pt-1 btn-outline text-gray-300 border-gray-700 hover:bg-gray-800"
                        onClick={noneSelected ? selectAll : deselectAll}
                    >
                        {noneSelected ? "Select All" : "Deselect All"}
                    </button>
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((file, idx) => (
                    <ImageCard
                        key={idx}
                        file={file}
                        index={idx}
                        isSelected={selectedIndices.has(idx)}
                        onToggle={() => toggleSelection(idx)}
                    />
                ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
                <button
                    className={`btn btn-lg px-8 ${selectedIndices.size === 0
                        ? "btn-disabled bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "btn-primary"
                        }`}
                    onClick={generatePdf}
                    disabled={selectedIndices.size === 0 || isConverting}
                >
                    {isConverting ? (
                        <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Converting...
                        </>
                    ) : (
                        "Confirm & Convert"
                    )}
                </button>
            </div>
        </div>
    );
}