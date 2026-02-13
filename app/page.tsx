"use client";

import { InvalidFileModal } from "@/components/invalidFileModal";
import { FileUpload } from "@/components/upload";
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
    router.push("/selected");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="card w-full max-w-2xl bg-black border border-gray-800 p-8 md:p-10 text-center shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Images to PDF
          </h1>

          <p className="mb-6 max-w-xl mx-auto leading-relaxed 
                 text-sm sm:text-base md:text-lg text-gray-300">

            <span className="block">
              Convert multiple images into
              <span className="text-secondary font-semibold"> one PDF </span> —
              instantly and securely.
            </span>

            <span className="block">
              <span className="text-secondary font-semibold">100% browser-based. </span>
              No uploads. No tracking.
            </span>

            <span className="block">
              Download a
              <span className="text-secondary font-semibold"> compressed version </span>
              to reduce file size.
            </span>

          </p>

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