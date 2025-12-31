import Link from 'next/link';
import { Package, Truck, BarChart3, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Sell on Banadama — Supplier Platform',
  description: 'Grow your business selling on Banadama. Reach buyers across Africa and globally as a Supplier, Factory, Wholesaler, Creator or Affiliate.',
};

export default function SupplierLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Banadama</h1>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-6 py-2 text-gray-900 font-medium hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Grow Your Business on Banadama
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Reach millions of buyers across Nigeria, Bangladesh, and globally. Sell products, offer services, build your brand—all on one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/supplier/onboarding"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-yellow-50 hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg"
            >
              🚀 Start Selling Today <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-8 justify-center text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Fast Onboarding</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Global Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Low Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Types */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Sell as Your Business Type
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Package, name: 'Supplier', desc: 'Distribute products and manage wholesale orders' },
              { icon: Users, name: 'Factory', desc: 'Manage production and large-scale orders' },
              { icon: Truck, name: 'Wholesaler', desc: 'Bulk sales with flexible logistics' },
              { icon: BarChart3, name: 'Creator', desc: 'Offer services and creative work' },
              { icon: Users, name: 'Affiliate', desc: 'Earn commissions on referrals' },
            ].map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.name}
                  className="bg-white rounded-lg p-6 text-center border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Everything You Need to Succeed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: 'Powerful Dashboard',
                desc: 'Manage inventory, orders, pricing, and analytics from one intuitive dashboard.',
                features: ['Real-time sales tracking', 'Inventory management', 'Order fulfillment', 'Performance analytics'],
              },
              {
                title: 'Multi-Channel Sales',
                desc: 'Sell across Nigeria, Bangladesh, and globally with unified management.',
                features: ['Local shipping options', 'International logistics', 'Regional markets', 'Flexible pricing'],
              },
              {
                title: 'Business Tools',
                desc: 'Everything to grow your business—from product management to customer messaging.',
                features: ['Product catalog', 'Customer messaging', 'Bulk upload', 'API access'],
              },
              {
                title: 'Payment & Payouts',
                desc: 'Quick, secure payment processing with multiple payout options.',
                features: ['Fast settlements', 'Multiple payment methods', 'Transparent fees', 'Commission tracking'],
              },
            ].map((feature, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.desc}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Get Started in 4 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Sign Up', desc: 'Create your account in minutes' },
              { num: 2, title: 'Complete Profile', desc: 'Add your business details' },
              { num: 3, title: 'Add Products', desc: 'Upload your product catalog' },
              { num: 4, title: 'Start Selling', desc: 'Receive orders and grow' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Already have an account?</h3>
            <p className="text-gray-600 mb-6">Log in to your dashboard and continue managing your business</p>
            <Link
              href="/supplier/dashboard"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'How much does it cost to sell on Banadama?',
                a: 'We charge a small commission on each sale. There are no monthly fees or listing costs.',
              },
              {
                q: 'How long does onboarding take?',
                a: 'Most sellers can be verified and start selling within 24-48 hours.',
              },
              {
                q: 'What products can I sell?',
                a: 'You can sell physical products, digital services, and creative work. We have guidelines on prohibited items.',
              },
              {
                q: 'How do I get paid?',
                a: 'Earnings are paid to your bank account weekly or monthly, depending on your preference.',
              },
            ].map((item, idx) => (
              <details key={idx} className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                <summary className="font-bold text-gray-900 flex justify-between items-center">
                  {item.q}
                  <span className="text-blue-600">+</span>
                </summary>
                <p className="text-gray-600 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Grow Your Business?</h2>
          <p className="text-xl text-blue-100">
            Join thousands of successful sellers earning on Banadama today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/supplier/onboarding"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-yellow-50 hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
            >
              🚀 Start Selling Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:support@banadama.com"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer is provided by supplier layout to avoid duplication */}
    </div>
  );
}
