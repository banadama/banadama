'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSize?: number; // in bytes
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP files are allowed');
      return false;
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList) => {
    setError('');
    
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    
    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!validateFile(file)) {
          continue;
        }

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        newImages.push(previewUrl);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="text-4xl mb-2">📸</div>
        <p className="text-gray-700 font-medium mb-1">
          Drag and drop images here or click to select
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Support JPEG, PNG, WebP • Max 5MB per file • {maxImages - images.length} slots remaining
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {uploading ? 'Uploading...' : 'Choose Files'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-700">
              Images ({images.length}/{maxImages})
            </p>
            {images.length > 1 && (
              <p className="text-xs text-gray-500">Drag to reorder • First image is primary</p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {images.map((image, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => {
                  // Handle drag start
                }}
                className="relative group border rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-move hover:shadow-lg transition-shadow"
              >
                {/* Image Preview */}
                {image.startsWith('blob:') || image.startsWith('data:') ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    Preview
                  </div>
                ) : (
                  <img
                    src={image}
                    alt={`Product image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Primary Badge */}
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  ×
                </button>

                {/* Image Number */}
                <div className="absolute bottom-2 right-2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  #{i + 1}
                </div>
              </div>
            ))}
          </div>

          {images.length < 3 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                💡 Tip: Upload at least 3 images for better product visibility
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
