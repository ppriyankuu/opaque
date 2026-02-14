"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

interface Props {
    file: File;
}

export default function CompressButton({ file }: Props) {
    const [isCompressing, setIsCompressing] = useState(false);

    const compressImage = async () => {
        setIsCompressing(true);

        try {
            const options = {
                maxSizeMB: 1, // target size
                maxWidthOrHeight: 1920, // optional resize safeguard
                useWebWorker: true,
                initialQuality: 0.8,
            };

            const compressedFile = await imageCompression(file, options);

            const url = URL.createObjectURL(compressedFile);

            // Generate timestamp filename
            const now = new Date();
            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");

            const extension = file.type === "image/png" ? "png" : "jpg";

            const filename = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}.${extension}`;

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Compression failed:", error);
        } finally {
            setIsCompressing(false);
        }
    };

    return (
        <button
            onClick={compressImage}
            disabled={isCompressing}
            className="btn btn-primary w-full"
        >
            {isCompressing ? "Compressing..." : "Compress Image"}
        </button>
    );
}