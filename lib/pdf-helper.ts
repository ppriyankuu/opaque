import { jsPDF } from "jspdf";

export const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
    });

export const generatePDFFromImages = async (files: File[]): Promise<Blob> => {
    const pdf = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const imgData = await fileToDataUrl(files[i]);

        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => (img.onload = resolve));

        if (i > 0) pdf.addPage();

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;

        const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const renderWidth = imgWidth * scale;
        const renderHeight = imgHeight * scale;
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        const format = files[i].type.split("/")[1].toUpperCase() === "PNG" ? "PNG" : "JPEG";

        pdf.addImage(imgData, format, x, y, renderWidth, renderHeight, undefined, "FAST");
    }

    return pdf.output("blob");
};