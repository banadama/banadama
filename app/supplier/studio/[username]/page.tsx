import { notFound } from 'next/navigation';
import { Store, MapPin, Star, Phone, Mail, Grid3x3, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Supplier Store | Banadama Marketplace',
  description: 'Browse products from our verified suppliers',
};

interface SupplierStudioPageProps {
  params: {
    username: string;
  };
}

// Mock supplier data - replace with database query
const mockSupplier = {
  username: 'techgear-supplies',
  name: 'Tech Gear Supplies',
  description: 'Quality electronics and gadgets with fast shipping. We\'ve been serving customers since 2020.',
  location: 'Lagos, Nigeria',
  rating: 4.8,
  reviews: 248,
  products: 127,
  orders: 1234,
  responseTime: '2hrs',
  logo: '🏢',
  verified: true,
};

export default async function SupplierStudioPage({
  params,
}: SupplierStudioPageProps) {
  // TODO: Fetch supplier data from database
  // const supplier = await getSupplierByUsername(params.username);
  // if (!supplier) notFound();

  const supplier = {
    ...mockSupplier,
    username: params.username,
    name: `${params.username.replace(/-/g, ' ').toUpperCase()} Store`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-start gap-6">
            {/* Store Logo */}
            <div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center border-2 border-white/30">
              <Store className="w-12 h-12 text-white" />
            </div>

            {/* Store Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{supplier.name}</h1>
                {supplier.verified && (
                  <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-xs font-bold">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-blue-100 mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{supplier.rating}</span>
                  <span className="text-blue-200">({supplier.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{supplier.location}</span>
                </div>
              </div>
              <p className="text-blue-100 max-w-2xl">
                {supplier.description}
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                <Mail className="w-4 h-4" />
                Contact
              </button>
              <button className="flex items-center gap-2 border border-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Phone className="w-4 h-4" />
                Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{supplier.products}</p>
              <p className="text-sm text-gray-600 mt-1">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{supplier.orders.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Orders Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">98%</p>
              <p className="text-sm text-gray-600 mt-1">Positive Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{supplier.responseTime}</p>
              <p className="text-sm text-gray-600 mt-1">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>
            <p className="text-gray-600 mt-2">Browse {supplier.products} products from this store</p>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sort: Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Selling</option>
              <option>Most Reviewed</option>
            </select>
          </div>
        </div>

        {/* Products Grid - Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(product => (
            <div
              key={product}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Grid3x3 className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">Product {product}</h3>
                <p className="text-sm text-gray-600 mt-1">₦99,999.00</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">4.8 (42)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium">
            Load More Products
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">✓ Verified Seller</h3>
              <p className="text-gray-600">This seller has been verified and approved to sell on Banadama.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🚚 Fast Shipping</h3>
              <p className="text-gray-600">Average delivery time of 2-5 business days across Nigeria.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🛡️ Buyer Protection</h3>
              <p className="text-gray-600">All purchases are protected by Banadama's buyer protection guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
