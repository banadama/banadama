// components/layout/AccountSwitch.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";

type Account = { id: string; label: string; type: string };

export function AccountSwitch() {
    const [open, setOpen] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch accounts from API
        const fetchAccounts = async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    // Build accounts list from user roles
                    const accs: Account[] = [];
                    if (data.buyer) accs.push({ id: data.buyer.id, label: "Buyer Account", type: "buyer" });
                    if (data.supplier) accs.push({ id: data.supplier.id, label: data.supplier.businessName || "Supplier", type: "supplier" });
                    if (data.creator) accs.push({ id: data.creator.id, label: "Creator Account", type: "creator" });
                    setAccounts(accs);
                    setActiveId(data.activeAccountId);
                }
            } catch (err) {
                console.error("Error fetching accounts:", err);
            }
        };
        fetchAccounts();
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    const switchAccount = async (accountId: string) => {
        try {
            await fetch("/api/auth/switch-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ accountId }),
            });
            window.location.reload();
        } catch (err) {
            console.error("Error switching account:", err);
        }
    };

    if (accounts.length <= 1) return null;

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <Button onClick={() => setOpen((o) => !o)}>Switch Account</Button>
            {open && (
                <div style={{ position: "absolute", right: 0, top: "110%", width: 260, zIndex: 10 }}>
                    <Card>
                        <CardBody className="bd-grid" style={{ gap: 8 }}>
                            <div className="bd-small" style={{ marginBottom: 4 }}>
                                Select Account
                            </div>
                            {accounts.map((a) => (
                                <button
                                    key={a.id}
                                    className={`bd-btn ${a.id === activeId ? "bd-btn-primary" : "bd-btn-soft"}`}
                                    style={{ width: "100%", justifyContent: "flex-start" }}
                                    onClick={() => {
                                        setOpen(false);
                                        switchAccount(a.id);
                                    }}
                                >
                                    {a.label}
                                </button>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}
