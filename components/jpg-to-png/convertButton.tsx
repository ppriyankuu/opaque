"use client";

import { useState } from "react";

interface Props {
    file: File;
}

export default function ConvertButton({ file }: Props) {
    const [isConverting, setIsConverting] = useState(false);

    const convertToPng = async () => {
        setIsConverting(true);

        try {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.src = objectUrl;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            URL.revokeObjectURL(objectUrl);

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");

            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) {
                    setIsConverting(false);
                    return;
                }

                const url = URL.createObjectURL(blob);

                const now = new Date();
                const day = String(now.getDate()).padStart(2, "0");
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const year = now.getFullYear();
                const hours = String(now.getHours()).padStart(2, "0");
                const minutes = String(now.getMinutes()).padStart(2, "0");
                const seconds = String(now.getSeconds()).padStart(2, "0");

                const filename = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}.png`;

                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();

                URL.revokeObjectURL(url);
                setIsConverting(false);
            }, "image/png");

        } catch (error) {
            console.error("Conversion failed:", error);
            setIsConverting(false);
            // Show user-friendly error message
        }
    };

    return (
        <button
            onClick={convertToPng}
            disabled={isConverting}
            className="btn btn-primary w-full"
        >
            {isConverting ? "Converting..." : "Convert to PNG"}
        </button>
    );
}