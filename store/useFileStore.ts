import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface ImageFile {
    id: string;
    file: File;
}

export interface PDFPage {
    id: string;
    pageIndex: number;       // original page index in source PDF
    fileName: string;        // source PDF file name
    dataUrl: string;         // thumbnail data URL for preview
    sourceFile?: File;       // reference to original file for export
}

interface FileState {
    imageFiles: ImageFile[];
    selectedIds: Set<string>;
    pdfBlob: Blob | null;

    // PDF-specific fields
    pdfPages: PDFPage[];
    selectedPdfPageIds: Set<string>;

    setImages: (files: File[]) => void;
    toggleSelection: (id: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    setPDFBlob: (blob: Blob | null) => void;
    clear: () => void;
    reorderImages: (fromIndex: number, toIndex: number) => void;
    setImagesOrdered: (imageFiles: ImageFile[]) => void;

    // PDF page actions
    setPDFPages: (pages: PDFPage[]) => void;
    togglePDFPageSelection: (id: string) => void;
    selectAllPDFPages: () => void;
    deselectAllPDFPages: () => void;
    reorderPDFPages: (fromIndex: number, toIndex: number) => void;
    setPDFPagesOrdered: (pages: PDFPage[]) => void;
    removeSelectedPDFPages: () => void;
    clearPDFState: () => void;
}

export const useFileStore = create<FileState>((set) => ({
    imageFiles: [],
    selectedIds: new Set(),
    pdfBlob: null,

    // PDF-specific initial state
    pdfPages: [],
    selectedPdfPageIds: new Set(),

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

    setImagesOrdered: (imageFiles) => set({ imageFiles }),

    // PDF page actions
    setPDFPages: (pages) =>
        set({ pdfPages: pages, selectedPdfPageIds: new Set(pages.map((p) => p.id)) }),

    togglePDFPageSelection: (id) =>
        set((state) => {
            const newSet = new Set(state.selectedPdfPageIds);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return { selectedPdfPageIds: newSet };
        }),

    selectAllPDFPages: () =>
        set((state) => ({
            selectedPdfPageIds: new Set(state.pdfPages.map((p) => p.id)),
        })),

    deselectAllPDFPages: () => set({ selectedPdfPageIds: new Set() }),

    reorderPDFPages: (fromIndex, toIndex) =>
        set((state) => {
            const newPages = [...state.pdfPages];
            const [moved] = newPages.splice(fromIndex, 1);
            newPages.splice(toIndex, 0, moved);
            return { pdfPages: newPages };
        }),

    setPDFPagesOrdered: (pages) => set({ pdfPages: pages }),

    removeSelectedPDFPages: () =>
        set((state) => ({
            pdfPages: state.pdfPages.filter((p) => !state.selectedPdfPageIds.has(p.id)),
            selectedPdfPageIds: new Set(),
        })),

    clearPDFState: () => set({ pdfPages: [], selectedPdfPageIds: new Set() }),
}));