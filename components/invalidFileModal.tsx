import { useEffect, useRef } from "react";

interface InvalidFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    invalidFiles: File[];
}

export function InvalidFileModal({
    isOpen,
    onClose,
    invalidFiles
}: InvalidFileModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }

        const handleCancel = (e: Event) => {
            e.preventDefault();
            onClose();
        };

        dialog.addEventListener("cancel", handleCancel);
        return () => dialog.removeEventListener("cancel", handleCancel);
    }, [isOpen, onClose]);

    return (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box bg-black border border-gray-800">
                <h3 className="font-bold text-lg text-error">
                    Unsupported File Type
                </h3>

                <p className="py-4 text-gray-300">
                    Only <span className="font-semibold text-secondary">PNG, JPG, and JPEG</span> files are allowed.
                </p>

                <div className="bg-base-200 rounded-lg p-3 text-sm text-gray-400 max-h-40 overflow-auto">
                    {invalidFiles.map((file) => (
                        <div key={file.name}>{file.name}</div>
                    ))}
                </div>

                <div className="modal-action">
                    <button className="btn btn-primary" onClick={onClose}>
                        Got it
                    </button>
                </div>
            </div>
        </dialog>
    )
}