// components/sections/Hero.tsx - NO EMOJIS
import Link from "next/link";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Icons } from "../icons/icons";

export function Hero() {
    const Shield = Icons.get("Shield");
    const Lock = Icons.get("Lock");
    const Users = Icons.get("Users");

    return (
        <section className="bd-container" style={{ padding: "60px 16px 40px" }}>
            <div className="bd-grid" style={{ gap: 20, maxWidth: 800 }}>
                {/* Badge with Shield icon instead of emoji */}
                <div className="bd-badge" style={{ gap: 8 }}>
                    <Shield size={16} />
                    <span>Buy Now + RFQ Marketplace — Nigeria & Bangladesh</span>
                </div>

                <h1 className="bd-h1" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
                    Buy Now + RFQ, Safely — Nigeria & Bangladesh
                </h1>

                <p className="bd-p" style={{ fontSize: 18, maxWidth: 600 }}>
                    Escrow-backed trade with verified suppliers and ops-managed fulfillment.
                    Local buying (NG/BD) and global buy-only access in one marketplace.
                </p>

                <div className="bd-row" style={{ gap: 12 }}>
                    <Link href="/languages">
                        <Button variant="primary" size="lg">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/marketplace">
                        <Button variant="soft" size="lg">
                            Browse Marketplace
                        </Button>
                    </Link>
                </div>

                {/* Trust badges with SVG icons - NO EMOJIS */}
                <div className="bd-row" style={{ marginTop: 16 }}>
                    <div className="bd-badge bd-badge-success">
                        <Lock size={14} />
                        Escrow Protected
                    </div>
                    <div className="bd-badge bd-badge-success">
                        <Shield size={14} />
                        Verified Suppliers
                    </div>
                    <div className="bd-badge">
                        <Users size={14} />
                        Ops-Managed
                    </div>
                </div>
            </div>
        </section>
    );
}
