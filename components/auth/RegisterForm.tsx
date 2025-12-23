// components/auth/RegisterForm.tsx
"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { Button, Card, CardBody, Badge } from "@/components/ui";
import { getOnboardingCookie } from "@/lib/onboarding";

type UserRole = "BUYER" | "SUPPLIER" | "CREATOR" | "AFFILIATE";

interface RoleOption {
    id: UserRole;
    label: string;
    description: string;
    iconName: string;
    restricted?: boolean;
}

const ROLES: RoleOption[] = [
    {
        id: "BUYER",
        label: "Buyer",
        description: "Buy products from verified suppliers worldwide",
        iconName: "Cart",
    },
    {
        id: "SUPPLIER",
        label: "Supplier",
        description: "Factory or Wholesaler in Nigeria/Bangladesh",
        iconName: "Building",
        restricted: true,
    },
    {
        id: "CREATOR",
        label: "Creator",
        description: "Offer digital products or local services",
        iconName: "Brush",
        restricted: true,
    },
    {
        id: "AFFILIATE",
        label: "Affiliate",
        description: "Earn commission by referring sales",
        iconName: "Link",
    },
];

const LOCAL_COUNTRIES = ["NG", "BD"];

function RegisterFormInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Progress
    const [step, setStep] = useState(1);

    // Prefill Data
    const intentCountry = searchParams.get("country") || getOnboardingCookie("bd_country") || "GLOBAL";
    const intentRole = searchParams.get("intent") as UserRole || getOnboardingCookie("bd_intent_role") as UserRole || "BUYER";
    const intentSubtype = searchParams.get("subtype") || getOnboardingCookie("bd_intent_subtype") || "";

    // Step 1: Account info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Step 2: Role selection
    const [selectedRole, setSelectedRole] = useState<UserRole>(intentRole);

    // Step 3: Location (for local creators)
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const isLocalMode = LOCAL_COUNTRIES.includes(intentCountry);
    const LOCAL_CREATOR_TYPES = ["MODELLING", "PHOTOGRAPHER", "VIDEOGRAPHER"];
    const needsLocation = selectedRole === "CREATOR" && LOCAL_CREATOR_TYPES.includes(intentSubtype);

    const handleStep1Submit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) return setErrorMsg("All fields are required");
        setStep(2);
    };

    const handleRoleSelect = (role: UserRole) => {
        const roleConfig = ROLES.find((r) => r.id === role);
        if (roleConfig?.restricted && !isLocalMode) {
            return setErrorMsg(`${roleConfig.label} is only available in NG/BD. Check your country setting.`);
        }
        setErrorMsg(null);
        setSelectedRole(role);
    };

    const handleFinalSubmit = async () => {
        if (needsLocation && step === 2) {
            setStep(3);
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const result = await apiPost<any>("/api/auth/register", {
                email,
                password,
                role: selectedRole,
                country: intentCountry === "GLOBAL" ? "US" : intentCountry,
                profileData: {
                    displayName: name,
                    companyName: name,
                    businessName: name,
                    type: intentSubtype, // Factory/Wholesaler/Retail
                    creatorType: intentSubtype, // Digital/Local
                    state,
                    city,
                },
            });

            if (result.success) {
                const dashboardMap: Record<string, string> = {
                    BUYER: "/buyer/dashboard",
                    CREATOR: "/creator/dashboard",
                    AFFILIATE: "/affiliate/dashboard",
                };

                let targetPath = "/";
                if (selectedRole === "SUPPLIER") {
                    if (intentSubtype === "FACTORY") targetPath = "/factory/dashboard";
                    else if (intentSubtype === "WHOLESALER") targetPath = "/wholesaler/dashboard";
                    else targetPath = "/buyer/dashboard"; // Retail or other defaults to buyer or specific dashboard
                } else {
                    targetPath = dashboardMap[selectedRole] || "/";
                }

                router.push(targetPath);
            } else {
                setErrorMsg(result.error || "Registration failed");
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const NextIcon = Icons.get("ChevronRight");
    const BackIcon = Icons.get("ChevronLeft");
    const ShieldIcon = Icons.get("ShieldCheck");
    const MapIcon = Icons.get("Location");
    const CheckIcon = Icons.get("Check");

    return (
        <div className="w-full max-w-lg">
            <Card className="animate-fadeIn">
                <CardBody className="bd-grid" style={{ gap: 24 }}>
                    {/* Progress */}
                    <div className="bd-row" style={{ justifyContent: 'center', gap: 8 }}>
                        {[1, 2, 3].map(s => (
                            (s < 3 || needsLocation) && (
                                <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${step >= s ? 'bg-orange-500' : 'bg-slate-800'}`} />
                            )
                        ))}
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleStep1Submit} className="bd-grid" style={{ gap: 16 }}>
                            <div className="text-center">
                                <h1 className="bd-h2 text-orange-500">Account Security</h1>
                                <p className="bd-p">Set up your credentials.</p>
                            </div>

                            {intentSubtype && (
                                <div className="bd-row" style={{ justifyContent: 'center' }}>
                                    <Badge variant="warning">{intentSubtype.replace('_', ' ')}</Badge>
                                </div>
                            )}

                            <div className="bd-grid" style={{ gap: 8 }}>
                                <label className="bd-label">Full Name</label>
                                <input
                                    className="bd-input"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Aliko Dangote"
                                    required
                                />
                            </div>

                            <div className="bd-grid" style={{ gap: 8 }}>
                                <label className="bd-label">Email Address</label>
                                <input
                                    type="email"
                                    className="bd-input"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div className="bd-grid" style={{ gap: 8 }}>
                                <label className="bd-label">Password</label>
                                <input
                                    type="password"
                                    className="bd-input"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Min 8 characters"
                                    required
                                    minLength={8}
                                />
                            </div>

                            {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}

                            <Button type="submit" variant="primary" size="lg" className="w-full">
                                Continue
                                <NextIcon size={18} />
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="bd-grid" style={{ gap: 20 }}>
                            <div className="text-center">
                                <h1 className="bd-h2 text-orange-500">Confirm Role</h1>
                                <p className="bd-p">We've pre-selected based on your choice.</p>
                            </div>

                            <div className="bd-grid" style={{ gap: 10 }}>
                                {ROLES.map(r => {
                                    const Icon = Icons.get(r.iconName);
                                    const isSelected = selectedRole === r.id;
                                    const isDisabled = r.restricted && !isLocalMode;

                                    return (
                                        <div
                                            key={r.id}
                                            onClick={() => !isDisabled && handleRoleSelect(r.id)}
                                            className={`bd-card bd-card-pad bd-row cursor-pointer transition-all ${isSelected ? 'border-orange-500 bg-orange-500/10' :
                                                isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-slate-700'
                                                }`}
                                            style={{ gap: 14, position: 'relative' }}
                                        >
                                            <div className="bg-slate-800 p-2 rounded-lg">
                                                <Icon size={24} className={isSelected ? 'text-orange-500' : 'text-slate-400'} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="bd-row" style={{ gap: 8 }}>
                                                    <span style={{ fontWeight: 800 }}>{r.label}</span>
                                                    {r.restricted && <Badge size="sm">NG/BD</Badge>}
                                                </div>
                                                <p className="text-xs text-slate-400">{r.description}</p>
                                            </div>
                                            {isSelected && <CheckIcon size={18} className="text-orange-500" />}
                                        </div>
                                    );
                                })}
                            </div>

                            {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}

                            <div className="bd-row" style={{ gap: 12 }}>
                                <Button onClick={() => setStep(1)} className="flex-1">
                                    <BackIcon size={18} />
                                    Back
                                </Button>
                                <Button variant="primary" onClick={handleFinalSubmit} className="flex-1" disabled={loading}>
                                    {loading ? "Registering..." : needsLocation ? "Next" : "Complete"}
                                    <NextIcon size={18} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bd-grid" style={{ gap: 20 }}>
                            <div className="text-center">
                                <MapIcon size={40} className="mx-auto text-orange-500 mb-2" />
                                <h1 className="bd-h2">Service Area</h1>
                                <p className="bd-p">Required for local service creators.</p>
                            </div>

                            <div className="bd-grid" style={{ gap: 8 }}>
                                <label className="bd-label">State / Region</label>
                                <input
                                    className="bd-input"
                                    value={state}
                                    onChange={e => setState(e.target.value)}
                                    placeholder="e.g. Lagos"
                                    required
                                />
                            </div>

                            <div className="bd-grid" style={{ gap: 8 }}>
                                <label className="bd-label">City / Town</label>
                                <input
                                    className="bd-input"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    placeholder="e.g. Ikeja"
                                    required
                                />
                            </div>

                            <div className="bd-row" style={{ gap: 12 }}>
                                <Button onClick={() => setStep(2)}>
                                    <BackIcon size={18} />
                                    Back
                                </Button>
                                <Button variant="primary" onClick={handleFinalSubmit} className="flex-1" disabled={loading}>
                                    {loading ? "Registering..." : "Complete Registration"}
                                    <ShieldIcon size={18} />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            <p className="text-center mt-6 text-slate-400 text-sm">
                By registering, you agree to our Terms and Escrow Rules.
            </p>
        </div>
    );
}

export function RegisterForm() {
    return (
        <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <RegisterFormInner />
        </Suspense>
    );
}
