"use client";

import { InvalidFileModal } from "@/components/img-to-pdf/invalidFileModal";
import { FileUpload } from "@/components/img-to-pdf/upload";
import { useFileStore } from "@/store/useFileStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export default function HomePage() {
    const setImages = useFileStore((state) => state.setImages);
    const router = useRouter();

    const [invalidFiles, setInvalidFiles] = useState<File[]>([]);
    const [showModal, setShowModal] = useState(false);

    const handleFilesSelect = (files: File[]) => {
        const validFiles = files.filter((file) =>
            ALLOWED_TYPES.includes(file.type)
        );

        const rejectedFiles = files.filter(
            (file) => !ALLOWED_TYPES.includes(file.type)
        );

        if (rejectedFiles.length > 0) {
            setInvalidFiles(rejectedFiles);
            setShowModal(true);
            return;
        }

        setImages(validFiles);
        router.push("/img-to-pdf/selected");
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <div className="card w-full max-w-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-8 space-y-6">

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">
                            Images to PDF Converter
                        </h1>

                        <p className="text-gray-400 text-sm md:text-base">
                            Convert multiple PNG or JPG images into one PDF.
                            <br />
                            100% local. No uploads. No tracking.
                        </p>
                    </div>

                    <FileUpload onFilesSelect={handleFilesSelect} />
                </div>
            </div>

            <InvalidFileModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                invalidFiles={invalidFiles}
            />
        </>
    );
}