// src/lib/mockProducts.ts
export type ProductType = "b2c" | "b2b" | "design";

export type MockProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  basePrice: number; // factory / creator price
  currency: "USD";
  type: ProductType;
  minOrderQty: number;
  weightKg: number;
  thumbnailUrl?: string;
};

export const mockProducts: MockProduct[] = [
  {
    id: "p1",
    slug: "ni-afrik-basic-tee",
    title: "Ni Afrik Basic Tee (Black)",
    description:
      "High-quality cotton t-shirt, ready to wear for B2C buyers.",
    basePrice: 13,
    currency: "USD",
    type: "b2c",
    minOrderQty: 1,
    weightKg: 0.4,
    thumbnailUrl: "/placeholder/niafrik-tee.png",
  },
  {
    id: "p2",
    slug: "factory-hoodie-bulk",
    title: "Factory Hoodie (Bulk 100pcs)",
    description:
      "Bangladesh factory hoodie production – ideal for B2B bulk buyers.",
    basePrice: 480, // for 100 pcs
    currency: "USD",
    type: "b2b",
    minOrderQty: 100,
    weightKg: 25,
    thumbnailUrl: "/placeholder/factory-hoodie.png",
  },
  {
    id: "p3",
    slug: "niafrik-packaging-design",
    title: "Ni Afrik Packaging Design (Digital)",
    description:
      "Full packaging design for clothing brand – ready for print factories.",
    basePrice: 65,
    currency: "USD",
    type: "design",
    minOrderQty: 1,
    weightKg: 0,
    thumbnailUrl: "/placeholder/niafrik-design.png",
  },
];

export function getAllProducts() {
  return mockProducts;
}

export function getProductsByType(type?: ProductType) {
  if (!type) return mockProducts;
  return mockProducts.filter((p) => p.type === type);
}

export function getProductBySlug(slug: string) {
  return mockProducts.find((p) => p.slug === slug) || null;
}
