import React from "react";
import { useFormContext } from "react-hook-form";

export const ImagePreview = ({title, onRemove }) => {
  const { watch } = useFormContext();
  const imageUrl = watch("store_logo");

  return (
    <div className="relative w-full mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Image */}
      <img
        src={imageUrl}
        alt={title || "Preview"}
        className="w-full h-64 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
        <button
          onClick={onRemove}
          type="button"
          className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Remove
        </button>
      </div>

      {/* Info */}
      {title && (
        <div className="p-4">
          <h4 className="text-lg font-semibold text-slate-800 truncate">
            {title}
          </h4>
        </div>
      )}
    </div>
  );
};
