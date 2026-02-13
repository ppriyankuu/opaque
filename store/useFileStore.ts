import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface ImageFile {
    id: string;
    file: File;
}

interface FileState {
    imageFiles: ImageFile[];
    selectedIds: Set<string>;
    pdfBlob: Blob | null;

    setImages: (files: File[]) => void;
    toggleSelection: (id: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    setPDFBlob: (blob: Blob | null) => void;
    clear: () => void;
    reorderImages: (fromIndex: number, toIndex: number) => void;
}

export const useFileStore = create<FileState>((set) => ({
    imageFiles: [],
    selectedIds: new Set(),
    pdfBlob: null,

    setImages: (files) => {
        const imageFiles = files.map((file) => ({
            id: uuidv4(),
            file,
        }));
        const selectedIds = new Set(imageFiles.map((img) => img.id));
        set({ imageFiles, selectedIds });
    },

    toggleSelection: (id) =>
        set((state) => {
            const newSet = new Set(state.selectedIds);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return { selectedIds: newSet };
        }),

    selectAll: () =>
        set((state) => ({
            selectedIds: new Set(state.imageFiles.map((img) => img.id)),
        })),

    deselectAll: () => set({ selectedIds: new Set() }),

    setPDFBlob: (pdfBlob) => set({ pdfBlob }),

    clear: () => set({ imageFiles: [], selectedIds: new Set(), pdfBlob: null }),

    reorderImages: (fromIndex, toIndex) =>
        set((state) => {
            const newImages = [...state.imageFiles];
            const [moved] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, moved);
            return { imageFiles: newImages };
        }),
}));