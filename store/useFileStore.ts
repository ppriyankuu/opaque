import { create } from 'zustand';

export interface ImageFile {
    file: File
};

interface FileState {
    images: File[];
    selectedIndices: Set<number>;
    pdfBlob: Blob | null;
    setImages: (files: File[]) => void;
    toggleSelection: (index: number) => void;
    selectAll: () => void;
    deselectAll: () => void;
    setPDFBlob: (blob: Blob | null) => void;
    clear: () => void;
}

export const useFileStore = create<FileState>((set, _get) => ({
    images: [],
    selectedIndices: new Set(),
    pdfBlob: null,

    setImages: (images) => set({ images, selectedIndices: new Set(images.map((_, i) => i)) }),

    toggleSelection: (index) =>
        set((state) => {
            const newSet = new Set(state.selectedIndices);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return { selectedIndices: newSet };
        }),

    selectAll: () =>
        set((state) => ({ selectedIndices: new Set(state.images.map((_, i) => i)) })),

    deselectAll: () => set({ selectedIndices: new Set() }),

    setPDFBlob: (pdfBlob) => set({ pdfBlob }),
    clear: () => set({ images: [], selectedIndices: new Set(), pdfBlob: null }),
}));