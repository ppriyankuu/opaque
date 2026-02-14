"use client";

import { useFileStore } from "@/store/useFileStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { SortableImageCard } from "@/components/img-to-pdf/sortableImageCard";
import { generatePDFFromImages } from "@/lib/pdf-helper";

export default function SelectedPage() {
    const {
        imageFiles,
        selectedIds,
        toggleSelection,
        selectAll,
        deselectAll,
        setPDFBlob,
        setImagesOrdered,
    } = useFileStore();

    const router = useRouter();
    const [isConverting, setIsConverting] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

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
        try {
            const blob = await generatePDFFromImages(selectedFiles);
            setPDFBlob(blob);
            router.push("/img-to-pdf/pdf");
        } catch (error) {
            console.error("PDF generation failed:", error);
            // Handle error appropriately
        } finally {
            setIsConverting(false);
        }
    };

    const noneSelected = selectedIds.size === 0;

    // dnd-kit sensors
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100, // press delay before drag starts
                tolerance: 5, // movement tolerance
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

        const oldIndex = imageFiles.findIndex((img) => img.id === active.id);
        const newIndex = imageFiles.findIndex((img) => img.id === over.id);

        const reordered = arrayMove(imageFiles, oldIndex, newIndex);
        setImagesOrdered(reordered);
    };

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

            {/* Draggable Image Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={imageFiles.map((img) => img.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {imageFiles.map((imgFile) => (
                            <SortableImageCard
                                key={imgFile.id}
                                id={imgFile.id}
                                file={imgFile.file}
                                isSelected={selectedIds.has(imgFile.id)}
                                onToggle={() => toggleSelection(imgFile.id)}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeId ? (
                        <div className="cursor-grabbing">
                            <SortableImageCard
                                id={activeId}
                                file={imageFiles.find((f) => f.id === activeId)?.file!}
                                isSelected={false}
                                onToggle={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
                <button
                    className={`btn btn-lg px-8 ${noneSelected || isConverting
                        ? "btn-disabled bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "btn-secondary"
                        }`}
                    onClick={generatePdf}
                    disabled={noneSelected || isConverting}
                >
                    {isConverting ? (
                        <>
                            <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
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