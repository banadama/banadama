// app/(affiliate)/affiliate/links/page.tsx - Affiliate Links
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import Link from "next/link";

export default async function AffiliateLinks() {
    const links = [
        { code: "abc123", target: "/marketplace/products/p1", targetName: "Nylon Bags", clicks: 45, signups: 3, earnings: 15000 },
        { code: "xyz789", target: "/marketplace", targetName: "Marketplace", clicks: 120, signups: 8, earnings: 45000 },
    ];

    const stats = {
        totalClicks: links.reduce((a, l) => a + l.clicks, 0),
        totalSignups: links.reduce((a, l) => a + l.signups, 0),
        totalEarnings: links.reduce((a, l) => a + l.earnings, 0),
    };

    return (
        <div className="bd-grid" style={{ gap: 20 }}>
            <div className="bd-row" style={{ justifyContent: "space-between" }}>
                <div className="bd-h2">🔗 Affiliate Links</div>
                <Link href="/affiliate/links/new">
                    <Button variant="primary">+ Create Link</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 }}>
                <Card>
                    <CardBody className="bd-grid" style={{ gap: 8 }}>
                        <div style={{ fontWeight: 900, opacity: 0.7 }}>Total Clicks</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.totalClicks}</div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="bd-grid" style={{ gap: 8 }}>
                        <div style={{ fontWeight: 900, opacity: 0.7 }}>Signups</div>
                        <div style={{ fontSize: 28, fontWeight: 900 }}>{stats.totalSignups}</div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="bd-grid" style={{ gap: 8 }}>
                        <div style={{ fontWeight: 900, opacity: 0.7 }}>Total Earnings</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "hsl(var(--bd-success))" }}>
                            ₦{stats.totalEarnings.toLocaleString()}
                        </div>
                    </CardBody>
                </Card>
            </div>

            <DataTable
                title="My Links"
                columns={[
                    { key: "code", label: "Code" },
                    { key: "target", label: "Target" },
                    { key: "clicks", label: "Clicks" },
                    { key: "signups", label: "Signups" },
                    { key: "earnings", label: "Earnings" },
                    { key: "actions", label: "" },
                ]}
                rows={links.map((l) => ({
                    code: <Badge>{l.code}</Badge>,
                    target: l.targetName,
                    clicks: l.clicks,
                    signups: l.signups,
                    earnings: `₦${l.earnings.toLocaleString()}`,
                    actions: (
                        <Button
                            variant="soft"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(`https://banadama.com${l.target}?ref=${l.code}`)}
                        >
                            Copy Link
                        </Button>
                    ),
                }))}
            />
        </div>
    );
}
