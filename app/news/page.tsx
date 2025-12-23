"use client";

import { Icons } from "@/components/icons/icons";

export default function NewsPage() {
    const NewspaperIcon = Icons.get("FileText");
    const ClockIcon = Icons.get("Clock");

    const newsArticles = [
        {
            id: 1,
            title: "Banadama Launches Escrow-Protected B2B Marketplace",
            excerpt: "New platform connects Nigerian and Bangladeshi suppliers with global buyers through secure escrow system.",
            date: "December 22, 2025",
            category: "Company News",
            image: "https://via.placeholder.com/600x400/f97316/ffffff?text=Launch+News"
        },
        {
            id: 2,
            title: "1,000 Verified Suppliers Join Banadama in First Month",
            excerpt: "Platform sees rapid adoption as SMEs embrace digital commerce with payment protection.",
            date: "December 18, 2025",
            category: "Milestone",
            image: "https://via.placeholder.com/600x400/10b981/ffffff?text=Milestone"
        },
        {
            id: 3,
            title: "Banadama Partners with Leading Logistics Providers",
            excerpt: "Strategic partnerships ensure faster, more reliable shipping for cross-border orders.",
            date: "December 15, 2025",
            category: "Partnerships",
            image: "https://via.placeholder.com/600x400/3b82f6/ffffff?text=Partnership"
        },
        {
            id: 4,
            title: "New RFQ Feature Empowers Bulk Buyers",
            excerpt: "Request for Quotation system allows buyers to get custom pricing from multiple suppliers.",
            date: "December 10, 2025",
            category: "Product",
            image: "https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Product+Launch"
        },
        {
            id: 5,
            title: "$50M in Transactions Processed Securely",
            excerpt: "Platform surpasses major transaction milestone with zero payment disputes.",
            date: "December 5, 2025",
            category: "Milestone",
            image: "https://via.placeholder.com/600x400/f59e0b/ffffff?text=50M+Milestone"
        },
        {
            id: 6,
            title: "Banadama Announces Corporate Responsibility Goals for 2026",
            excerpt: "Commitment to onboard 10,000 SMEs and achieve carbon-neutral shipping.",
            date: "December 1, 2025",
            category: "CSR",
            image: "https://via.placeholder.com/600x400/10b981/ffffff?text=CSR+Goals"
        }
    ];

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px" }}>
                <NewspaperIcon size={64} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
                <h1 className="bd-h1" style={{ fontSize: 36, marginBottom: 12 }}>News Center</h1>
                <p style={{ color: "var(--bd-muted)", fontSize: 16 }}>
                    Latest updates, announcements, and press releases from Banadama
                </p>
            </div>

            <div style={{ maxWidth: 1200, margin: "40px auto" }}>
                {/* Categories */}
                <div style={{ marginBottom: 40, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <button className="bd-btn bd-btn-primary">All News</button>
                        <button className="bd-btn">Company News</button>
                        <button className="bd-btn">Milestones</button>
                        <button className="bd-btn">Partnerships</button>
                        <button className="bd-btn">Product Updates</button>
                        <button className="bd-btn">CSR</button>
                    </div>
                </div>

                {/* Featured Article */}
                <article className="bd-card" style={{ marginBottom: 60, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                        <div style={{
                            background: `url(${newsArticles[0].image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            minHeight: 300
                        }} />
                        <div className="bd-card-pad" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{
                                display: "inline-block",
                                background: "var(--bd-brand)",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 700,
                                marginBottom: 16,
                                width: "fit-content"
                            }}>
                                FEATURED
                            </div>
                            <h2 style={{ fontWeight: 900, fontSize: 28, marginBottom: 12, lineHeight: 1.3 }}>
                                {newsArticles[0].title}
                            </h2>
                            <p style={{ color: "var(--bd-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                                {newsArticles[0].excerpt}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--bd-muted)", fontSize: 14, marginBottom: 20 }}>
                                <ClockIcon size={14} />
                                <span>{newsArticles[0].date}</span>
                            </div>
                            <button className="bd-btn bd-btn-primary" style={{ width: "fit-content" }}>
                                Read Full Story
                            </button>
                        </div>
                    </div>
                </article>

                {/* News Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 30 }}>
                    {newsArticles.slice(1).map((article) => (
                        <article key={article.id} className="bd-card" style={{ overflow: "hidden", cursor: "pointer" }}>
                            <div style={{
                                background: `url(${article.image})`,
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
                                    {article.category}
                                </div>
                            </div>

                            <div className="bd-card-pad">
                                <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 12, lineHeight: 1.3 }}>
                                    {article.title}
                                </h3>

                                <p style={{ color: "var(--bd-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                                    {article.excerpt}
                                </p>

                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--bd-muted)", fontSize: 13, borderTop: "1px solid var(--bd-border)", paddingTop: 12 }}>
                                    <ClockIcon size={14} />
                                    <span>{article.date}</span>
                                </div>

                                <button className="bd-btn bd-btn-primary" style={{ width: "100%", marginTop: 16 }}>
                                    Read More
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Load More */}
                <div style={{ textAlign: "center", marginTop: 60 }}>
                    <button className="bd-btn bd-btn-lg">
                        Load More News
                    </button>
                </div>

                {/* Press Contact */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "60px 20px", marginTop: 60 }}>
                    <h2 className="bd-h2" style={{ marginBottom: 16 }}>Media & Press Inquiries</h2>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 30, maxWidth: 600, margin: "0 auto 30px" }}>
                        For press releases, media kits, or interview requests, please contact our communications team.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="mailto:press@banadama.com" className="bd-btn bd-btn-primary">
                            press@banadama.com
                        </a>
                        <a href="/about" className="bd-btn">About Banadama</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
