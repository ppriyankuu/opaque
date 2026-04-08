"use client";

import { useFileStore } from "@/store/useFileStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PDFUploader } from "@/components/merge-pdf/pdfUploader";
import { processMultiplePDFFiles, getTimestampFilename, buildPDFFromPages } from "@/lib/pdf-utils";

import {
    PointerSensor,
    KeyboardSensor,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors,
    DndContext,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePDFPage } from "@/components/merge-pdf/sortablePdfPage";
import { Download, Loader2, ArrowLeft } from "lucide-react";

export default function MergePDFPage() {
    const {
        pdfPages,
        selectedPdfPageIds,
        setPDFPages,
        togglePDFPageSelection,
        selectAllPDFPages,
        deselectAllPDFPages,
        setPDFPagesOrdered,
        clearPDFState,
    } = useFileStore();

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearPDFState();
        };
    }, [clearPDFState]);

    const handleFilesSelect = async (files: File[]) => {
        const pdfFiles = files.filter((f) => f.type === "application/pdf");
        if (pdfFiles.length === 0) return;

        setIsLoading(true);
        try {
            const pages = await processMultiplePDFFiles(pdfFiles);
            setPDFPages(pages);
        } catch (error) {
            console.error("Failed to process PDFs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemovePage = (id: string) => {
        // If the page was selected, remove it from selection too
        setPDFPagesOrdered(pdfPages.filter((p) => p.id !== id));
        // Selection is handled by filtering in export
    };

    const handleExport = async () => {
        const selectedPages = pdfPages.filter((p) => selectedPdfPageIds.has(p.id));
        if (selectedPages.length === 0) return;

        setIsExporting(true);
        try {
            const blob = await buildPDFFromPages(selectedPages);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = getTimestampFilename("merged");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    // dnd-kit sensors
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = pdfPages.findIndex((p) => p.id === active.id);
        const newIndex = pdfPages.findIndex((p) => p.id === over.id);

        const reordered = arrayMove(pdfPages, oldIndex, newIndex);
        setPDFPagesOrdered(reordered);
    };

    const hasPages = pdfPages.length > 0;
    const noneSelected = selectedPdfPageIds.size === 0;

    return (
        <>
            {/* Upload Section */}
            {!hasPages && !isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                    <div className="card w-full max-w-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-8 space-y-6">

                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold">
                                Merge PDFs
                            </h1>

                            <p className="text-gray-400 text-sm md:text-base">
                                Combine multiple PDFs, rearrange pages, and export the merged result.
                                <br />
                                100% local. No uploads. No tracking.
                            </p>
                        </div>

                        <PDFUploader onFilesSelect={handleFilesSelect} />
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
                    <p className="text-gray-400">Processing PDFs...</p>
                </div>
            )}

            {/* Page Grid + Actions */}
            {hasPages && !isLoading && (
                <>
                    {/* Back + Selection Controls */}
                    <div className="flex flex-wrap gap-3 mb-5 justify-between items-center">
                        <button
                            onClick={() => {
                                clearPDFState();
                                router.push("/");
                            }}
                            className="btn btn-ghost btn-sm text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
                        </button>
                        <div className="text-[15px] text-gray-400">
                            {selectedPdfPageIds.size} of {pdfPages.length} pages selected
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="btn btn-sm btn-outline text-gray-300 border-gray-700 hover:bg-gray-800"
                                onClick={noneSelected ? selectAllPDFPages : deselectAllPDFPages}
                            >
                                {noneSelected ? "Select All" : "Deselect All"}
                            </button>
                        </div>
                    </div>

                    {/* Draggable Page Grid */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={pdfPages.map((p) => p.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {pdfPages.map((page, index) => (
                                    <SortablePDFPage
                                        key={page.id}
                                        id={page.id}
                                        dataUrl={page.dataUrl}
                                        fileName={page.fileName}
                                        isSelected={selectedPdfPageIds.has(page.id)}
                                        onToggle={() => togglePDFPageSelection(page.id)}
                                        onRemove={() => handleRemovePage(page.id)}
                                        pageNumber={index + 1}
                                    />
                                ))}
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeId ? (
                                (() => {
                                    const page = pdfPages.find((p) => p.id === activeId);
                                    return page ? (
                                        <div className="cursor-grabbing">
                                            <SortablePDFPage
                                                id={activeId}
                                                dataUrl={page.dataUrl}
                                                fileName={page.fileName}
                                                isSelected={false}
                                                onToggle={() => { }}
                                                onRemove={() => { }}
                                                pageNumber={0}
                                            />
                                        </div>
                                    ) : null;
                                })()
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    {/* Export Button */}
                    <div className="flex justify-center pt-4">
                        <button
                            className={`btn btn-lg px-8 ${noneSelected || isExporting
                                ? "btn-disabled bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "btn-secondary"
                                }`}
                            onClick={handleExport}
                            disabled={noneSelected || isExporting}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Merged PDF ({selectedPdfPageIds.size} pages)
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
