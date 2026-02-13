import { memo } from "react";
import { Check } from 'lucide-react'

export const ImageCard = memo(({
    file,
    isSelected,
    onToggle,
    index,
}: {
    file: File;
    isSelected: boolean;
    onToggle: () => void;
    index: number;
}) => {
    return (
        <div
            className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${isSelected
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-gray-900 hover:border-gray-600"
                }`}
            onClick={onToggle}
        >
            {/* Overlay checkmark */}
            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-purple-500" : "bg-black/60 group-hover:bg-gray-700"
                    }`}
            >
                {isSelected && (
                    <span className="text-white text-sm font-bold"><Check /></span>
                )}
            </div>

            {/* Image preview */}
            <div className="aspect-square w-full bg-gray-800 flex items-center justify-center p-1">
                <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="object-contain w-full h-full"
                />
            </div>

            {/* Filename */}
            <div className="p-2 bg-black/80 text-white text-xs truncate">
                {file.name.length > 20 ? `${file.name.substring(0, 18)}...` : file.name}
            </div>
        </div>
    );
});