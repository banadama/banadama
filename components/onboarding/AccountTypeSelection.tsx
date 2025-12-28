// components/onboarding/AccountTypeSelection.tsx - VERSION 2 (LIQUID GLASS)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button, Badge } from "@/components/ui";
import { Icons } from "@/components/icons/icons";
import { setOnboardingCookie } from "@/lib/onboarding";
import clsx from "clsx";

export function AccountTypeSelection({
    initialRole,
    initialSubtype,
    country,
    lang
}: {
    initialRole: string,
    initialSubtype: string,
    country: string,
    lang: string
}) {
    const router = useRouter();
    const [role, setRole] = useState(initialRole);
    const [subtype, setSubtype] = useState(initialSubtype);

    const handleNext = () => {
        setOnboardingCookie("bd_intent_role", role);
        setOnboardingCookie("bd_intent_subtype", subtype);

        const params = new URLSearchParams({
            intent: role,
            subtype: subtype,
            country: country,
            lang: lang
        });

        router.push(`/auth/register?${params.toString()}`);
    };

    const roles = [
        {
            id: "SUPPLIER",
            name: "Supplier / Factory",
            desc: "Sell products at scale. Reach global markets.",
            icon: Icons.Building,
            subtypes: [
                { id: "FACTORY", name: "Factory" },
                { id: "WHOLESALER", name: "Wholesaler" },
            ]
        },
        {
            id: "CREATOR",
            name: "Creator",
            desc: "Offer digital assets or specialized services.",
            icon: Icons.Brush,
            subtypes: [
                { id: "GRAPHIC_DESIGNER", name: "Digital Services" },
                { id: "MODELLING", name: "Local Service" },
            ]
        },
        {
            id: "AFFILIATE",
            name: "Affiliate",
            desc: "Earn commission by referring users to the platform.",
            icon: Icons.Link
        },
    ];

    return (
        <Card className="max-w-xl w-full glass shadow-2xl animate-fadeIn">
            <CardBody className="p-8 flex flex-col gap-10">
                <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                        <Icons.Users size={32} className="text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Partner with Banadama</h1>
                    <p className="text-slate-400 mt-2">Select your primary goal to get started.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {roles.map((r) => (
                        <div key={r.id} className="space-y-3">
                            <div
                                onClick={() => {
                                    setRole(r.id);
                                    if (!r.subtypes) setSubtype("");
                                    else if (!r.subtypes.find(s => s.id === subtype)) setSubtype(r.subtypes[0].id);
                                }}
                                className={clsx(
                                    "flex items-center gap-5 p-5 rounded-2xl border transition-all cursor-pointer group",
                                    role === r.id
                                        ? "bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                                        : "bg-white/5 border-white/5 hover:border-white/20"
                                )}
                            >
                                <div className={clsx(
                                    "p-3 rounded-xl transition-colors",
                                    role === r.id ? "bg-orange-500 text-black" : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                                )}>
                                    <r.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-lg text-white">{r.name}</h3>
                                        {role === r.id && <Icons.Check size={20} className="text-orange-500" />}
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{r.desc}</p>
                                </div>
                            </div>

                            {role === r.id && r.subtypes && (
                                <div className="grid grid-cols-2 gap-3 pl-16 pr-2 animate-slideDown">
                                    {r.subtypes.map(s => (
                                        <Button
                                            key={s.id}
                                            variant={subtype === s.id ? "primary" : "secondary"}
                                            size="sm"
                                            onClick={() => setSubtype(s.id)}
                                            className="h-10 text-xs font-bold uppercase tracking-wider"
                                        >
                                            {s.name}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Button variant="ghost" onClick={() => router.push("/")} className="text-slate-500 hover:text-white">
                        <Icons.ChevronLeft size={18} className="mr-2" />
                        Cancel
                    </Button>
                    <Button variant="primary" size="lg" onClick={handleNext} className="px-12">
                        Continue
                        <Icons.ChevronRight size={18} className="ml-2" />
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}

