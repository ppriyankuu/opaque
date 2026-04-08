import type { PDFPage } from '@/store/useFileStore';
import { PDFDocument } from 'pdf-lib';

// Configure pdf.js worker (client-side only)
// This must be called before using pdfjsLib
export const initPDFJS = async () => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;
    return pdfjsLib;
};

// Render a single PDF page to a data URL thumbnail
// pageNumber is 1-based (pdf.js API requirement)
export const renderPDFPage = async (
    pdfDoc: any, // pdf.js PDFDocumentProxy
    pageNumber: number,
    thumbnailWidth: number = 200
): Promise<string> => {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const scale = thumbnailWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');

    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    await page.render({ canvasContext: context, viewport: scaledViewport }).promise;

    return canvas.toDataURL('image/png');
};

// Process a single PDF file into an array of PDFPage objects
export const processPDFFile = async (
    file: File,
    thumbnailWidth: number = 200
): Promise<PDFPage[]> => {
    const pdfjsLib = await initPDFJS();

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    const pages: PDFPage[] = [];

    for (let i = 0; i < numPages; i++) {
        const dataUrl = await renderPDFPage(pdfDoc, i + 1, thumbnailWidth);
        pages.push({
            id: crypto.randomUUID(),
            pageIndex: i,
            fileName: file.name,
            dataUrl,
            sourceFile: file,
        });
    }

    return pages;
};

// Process multiple PDF files into a flat array of PDFPage objects
export const processMultiplePDFFiles = async (
    files: File[],
    thumbnailWidth: number = 200
): Promise<PDFPage[]> => {
    const allPages: PDFPage[] = [];

    for (const file of files) {
        const pages = await processPDFFile(file, thumbnailWidth);
        allPages.push(...pages);
    }

    return allPages;
};

// Build a new PDF from selected/ordered PDFPage objects
export const buildPDFFromPages = async (pages: PDFPage[]): Promise<Blob> => {
    const newPdf = await PDFDocument.create();

    // Group pages by source file to minimize copying operations
    const groupedByFile = new Map<string, PDFPage[]>();
    for (const page of pages) {
        if (!page.sourceFile) continue;
        const key = page.sourceFile.name + page.sourceFile.lastModified;
        if (!groupedByFile.has(key)) {
            groupedByFile.set(key, []);
        }
        groupedByFile.get(key)!.push(page);
    }

    // Cache loaded PDF documents to avoid re-parsing the same file
    const pdfDocCache = new Map<string, PDFDocument>();

    for (const page of pages) {
        if (!page.sourceFile) continue;

        const cacheKey = page.sourceFile.name + page.sourceFile.lastModified;
        if (!pdfDocCache.has(cacheKey)) {
            const arrayBuffer = await page.sourceFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            pdfDocCache.set(cacheKey, pdfDoc);
        }

        const sourcePdf = pdfDocCache.get(cacheKey)!;
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [page.pageIndex]);
        newPdf.addPage(copiedPage);
    }

    const pdfBytes = await newPdf.save();
    return new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
};

// Build timestamp filename
export const getTimestampFilename = (prefix: string): string => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${prefix}_${dd}-${mm}-${yyyy}_${hh}-${min}-${ss}.pdf`;
};
