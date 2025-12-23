import { getProductBySlug } from "@/lib/mockProducts";
import { notFound } from "next/navigation";
import PricingCalculator from "@/components/pricing/PricingCalculator";

type Props = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  const productType: "b2c" | "b2b" | "design" = product.type;

  return (
    <main className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
          {product.type === "b2c"
            ? "B2C Retail"
            : product.type === "b2b"
            ? "B2B Wholesale"
            : "Design Marketplace"}
        </p>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-sm text-slate-600">{product.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr,1.3fr] gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="aspect-video w-full rounded-lg bg-slate-100 mb-4 flex items-center justify-center text-xs text-slate-400">
            Product image placeholder
          </div>
          <p className="text-xs text-slate-500">
            A nan daga baya zamu saka gallery, factory/creator info, reviews,
            compliance da sauran details na Banadama.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">Base price</p>
            <p className="text-xl font-semibold">
              ${product.basePrice.toFixed(2)} {" "}
              <span className="text-xs text-slate-500">factory/creator base</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 p-2">
              <p className="text-slate-500 mb-1">Min order qty</p>
              <p className="font-semibold">{product.minOrderQty}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <p className="text-slate-500 mb-1">Weight (approx)</p>
              <p className="font-semibold">{product.weightKg} kg</p>
            </div>
          </div>

          <PricingCalculator
            basePrice={product.basePrice}
            weightKg={product.weightKg}
            productType={productType}
          />
        </div>
      </div>
    </main>
  );
}
