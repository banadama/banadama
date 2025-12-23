import Link from "next/link";

export default function AffiliatePage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
            {/* Hero */}
            <div className="text-center mb-12">
                <span className="text-5xl mb-4 block">🔗</span>
                <h1 className="text-3xl font-semibold text-slate-50 md:text-4xl">
                    Banadama Affiliate Program
                </h1>
                <p className="mt-3 text-sm text-slate-300 max-w-lg mx-auto">
                    Earn commission on every sale made through your referral link.
                    No signup bonuses, no MLM — just real sales, real earnings.
                </p>
                <Link
                    href="/auth/register"
                    className="mt-6 inline-block rounded-full bg-orange-500 px-8 py-3 text-sm font-medium text-slate-950 hover:bg-orange-400 transition-colors"
                >
                    Become an Affiliate
                </Link>
            </div>

            {/* How it works */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-100 text-center mb-8">
                    How It Works
                </h2>
                <div className="grid gap-6 md:grid-cols-4">
                    {[
                        {
                            step: "1",
                            title: "Sign Up",
                            description: "Register as an affiliate for free",
                            icon: "📝",
                        },
                        {
                            step: "2",
                            title: "Get Your Link",
                            description: "Generate unique referral links",
                            icon: "🔗",
                        },
                        {
                            step: "3",
                            title: "Share & Promote",
                            description: "Share products with your audience",
                            icon: "📢",
                        },
                        {
                            step: "4",
                            title: "Earn Commission",
                            description: "Get paid when sales happen",
                            icon: "💰",
                        },
                    ].map((item) => (
                        <div
                            key={item.step}
                            className="text-center rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                        >
                            <div className="text-3xl mb-3">{item.icon}</div>
                            <div className="inline-block rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-400 mb-2">
                                Step {item.step}
                            </div>
                            <h3 className="font-medium text-slate-100">{item.title}</h3>
                            <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Commission Rules */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-100 text-center mb-8">
                    Commission Structure
                </h2>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Type</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Condition</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <tr>
                                <td className="px-4 py-4 text-slate-200">Product Sale</td>
                                <td className="px-4 py-4 text-slate-400">Buyer purchases via your link</td>
                                <td className="px-4 py-4 text-right text-emerald-400 font-semibold">2%</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 text-slate-200">Verified Supplier</td>
                                <td className="px-4 py-4 text-slate-400">Referred supplier gets verified</td>
                                <td className="px-4 py-4 text-right text-emerald-400 font-semibold">₦5,000</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-4 text-slate-200">Bulk Order Bonus</td>
                                <td className="px-4 py-4 text-slate-400">Orders above ₦500,000</td>
                                <td className="px-4 py-4 text-right text-emerald-400 font-semibold">3%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* What's NOT Allowed */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-100 text-center mb-8">
                    Program Rules
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                        <h3 className="font-medium text-emerald-400 mb-3 flex items-center gap-2">
                            <span>✓</span> What You Can Do
                        </h3>
                        <ul className="space-y-2 text-sm text-emerald-200">
                            <li>• Share product links on social media</li>
                            <li>• Create content featuring products</li>
                            <li>• Refer suppliers and creators</li>
                            <li>• Withdraw earnings to your bank</li>
                            <li>• Track all sales and commissions</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                        <h3 className="font-medium text-red-400 mb-3 flex items-center gap-2">
                            <span>✕</span> What&apos;s NOT Allowed
                        </h3>
                        <ul className="space-y-2 text-sm text-red-200">
                            <li>• No signup bonuses or referral farming</li>
                            <li>• No MLM or pyramid schemes</li>
                            <li>• No fake accounts or self-referrals</li>
                            <li>• No spam or misleading promotions</li>
                            <li>• No commission on cancelled orders</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-100 text-center mb-8">
                    Your Affiliate Dashboard
                </h2>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Total Clicks</p>
                            <p className="text-2xl font-semibold text-slate-100">1,234</p>
                        </div>
                        <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Total Sales</p>
                            <p className="text-2xl font-semibold text-slate-100">56</p>
                        </div>
                        <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Conversion Rate</p>
                            <p className="text-2xl font-semibold text-emerald-400">4.5%</p>
                        </div>
                        <div className="rounded-lg bg-slate-800/50 p-4 text-center">
                            <p className="text-xs text-slate-400 mb-1">Total Earnings</p>
                            <p className="text-2xl font-semibold text-emerald-400">₦45,600</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-4">
                        * Sample data for illustration
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-100 text-center mb-8">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {[
                        {
                            q: "When do I get paid?",
                            a: "Commission is credited to your wallet immediately after a sale is confirmed. You can withdraw anytime.",
                        },
                        {
                            q: "What's the minimum withdrawal?",
                            a: "The minimum withdrawal amount is ₦5,000 or equivalent in your currency.",
                        },
                        {
                            q: "How long does my referral link last?",
                            a: "Referral links use a 30-day cookie. If someone clicks your link and buys within 30 days, you get the commission.",
                        },
                        {
                            q: "Can I be both a Buyer and an Affiliate?",
                            a: "Yes! You can have multiple roles on Banadama.",
                        },
                    ].map((faq, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                        >
                            <p className="font-medium text-slate-200">{faq.q}</p>
                            <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <div className="text-center rounded-xl border border-orange-500/30 bg-orange-500/10 p-8">
                <h2 className="text-xl font-semibold text-slate-50">
                    Ready to start earning?
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                    Join thousands of affiliates earning with Banadama
                </p>
                <Link
                    href="/auth/register"
                    className="mt-4 inline-block rounded-full bg-orange-500 px-8 py-3 text-sm font-medium text-slate-950 hover:bg-orange-400 transition-colors"
                >
                    Sign Up as Affiliate
                </Link>
            </div>
        </div>
    );
}
