import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PDFPageThumbnail } from './pdfPageThumbnail';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export function SortablePDFPage({
    id,
    dataUrl,
    fileName,
    isSelected,
    onToggle,
    onRemove,
    pageNumber,
}: {
    id: string;
    dataUrl: string;
    fileName: string;
    isSelected: boolean;
    onToggle: () => void;
    onRemove: () => void;
    pageNumber: number;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <PDFPageThumbnail
                id={id}
                dataUrl={dataUrl}
                fileName={fileName}
                isSelected={isSelected}
                onToggle={onToggle}
                onRemove={onRemove}
                pageNumber={pageNumber}
                isDragging={isDragging}
                dragAttributes={attributes as DraggableAttributes}
                dragListeners={listeners as SyntheticListenerMap | undefined}
            />
        </div>
    );
}
