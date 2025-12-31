"use client";

import React, { useEffect, useState } from 'react';

type Attr = { name: string; values: string[] };
type Variant = {
  id: string;
  name: string;
  sku?: string;
  price?: number | null;
  stock?: number | null;
  attributes: Record<string, string>;
};

function cartesian(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>(
    (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
    [[]]
  );
}

export default function VariantManager({
  initialAttributes = [],
  initialVariants = [],
  onAttributesChange,
  onVariantsChange,
}: {
  initialAttributes?: Attr[];
  initialVariants?: Variant[];
  onAttributesChange?: (attrs: Attr[]) => void;
  onVariantsChange?: (variants: Variant[]) => void;
}) {
  const [attributes, setAttributes] = useState<Attr[]>(initialAttributes);
  const [variants, setVariants] = useState<Variant[]>(initialVariants);

  useEffect(() => onAttributesChange?.(attributes), [attributes, onAttributesChange]);
  useEffect(() => onVariantsChange?.(variants), [variants, onVariantsChange]);

  const addAttribute = () => setAttributes((s) => [...s, { name: 'Attribute', values: [''] }]);
  const removeAttribute = (idx: number) => setAttributes((s) => s.filter((_, i) => i !== idx));
  const updateAttrName = (idx: number, name: string) => setAttributes((s) => s.map((a, i) => (i === idx ? { ...a, name } : a)));
  const addAttrValue = (idx: number) => setAttributes((s) => s.map((a, i) => (i === idx ? { ...a, values: [...a.values, ''] } : a)));
  const updateAttrValue = (attrIdx: number, valIdx: number, val: string) =>
    setAttributes((s) => s.map((a, i) => (i === attrIdx ? { ...a, values: a.values.map((v, vi) => (vi === valIdx ? val : v)) } : a)));
  const removeAttrValue = (attrIdx: number, valIdx: number) =>
    setAttributes((s) => s.map((a, i) => (i === attrIdx ? { ...a, values: a.values.filter((_, vi) => vi !== valIdx) } : a)));

  const generateVariants = () => {
    if (!attributes.length) return;
    const names = attributes.map((a) => a.name || 'Attr');
    const valueLists = attributes.map((a) => a.values.filter(Boolean));
    if (valueLists.some((v) => v.length === 0)) return alert('All attributes must have at least one value');

    const combos = cartesian(valueLists);
    const newVariants: Variant[] = combos.map((combo, idx) => {
      const attrs: Record<string, string> = {};
      combo.forEach((val, i) => {
        attrs[names[i]] = val;
      });
      return {
        id: `v-${Date.now()}-${idx}`,
        name: combo.join(' / '),
        sku: '',
        price: null,
        stock: 0,
        attributes: attrs,
      };
    });
    setVariants(newVariants);
  };

  const updateVariantField = (idx: number, field: keyof Variant, value: any) =>
    setVariants((s) => s.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));

  return (
    <div className="grid gap-4">
      <div className="bg-gray-800 p-3 rounded">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Attributes</div>
          <div className="flex gap-2">
            <button onClick={addAttribute} className="px-2 py-1 bg-gray-700 rounded">+ Add Attribute</button>
            <button onClick={generateVariants} className="px-2 py-1 bg-green-600 rounded">Generate Variants</button>
          </div>
        </div>

        {attributes.map((attr, i) => (
          <div key={i} className="mb-3 border-t border-gray-700 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <input value={attr.name} onChange={(e) => updateAttrName(i, e.target.value)} className="p-1 rounded bg-gray-900" />
              <button onClick={() => removeAttribute(i)} className="px-2 py-1 bg-red-600 rounded">Remove</button>
            </div>
            <div className="grid gap-2">
              {attr.values.map((v, vi) => (
                <div key={vi} className="flex items-center gap-2">
                  <input value={v} onChange={(e) => updateAttrValue(i, vi, e.target.value)} className="flex-1 p-1 rounded bg-gray-900" />
                  <button onClick={() => removeAttrValue(i, vi)} className="px-2 py-1 bg-red-600 rounded">x</button>
                </div>
              ))}
              <div>
                <button onClick={() => addAttrValue(i)} className="px-2 py-1 bg-gray-700 rounded">+ Add Value</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 p-3 rounded">
        <div className="font-semibold mb-2">Variants ({variants.length})</div>
        <div className="grid gap-2">
          {variants.map((v, vi) => (
            <div key={v.id} className="p-2 bg-gray-900 rounded grid grid-cols-6 gap-2 items-center">
              <div className="col-span-2 font-medium">{v.name}</div>
              <input placeholder="SKU" value={v.sku} onChange={(e) => updateVariantField(vi, 'sku', e.target.value)} className="p-1 rounded bg-gray-800 col-span-1" />
              <input placeholder="Price" type="number" value={v.price ?? ''} onChange={(e) => updateVariantField(vi, 'price', e.target.value ? Number(e.target.value) : null)} className="p-1 rounded bg-gray-800 col-span-1" />
              <input placeholder="Stock" type="number" value={v.stock ?? 0} onChange={(e) => updateVariantField(vi, 'stock', Number(e.target.value))} className="p-1 rounded bg-gray-800 col-span-1" />
              <button onClick={() => setVariants((s) => s.filter((_, idx) => idx !== vi))} className="px-2 py-1 bg-red-600 rounded">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
