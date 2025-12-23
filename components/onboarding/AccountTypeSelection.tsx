// components/onboarding/AccountTypeSelection.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button, Badge } from "@/components/ui";
import { Icons } from "@/components/icons/icons";
import { setOnboardingCookie } from "@/lib/onboarding";

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

    const UserIcon = Icons.get("Users");
    const NextIcon = Icons.get("ChevronRight");
    const BackIcon = Icons.get("ChevronLeft");
    const CheckIcon = Icons.get("Check");

    const roles = [
        { id: "BUYER", name: "Buyer", desc: "Buy products or hire creators." },
        {
            id: "SUPPLIER", name: "Supplier", desc: "Sell products at scale.",
            subtypes: [
                { id: "FACTORY", name: "Factory" },
                { id: "WHOLESALER", name: "Wholesaler" },
            ]
        },
        {
            id: "CREATOR", name: "Creator", desc: "Offer digital or local services.",
            subtypes: [
                { id: "GRAPHIC_DESIGNER", name: "Digital Services" },
                { id: "MODELLING", name: "Local Service" },
            ]
        },
        { id: "AFFILIATE", name: "Affiliate", desc: "Earn by referring users." },
    ];

    return (
        <Card className="max-w-md w-full animate-fadeIn">
            <CardBody className="bd-grid" style={{ gap: 24 }}>
                <div className="text-center">
                    <UserIcon size={40} className="mx-auto mb-4 text-orange-400" />
                    <h1 className="bd-h1">I want to be a...</h1>
                    <p className="bd-p">Select your primary goal on Banadama.</p>
                </div>

                <div className="bd-grid" style={{ gap: 12 }}>
                    {roles.map((r) => (
                        <div key={r.id}>
                            <div
                                onClick={() => {
                                    setRole(r.id);
                                    if (!r.subtypes) setSubtype("");
                                    else if (!r.subtypes.find(s => s.id === subtype)) setSubtype(r.subtypes[0].id);
                                }}
                                className={`bd-card bd-card-pad cursor-pointer transition-all ${role === r.id ? "border-orange-500 bg-orange-500/10" : "hover:border-slate-700"
                                    }`}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700 }}>{r.name}</span>
                                    {role === r.id && !r.subtypes && <CheckIcon size={16} className="text-orange-500" />}
                                </div>
                                <p className="text-xs text-slate-400">{r.desc}</p>
                            </div>

                            {role === r.id && r.subtypes && (
                                <div className="bd-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8, paddingLeft: 12 }}>
                                    {r.subtypes.map(s => (
                                        <Button
                                            key={s.id}
                                            variant={subtype === s.id ? "primary" : "soft"}
                                            size="sm"
                                            onClick={() => setSubtype(s.id)}
                                            style={{ fontSize: 11 }}
                                        >
                                            {s.name}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bd-row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                    <Button variant="ghost" onClick={() => router.push("/languages")}>
                        <BackIcon size={18} />
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleNext}>
                        Next
                        <NextIcon size={18} />
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
