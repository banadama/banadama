// components/layout/TopNav.tsx
"use client";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { AccountSwitch } from "./AccountSwitch";

export function TopNav({ title }: { title: string }) {
    return (
        <div
            style={{
                borderBottom: "1px solid hsl(var(--bd-border))",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "hsl(var(--bd-bg))",
            }}
        >
            <div className="bd-row">
                <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
                <Badge variant="success">LIVE</Badge>
            </div>
            <div className="bd-row">
                <AccountSwitch />
                <Button onClick={() => (window.location.href = "/auth/logout")}>Logout</Button>
            </div>
        </div>
    );
}
