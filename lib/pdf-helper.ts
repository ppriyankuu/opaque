import { jsPDF } from "jspdf";
import { ImageFile } from "@/store/useFileStore";

export const generatePdfFromImages = async (images: ImageFile[]): Promise<Blob> => {
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < images.length; i++) {
        const imgData = await fileToDataUrl(images[i].file);
        const imgProps = await getImageProps(imgData);

        if (i > 0) pdf.addPage();

        // Calculate dimensions to fit page while maintaining aspect ratio
        const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
        const width = imgProps.width * ratio;
        const height = imgProps.height * ratio;

        // Center the image
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(imgData, 'JPEG', x, y, width, height, undefined, 'FAST');
    }

    return pdf.output("blob");
};

const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
    });

const getImageProps = (url: string): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = url;
    });