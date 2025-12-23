// components/sections/CTA.tsx
import Link from "next/link";
import { Button } from "../ui/Button";

export function CTA() {
    return (
        <section
            style={{
                background: "hsl(var(--bd-brand))",
                padding: "60px 16px",
                textAlign: "center",
            }}
        >
            <div className="bd-container bd-grid" style={{ gap: 20, maxWidth: 600 }}>
                <h2 className="bd-h1" style={{ color: "white", fontSize: 32 }}>
                    Ready to Trade Safely?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, margin: 0 }}>
                    Join buyers and suppliers across Nigeria and Bangladesh. Escrow-protected, Ops-managed.
                </p>
                <div className="bd-row" style={{ justifyContent: "center", gap: 12 }}>
                    <Link href="/languages">
                        <Button
                            style={{
                                background: "white",
                                color: "hsl(var(--bd-brand))",
                                fontWeight: 800,
                            }}
                            size="lg"
                        >
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/marketplace">
                        <Button
                            style={{
                                background: "transparent",
                                color: "white",
                                border: "2px solid white",
                            }}
                            size="lg"
                        >
                            Browse Marketplace
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
