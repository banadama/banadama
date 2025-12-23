// components/rfq/AssignSupplier.tsx - RFQ Supplier Assignment Component
"use client";

import * as React from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useOpsAction } from "@/components/ops/useOpsAction";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Icons } from "@/components/icons/icons";

type Supplier = {
    id: string;
    name: string;
    verificationLevel?: string;
};

export function AssignSupplier({ rfqId }: { rfqId: string }) {
    const toast = useToast();
    const { loading, run } = useOpsAction();
    const [supplierId, setSupplierId] = React.useState("");
    const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = React.useState(true);

    React.useEffect(() => {
        loadSuppliers();
    }, []);

    async function loadSuppliers() {
        try {
            const res = await apiGet<{ suppliers: Supplier[] }>("/api/suppliers?verified=true");
            setSuppliers(res.suppliers || []);
        } catch {
            // Silent fail, use empty list
        } finally {
            setLoadingSuppliers(false);
        }
    }

    async function assign() {
        if (!supplierId) {
            toast.push({ type: "warning", title: "Select supplier", message: "Please choose a supplier before assigning." });
            return;
        }

        await run(
            () => apiPost(`/api/rfq/${rfqId}/assign`, { supplierId }),
            { start: "Assigning supplier", ok: "Supplier assigned", fail: "Assignment failed" }
        );

        location.reload();
    }

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontWeight: 900 }}>Assign Supplier</div>

                <select
                    className="bd-input"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    disabled={loadingSuppliers}
                >
                    <option value="">{loadingSuppliers ? "Loading..." : "Select supplier..."}</option>
                    {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <button
                    className="bd-btn bd-btn-primary"
                    onClick={assign}
                    disabled={loading || !supplierId}
                    style={{ justifyContent: "center" }}
                >
                    <Icons.Users size={18} /> {loading ? "Assigning..." : "Assign"}
                </button>
            </div>
        </div>
    );
}
