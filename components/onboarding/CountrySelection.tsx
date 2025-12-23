// components/onboarding/CountrySelection.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button } from "@/components/ui";
import { Icons } from "@/components/icons/icons";
import { setOnboardingCookie } from "@/lib/onboarding";

export function CountrySelection({ initialCountry }: { initialCountry: string }) {
    const router = useRouter();
    const [country, setCountry] = useState(initialCountry);

    const handleNext = () => {
        setOnboardingCookie("bd_country", country);
        router.push("/onboarding/account-type");
    };

    const MapIcon = Icons.get("Location");
    const NextIcon = Icons.get("ChevronRight");
    const BackIcon = Icons.get("ChevronLeft");
    const CheckIcon = Icons.get("Check");

    return (
        <Card className="max-w-md w-full animate-fadeIn">
            <CardBody className="bd-grid" style={{ gap: 24 }}>
                <div className="text-center">
                    <MapIcon size={40} className="mx-auto mb-4 text-orange-400" />
                    <h1 className="bd-h1">Market Context</h1>
                    <p className="bd-p">Where are you trading from?</p>
                </div>

                <div className="bd-grid" style={{ gap: 12 }}>
                    {[
                        { id: "NG", name: "Nigeria", desc: "Enables 'Near Me' features & local logistics." },
                        { id: "BD", name: "Bangladesh", desc: "Enables 'Near Me' features & local logistics." },
                        { id: "GLOBAL", name: "Global Marketplace", desc: "Buy-only access with global shipping context." },
                    ].map((c) => (
                        <div
                            key={c.id}
                            onClick={() => setCountry(c.id)}
                            className={`bd-card bd-card-pad cursor-pointer transition-all ${country === c.id ? "border-orange-500 bg-orange-500/10" : "hover:border-slate-700"
                                }`}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontWeight: 700 }}>{c.name}</span>
                                {country === c.id && <CheckIcon size={16} className="text-orange-500" />}
                            </div>
                            <p className="text-xs text-slate-400">{c.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bd-row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                    <Button variant="ghost" onClick={() => router.push("/onboarding/language")}>
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
