"use client";

import { Icons } from "@/components/icons/icons";

export default function BlogPage() {
    const BookOpenIcon = Icons.get("BookOpen");
    const ClockIcon = Icons.get("Clock");
    const UserIcon = Icons.get("User");

    // Sample blog posts
    const blogPosts = [
        {
            id: 1,
            title: "10 Tips for Successful B2B Sourcing in Nigeria",
            excerpt: "Learn how to find reliable suppliers, negotiate better prices, and ensure quality in your B2B transactions.",
            author: "Banadama Team",
            date: "December 20, 2025",
            readTime: "5 min read",
            category: "Sourcing",
            image: "https://via.placeholder.com/600x400/5bc5cf/ffffff?text=B2B+Sourcing"
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
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Banadama Reads</h1>
                    <p style={{ color: 'white', opacity: 0.9, margin: '0.5rem 0 0 0' }}>Insights, tips, and stories from the world of B2B trade</p>
                </div>
            </header>

            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {blogPosts.map((post) => (
                        <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ backgroundColor: '#5bc5cf', height: '120px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ backgroundColor: '#2b3d2d', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{post.category}</span>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>{post.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>{post.excerpt}</p>
                                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
                                    <span>{post.author}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>
                                <button style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Read More</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                </div>
            </main>
        </div>
    );
}
