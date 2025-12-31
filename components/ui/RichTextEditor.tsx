"use client";

import React, { useEffect, useRef } from 'react';

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || '';
  }, [value]);

  return (
    <div>
      <div className="border rounded bg-gray-900 p-2 mb-2">
        <button type="button" onClick={() => document.execCommand('bold')} className="px-2 py-1 bg-gray-800 rounded mr-1">B</button>
        <button type="button" onClick={() => document.execCommand('italic')} className="px-2 py-1 bg-gray-800 rounded mr-1">I</button>
        <button type="button" onClick={() => document.execCommand('insertUnorderedList')} className="px-2 py-1 bg-gray-800 rounded mr-1">• List</button>
        <button type="button" onClick={() => { const url = prompt('URL'); if (url) document.execCommand('createLink', false, url); }} className="px-2 py-1 bg-gray-800 rounded">Link</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="min-h-[120px] p-3 rounded bg-gray-800"
      />
    </div>
  );
}
