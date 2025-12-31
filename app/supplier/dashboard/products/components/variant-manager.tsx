'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface Variant {
  id?: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

interface VariantManagerProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
  attributes: Array<{ name: string; value: string }>;
  basePrice: number;
  baseStock: number;
}

export function VariantManager({
  variants,
  onVariantsChange,
  attributes,
  basePrice,
  baseStock,
}: VariantManagerProps) {
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const generateVariantsFromAttributes = () => {
    if (attributes.length === 0) {
      alert('Please add attributes first');
      return;
    }

    // Parse attribute values
    const attributeSets = attributes.map((attr) => ({
      name: attr.name,
      values: attr.value.split(',').map((v) => v.trim()),
    }));

    // Generate all combinations
    const combinations = generateCombinations(attributeSets);

    // Create variants
    const newVariants: Variant[] = combinations.map((combo, index) => ({
      id: `variant-${Date.now()}-${index}`,
      name: combo.map((item) => item.value).join(' / '),
      sku: `${combo.map((item) => item.value.substring(0, 1).toUpperCase()).join('-')}-${Date.now()}`.substring(0, 50),
      price: basePrice,
      stockQuantity: baseStock,
    }));

    onVariantsChange(newVariants);
    setShowAutoGenerate(false);
    alert(`Generated ${newVariants.length} variants`);
  };

  const generateCombinations = (
    attributeSets: Array<{ name: string; values: string[] }>,
    currentIndex = 0,
    currentCombo: Array<{ name: string; value: string }> = []
  ): Array<Array<{ name: string; value: string }>> => {
    if (currentIndex === attributeSets.length) {
      return [currentCombo];
    }

    const combinations: Array<Array<{ name: string; value: string }>> = [];
    const currentSet = attributeSets[currentIndex];

    for (const value of currentSet.values) {
      const newCombo = [
        ...currentCombo,
        { name: currentSet.name, value },
      ];
      combinations.push(
        ...this.generateCombinations(attributeSets, currentIndex + 1, newCombo)
      );
    }

    return combinations;
  };

  const updateVariant = (index: number, updates: Partial<Variant>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    onVariantsChange(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(newVariants);
  };

  const addVariant = () => {
    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      name: '',
      sku: '',
      price: basePrice,
      stockQuantity: baseStock,
    };
    onVariantsChange([...variants, newVariant]);
    setEditingIndex(variants.length);
  };

  return (
    <div className="space-y-6">
      {/* Header with Auto-Generate Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
        <div className="flex gap-2">
          {attributes.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAutoGenerate(!showAutoGenerate)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
            >
              ✨ Auto-Generate from Attributes
            </button>
          )}
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + Add Variant
          </button>
        </div>
      </div>

      {/* Auto-Generate Panel */}
      {showAutoGenerate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 mb-3">
            This will create {calculateCombinations(attributes)} variant(s) based on your attributes:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {attributes.map((attr, i) => (
              <div key={i} className="bg-white border border-blue-300 rounded px-3 py-1 text-xs">
                <strong>{attr.name}:</strong> {attr.value.split(',').length} options
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generateVariantsFromAttributes}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={() => setShowAutoGenerate(false)}
              className="px-4 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Variants Table */}
      {variants.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {variants.map((variant, i) => (
                <tr key={variant.id || i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingIndex === i ? (
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(i, { name: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{variant.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingIndex === i ? (
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => updateVariant(i, { sku: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-600 font-mono">{variant.sku}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingIndex === i ? (
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(i, { price: parseFloat(e.target.value) })
                        }
                        className="w-24 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 font-medium">
                        {formatCurrency(variant.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingIndex === i ? (
                      <input
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) =>
                          updateVariant(i, {
                            stockQuantity: parseInt(e.target.value),
                          })
                        }
                        className="w-24 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{variant.stockQuantity}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {editingIndex === i ? (
                        <button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingIndex(i)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600">No variants yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Add variants for different product options (sizes, colors, etc.)
          </p>
          <button
            type="button"
            onClick={addVariant}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + Add First Variant
          </button>
        </div>
      )}
    </div>
  );
}

function calculateCombinations(attributes: Array<{ name: string; value: string }>): number {
  if (attributes.length === 0) return 0;
  return attributes.reduce((acc, attr) => {
    const count = attr.value.split(',').length;
    return acc * count;
  }, 1);
}
