"use client";

import React, { useEffect, useRef, useState } from 'react';

type Preview = { id: string; file?: File; url: string };

export default function ImageUploader({
  maxFiles = 10,
  maxSizeMB = 5,
  initialImages = [],
  onChange,
  productId,
}: {
  maxFiles?: number;
  maxSizeMB?: number;
  initialImages?: string[]; // URLs
  onChange?: (files: File[] | null, previews: string[]) => void;
  productId?: string | null;
}) {
  const [previews, setPreviews] = useState<Preview[]>(
    initialImages.map((u, i) => ({ id: `init-${i}`, url: u }))
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    // notify parent when previews change
    const files = previews.map((p) => p.file).filter(Boolean) as File[];
    onChange?.(files.length ? files : null, previews.map((p) => p.url));
    // cleanup when component unmounts is handled per-object when files are removed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const allowed = arr.filter((f) => f.type.startsWith('image/'));
    const maxBytes = maxSizeMB * 1024 * 1024;
    const validated = allowed.filter((f) => f.size <= maxBytes);
    if (validated.length !== allowed.length) alert(`Some files were skipped (invalid type or too large > ${maxSizeMB}MB)`);

    const slots = Math.max(0, maxFiles - previews.length);
    const toAdd = validated.slice(0, slots);
    const newPreviews = toAdd.map((f) => ({ id: `${Date.now()}-${f.name}`, file: f, url: URL.createObjectURL(f) }));
    setPreviews((p) => [...p, ...newPreviews]);
  };

  const removeAt = (index: number) => {
    // Snapshot current preview to handle async deletion outside setter
    const removed = previews[index];
    const copy = previews.slice();
    copy.splice(index, 1);
    setPreviews(copy);

    // if it's an existing URL and productId provided, call DELETE endpoint
    (async () => {
      if (removed && !removed.file && productId) {
        try {
          const encoded = encodeURIComponent(removed.url);
          const res = await fetch(`/api/supplier/products/${productId}/images?imageUrl=${encoded}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete image');
        } catch (err) {
          console.error('Failed to delete remote image', err);
          alert('Failed to delete image on server');
        }
      } else if (removed?.file) {
        URL.revokeObjectURL(removed.url);
      }
    })();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDropReorder = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === undefined) return;
    setPreviews((prev) => {
      const copy = prev.slice();
      const [moved] = copy.splice(from, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    dragIndexRef.current = null;
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const saveOrder = async () => {
    if (!productId) return alert('Product not saved yet');
    const imageUrls = previews.map((p) => p.url);
    try {
      const res = await fetch(`/api/supplier/products/${productId}/images/reorder`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrls }) });
      if (!res.ok) throw new Error('Reorder failed');
      alert('Order saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save order');
    }
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 rounded p-4 bg-gray-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-300">Drag & drop images here</div>
            <div className="text-xs text-gray-500">JPEG, PNG. Max {maxSizeMB}MB each. Up to {maxFiles} images.</div>
          </div>
          <div>
            <button onClick={openFilePicker} className="px-3 py-1 bg-gray-700 rounded">Choose files</button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

        <div className="mt-3 grid grid-cols-4 gap-3">
          {previews.map((p, i) => (
            <div
              key={p.id}
              draggable
              onDragStart={onDragStart(i)}
              onDragOver={onDragOver(i)}
              onDrop={onDropReorder(i)}
              className="relative bg-gray-700 rounded overflow-hidden h-28 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`preview-${i}`} className="object-cover w-full h-full" />
              <div className="absolute top-1 right-1 flex gap-1">
                <button onClick={() => removeAt(i)} className="text-xs px-2 py-1 bg-red-600 rounded">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={saveOrder} className="px-3 py-1 bg-blue-600 rounded">Save Order</button>
          <div className="text-sm text-gray-400">Drag to reorder; press Save Order to persist (product must exist).</div>
        </div>
      </div>
    </div>
  );
}
