// app/not-found.tsx - Global 404 Page
import { Icons } from "@/components/icons/icons";

export default function NotFound() {
    const SearchIcon = Icons.get("Search");
    const ProductIcon = Icons.get("Product");
    const HomeIcon = Icons.get("Home");

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ display: "grid", gap: 10, maxWidth: 600, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <SearchIcon size={24} style={{ opacity: 0.5 }} />
                    <div style={{ fontWeight: 950, fontSize: 18 }}>Page not found</div>
                </div>
                <div style={{ color: "var(--bd-muted)" }}>
                    The page you are looking for does not exist.
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="bd-btn bd-btn-primary" href="/marketplace">
                        <ProductIcon size={18} />
                        Browse Marketplace
                    </a>
                    <a className="bd-btn" href="/">
                        <HomeIcon size={18} />
                        Home
                    </a>
                </div>
            </div>
        </div>
    );
}
