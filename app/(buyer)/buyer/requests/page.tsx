// app/(buyer)/buyer/requests/page.tsx - Buyer RFQs
import { DataTable } from "../../../../components/ui/DataTable";
import { Button } from "../../../../components/ui/Button";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import Link from "next/link";

export default async function BuyerRequests() {
    // TODO: listRfqs()
    const rfqs = [
        { id: "RFQ-001", status: "PENDING", product: "Packaging Nylon", createdAt: "2025-12-16" },
        { id: "RFQ-002", status: "CONFIRMED", product: "T-Shirts Bulk", createdAt: "2025-12-12" },
    ];

    return (
        <div className="bd-grid" style={{ gap: 20 }}>
            <div className="bd-row" style={{ justifyContent: "space-between" }}>
                <div className="bd-h2">My RFQs</div>
                <Link href="/buyer/requests/new">
                    <Button variant="primary">+ Create RFQ</Button>
                </Link>
            </div>

            <DataTable
                columns={[
                    { key: "id", label: "RFQ" },
                    { key: "product", label: "Product" },
                    { key: "status", label: "Status" },
                    { key: "createdAt", label: "Created" },
                    { key: "actions", label: "" },
                ]}
                rows={rfqs.map((r) => ({
                    id: r.id,
                    product: r.product,
                    status: <StatusBadge status={r.status as "PENDING" | "CONFIRMED"} />,
                    createdAt: r.createdAt,
                    actions: (
                        <Link href={`/buyer/requests/${r.id}`}>
                            <Button variant="soft" size="sm">View →</Button>
                        </Link>
                    ),
                }))}
                emptyMessage="No RFQs yet. Create your first request!"
            />
        </div>
    );
}
