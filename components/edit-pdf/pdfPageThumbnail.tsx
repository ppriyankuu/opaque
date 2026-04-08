import { memo } from "react";
import { Check, GripHorizontal, Trash2 } from 'lucide-react';
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export const PDFPageThumbnail = memo((
    {
        id,
        dataUrl,
        fileName,
        isSelected,
        onToggle,
        pageNumber,
        isDragging = false,
        dragAttributes,
        dragListeners,
    }: {
        id: string;
        dataUrl: string;
        fileName: string;
        isSelected: boolean;
        onToggle: () => void;
        pageNumber: number;
        isDragging?: boolean;
        dragAttributes: DraggableAttributes;
        dragListeners: SyntheticListenerMap | undefined;
    }
) => {
    return (
        <div
            className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200
    ${isDragging ? "ring-2 ring-secondary" : ""}
    ${isSelected
                    ? "border-secondary bg-purple-500/10"
                    : "border-gray-700 bg-gray-900 hover:border-gray-600"
                }`}
            onClick={onToggle}
        >
            {/* Drag Handle */}
            <div
                {...dragAttributes}
                {...dragListeners}
                className="absolute top-2 left-2 z-10 p-1 bg-black/60 rounded-md cursor-grab active:cursor-grabbing"
            >
                <GripHorizontal className="w-4 h-4 text-white" />
            </div>

            {/* Overlay checkmark */}
            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-secondary" : "bg-black/60 group-hover:bg-gray-700"
                    }`}
            >
                {isSelected && <Check className="text-white w-3 h-3" />}
            </div>

            {/* Page thumbnail */}
            <div className="aspect-square w-full bg-gray-800 flex items-center justify-center p-1">
                <img
                    src={dataUrl}
                    alt={`Page ${pageNumber}`}
                    className="object-contain w-full h-full"
                />
            </div>

            {/* Page info */}
            <div className="p-2 bg-black/80 text-white text-xs flex justify-between items-center gap-1">
                <span className="truncate" title={fileName}>
                    {fileName.length > 16 ? `${fileName.substring(0, 14)}...` : fileName}
                </span>
                <span className="text-gray-400 shrink-0">p.{pageNumber}</span>
            </div>
        </div>
    );
});
