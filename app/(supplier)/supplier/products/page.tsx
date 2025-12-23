import Link from "next/link";

// Mock products
const MOCK_PRODUCTS = [
    {
        id: "P-001",
        name: "Custom T-Shirts (Bulk)",
        category: "Textiles",
        price: 15000,
        moq: 100,
        rfqEnabled: true,
        status: "ACTIVE",
        views: 234,
        orders: 12,
        image: "👕",
    },
    {
        id: "P-002",
        name: "Cotton Fabric Roll",
        category: "Textiles",
        price: 45000,
        moq: 50,
        rfqEnabled: true,
        status: "ACTIVE",
        views: 156,
        orders: 8,
        image: "🧵",
    },
    {
        id: "P-003",
        name: "Package Boxes (Custom)",
        category: "Packaging",
        price: 2500,
        moq: 500,
        rfqEnabled: false,
        status: "DRAFT",
        views: 0,
        orders: 0,
        image: "📦",
    },
];

export default function SupplierProductsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-50">Products</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Manage your product listings
                    </p>
                </div>
                <Link
                    href="/supplier/products/new"
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                    + Add Product
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Total Products</p>
                    <p className="text-2xl font-semibold text-slate-100 mt-1">{MOCK_PRODUCTS.length}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Active</p>
                    <p className="text-2xl font-semibold text-emerald-400 mt-1">
                        {MOCK_PRODUCTS.filter((p) => p.status === "ACTIVE").length}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Total Views</p>
                    <p className="text-2xl font-semibold text-blue-400 mt-1">
                        {MOCK_PRODUCTS.reduce((sum, p) => sum + p.views, 0)}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Total Orders</p>
                    <p className="text-2xl font-semibold text-purple-400 mt-1">
                        {MOCK_PRODUCTS.reduce((sum, p) => sum + p.orders, 0)}
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_PRODUCTS.map((product) => (
                    <div
                        key={product.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-800 text-2xl">
                                {product.image}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-slate-100 truncate">
                                        {product.name}
                                    </h3>
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${product.status === "ACTIVE"
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-slate-500/20 text-slate-400"
                                        }`}>
                                        {product.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{product.category}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-lg font-semibold text-emerald-400">
                                    ₦{product.price.toLocaleString()}
                                </p>
                                <p className="text-[10px] text-slate-500">Unit Price</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-slate-300">
                                    {product.moq || "-"}
                                </p>
                                <p className="text-[10px] text-slate-500">MOQ</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-slate-300">
                                    {product.orders}
                                </p>
                                <p className="text-[10px] text-slate-500">Orders</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                {product.rfqEnabled && (
                                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">
                                        RFQ
                                    </span>
                                )}
                                {product.moq && (
                                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400">
                                        Group Buy
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/supplier/products/${product.id}`}
                                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Product Card */}
            <Link
                href="/supplier/products/new"
                className="block rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-8 text-center hover:border-slate-600 transition-colors"
            >
                <div className="text-3xl mb-2">➕</div>
                <p className="font-medium text-slate-300">Add New Product</p>
                <p className="text-xs text-slate-500 mt-1">
                    List a new product with fixed price or RFQ option
                </p>
            </Link>
        </div>
    );
}
