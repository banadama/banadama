"use client";

import { Icons } from "@/components/icons/icons";

export default function BlogPage() {
    const BookOpenIcon = Icons.get("BookOpen");
    const ClockIcon = Icons.get("Clock");
    const UserIcon = Icons.get("User");

    // Sample blog posts - In production, these would come from a CMS or database
    const blogPosts = [
        {
            id: 1,
            title: "10 Tips for Successful B2B Sourcing in Nigeria",
            excerpt: "Learn how to find reliable suppliers, negotiate better prices, and ensure quality in your B2B transactions.",
            author: "Banadama Team",
            date: "December 20, 2025",
            readTime: "5 min read",
            category: "Sourcing",
            image: "https://via.placeholder.com/600x400/f97316/ffffff?text=B2B+Sourcing"
        },
        {
            id: 2,
            title: "Understanding Escrow: How Payment Protection Works",
            excerpt: "A complete guide to escrow payments and how they protect both buyers and sellers on Banadama.",
            author: "Abdul Rahman",
            date: "December 18, 2025",
            readTime: "7 min read",
            category: "Payments",
            image: "https://via.placeholder.com/600x400/10b981/ffffff?text=Escrow+Guide"
        },
        {
            id: 3,
            title: "RFQ Best Practices: Get Better Quotes Every Time",
            excerpt: "Maximize your RFQ success rate with these proven strategies for writing effective quotation requests.",
            author: "Sarah Johnson",
            date: "December 15, 2025",
            readTime: "6 min read",
            category: "RFQ",
            image: "https://via.placeholder.com/600x400/3b82f6/ffffff?text=RFQ+Tips"
        },
        {
            id: 4,
            title: "Top 5 Product Categories to Source from Bangladesh",
            excerpt: "Discover the most competitive product categories and industries in Bangladesh for international buyers.",
            author: "Banadama Team",
            date: "December 12, 2025",
            readTime: "8 min read",
            category: "Markets",
            image: "https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Bangladesh+Markets"
        },
        {
            id: 5,
            title: "Supplier Verification: What the Blue Tick Really Means",
            excerpt: "Learn about our supplier verification process and what credentials are required for verified status.",
            author: "Operations Team",
            date: "December 10, 2025",
            readTime: "4 min read",
            category: "Trust & Safety",
            image: "https://via.placeholder.com/600x400/f59e0b/ffffff?text=Verification"
        },
        {
            id: 6,
            title: "How to Calculate Total Landed Cost for Imports",
            excerpt: "A step-by-step guide to calculating the true cost of imported goods including shipping, duties, and taxes.",
            author: "Finance Team",
            date: "December 8, 2025",
            readTime: "10 min read",
            category: "Finance",
            image: "https://via.placeholder.com/600x400/ef4444/ffffff?text=Landed+Cost"
        }
    ];

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <BookOpenIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>Banadama Reads</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Insights, tips, and stories from the world of B2B trade
                </p>
            </div>

            <div style={{ maxWidth: 1200, margin: "40px auto" }}>
                {/* Categories */}
                <div style={{ marginBottom: 40, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <button className="bd-btn bd-btn-primary">All Posts</button>
                        <button className="bd-btn">Sourcing</button>
                        <button className="bd-btn">Payments</button>
                        <button className="bd-btn">RFQ</button>
                        <button className="bd-btn">Markets</button>
                        <button className="bd-btn">Trust & Safety</button>
                        <button className="bd-btn">Finance</button>
                    </div>
                </div>

                {/* Blog Posts Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 30 }}>
                    {blogPosts.map((post) => (
                        <article key={post.id} className="bd-card" style={{ overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}>
                            <div style={{
                                background: `url(${post.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: 200,
                                position: "relative"
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    background: "var(--bd-brand)",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontWeight: 700
                                }}>
                                    {post.category}
                                </div>
                            </div>

                            <div className="bd-card-pad">
                                <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 12, lineHeight: 1.3 }}>
                                    {post.title}
                                </h3>

                                <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                                    {post.excerpt}
                                </p>

                                <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "var(--bd-muted)", borderTop: "1px solid var(--bd-border)", paddingTop: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <UserIcon size={14} />
                                        <span>{post.author}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <ClockIcon size={14} />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                <div style={{ fontSize: 13, color: "var(--bd-muted)", marginTop: 8 }}>
                                    {post.date}
                                </div>

                                <button className="bd-btn bd-btn-primary" style={{ width: "100%", marginTop: 16 }}>
                                    Read Article
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Load More */}
                <div style={{ textAlign: "center", marginTop: 60 }}>
                    <button className="bd-btn bd-btn-lg">
                        Load More Articles
                    </button>
                </div>

                {/* Newsletter Signup */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px", marginTop: 60 }}>
                    <h2 className="bd-h2" style={{ marginBottom: 16 }}>Never Miss an Update</h2>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 30, maxWidth: 600, margin: "0 auto 30px" }}>
                        Subscribe to Banadama Reads and get the latest insights, tips, and trade news delivered to your inbox every week.
                    </p>
                    <form style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: 12 }}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="bd-input"
                            style={{ flex: 1 }}
                            required
                        />
                        <button type="submit" className="bd-btn bd-btn-primary">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
