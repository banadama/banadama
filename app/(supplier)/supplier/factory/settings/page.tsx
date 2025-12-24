// src/app/(dashboard)/settings/page.tsx
import Link from "next/link";

const sections = [
    { href: "/dashboard/settings/account", label: "Account Settings" },
    { href: "/dashboard/settings/security", label: "Security & Privacy" },
    { href: "/dashboard/settings/business", label: "Business Settings" },
    { href: "/dashboard/settings/notifications", label: "Notifications & Alerts" },
    { href: "/dashboard/settings/payments", label: "Payment & Finance" },
    { href: "/dashboard/settings/shipping", label: "Shipping & Logistics" },
    { href: "/dashboard/settings/system", label: "System Preferences" },
    { href: "/dashboard/settings/support", label: "Support & Help" },
];

export default function SettingsOverviewPage() {
    return (
        <div className="space-y-3 text-sm">
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-slate-400">
                Manage your account, business profile, notifications, payments, shipping
                and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {sections.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className="border border-slate-700 rounded-lg p-3 hover:border-sky-500"
                    >
                        {s.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
