"use client";

import { useFileStore } from "@/store/useFileStore";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { ImageCard } from "@/components/imageCard";

export default function SelectedPage() {

    const {
        imageFiles,
        selectedIds,
        toggleSelection,
        selectAll,
        deselectAll,
        setPDFBlob,
        reorderImages,
    } = useFileStore();

    const router = useRouter();
    const [isConverting, setIsConverting] = useState(false);

    useEffect(() => {
        if (imageFiles.length === 0) {
            router.replace("/");
        }
    }, [imageFiles, router]);

    const generatePdf = async () => {
        const selectedFiles = imageFiles
            .filter((img) => selectedIds.has(img.id))
            .map((img) => img.file);

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

    const noneSelected = selectedIds.size === 0;

    return (
        <div className="space-y-8">
            {/* Selection Controls */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="text-[15px] text-gray-400">
                    {selectedIds.size} of {imageFiles.length} selected
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
                {imageFiles.map((imgFile, idx) => (
                    <ImageCard
                        key={imgFile.id}
                        file={imgFile.file}
                        id={imgFile.id}
                        isSelected={selectedIds.has(imgFile.id)}
                        onToggle={() => toggleSelection(imgFile.id)}
                        index={idx}
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", idx.toString())}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
                            const toIndex = idx;
                            if (fromIndex !== toIndex) {
                                reorderImages(fromIndex, toIndex);
                            }
                        }}
                    />))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
                <button
                    className={`btn btn-lg px-8 ${selectedIds.size === 0
                        ? "btn-disabled bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "btn-primary"
                        }`}
                    onClick={generatePdf}
                    disabled={selectedIds.size === 0 || isConverting}
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