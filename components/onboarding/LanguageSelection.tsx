// components/onboarding/LanguageSelection.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button } from "@/components/ui";
import { Icons } from "@/components/icons/icons";
import { setOnboardingCookie } from "@/lib/onboarding";

export function LanguageSelection({ initialLang }: { initialLang: string }) {
    const router = useRouter();
    const [lang, setLang] = useState(initialLang);

    const handleNext = () => {
        setOnboardingCookie("bd_lang", lang);
        router.push("/account-type");
    };

    const GlobeIcon = Icons.get("Globe");
    const NextIcon = Icons.get("ChevronRight");
    const BackIcon = Icons.get("ChevronLeft");
    const CheckIcon = Icons.get("Check");

    return (
        <Card className="max-w-md w-full animate-fadeIn">
            <CardBody className="bd-grid" style={{ gap: 24 }}>
                <div className="text-center">
                    <GlobeIcon size={40} className="mx-auto mb-4 text-orange-400" />
                    <h1 className="bd-h1">Choose Language</h1>
                    <p className="bd-p">Select your preferred language.</p>
                </div>

                <div className="bd-grid" style={{ gap: 12 }}>
                    {[
                        { code: "en", name: "English" },
                        { code: "ha", name: "Hausa" },
                        { code: "bn", name: "বাংলা (Bengali)" },
                    ].map((l) => (
                        <div
                            key={l.code}
                            onClick={() => setLang(l.code)}
                            className={`bd-card bd-card-pad cursor-pointer transition-all ${lang === l.code ? "border-orange-500 bg-orange-500/10" : "hover:border-slate-700"
                                }`}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <span style={{ fontWeight: 700 }}>{l.name}</span>
                            {lang === l.code && <CheckIcon size={16} className="text-orange-500" />}
                        </div>
                    ))}
                </div>

                <div className="bd-row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                    <Button variant="ghost" onClick={() => router.push("/")}>
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
