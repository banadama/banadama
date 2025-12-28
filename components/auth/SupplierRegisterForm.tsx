"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost } from "@/lib/api";
import { Icons } from "@/components/icons/icons";
import { Button, Card, CardBody, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/toast/ToastProvider";

type SupplierRole = "SUPPLIER" | "CREATOR" | "AFFILIATE";

interface RoleOption {
    id: SupplierRole;
    label: string;
    description: string;
    icon: keyof typeof Icons;
}

const ROLES: RoleOption[] = [
    {
        id: "SUPPLIER",
        label: "Supplier / Factory",
        description: "Sell products to global buyers",
        icon: "Building",
    },
    {
        id: "CREATOR",
        label: "Creator",
        description: "Digital products or media services",
        icon: "Brush",
    },
    {
        id: "AFFILIATE",
        label: "Affiliate",
        description: "Earn by referring buyers/sellers",
        icon: "Link",
    },
];

function SupplierRegisterFormInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedRole, setSelectedRole] = useState<SupplierRole>("SUPPLIER");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("NG");
    const [businessType, setBusinessType] = useState("FACTORY");

    const handleNext = (e?: FormEvent) => {
        e?.preventDefault();
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await apiPost<any>("/api/auth/register", {
                email,
                password,
                role: selectedRole,
                country,
                profileData: {
                    displayName: name,
                    businessName: name,
                    type: businessType,
                },
            });

            if (result.success) {
                showToast("Supplier account created! Redirecting...", "success");
                router.push("/supplier/dashboard");
            } else {
                showToast(result.error || "Registration failed", "error");
            }
        } catch (err: any) {
            showToast(err.message || "Registration failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl">
            <Card className="glass animate-fadeIn">
                <CardBody className="flex flex-col gap-8">
                    {/* Progress */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 w-16 rounded-full transition-all ${step >= s ? 'bg-orange-500' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="flex flex-col gap-6">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-orange-500">What is your role?</h1>
                                <p className="text-slate-400 mt-2">Choose how you want to partner with us.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {ROLES.map(role => {
                                    const Icon = Icons[role.icon];
                                    const isSelected = selectedRole === role.id;
                                    return (
                                        <div
                                            key={role.id}
                                            onClick={() => setSelectedRole(role.id)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-orange-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold">{role.label}</h3>
                                                <p className="text-sm text-slate-400">{role.description}</p>
                                            </div>
                                            {isSelected && <Icons.Check size={20} className="text-orange-500" />}
                                        </div>
                                    );
                                })}
                            </div>

                            <Button onClick={() => handleNext()} variant="primary" size="lg" className="w-full mt-4">
                                Continue
                                <Icons.ChevronRight size={18} />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleNext} className="flex flex-col gap-6">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-orange-500">Account Details</h1>
                                <p className="text-slate-400 mt-2">Set up your business credentials.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-300">Full Name / Business Name</label>
                                    <input
                                        className="bd-input glass"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Acme Factory"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        className="bd-input glass"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-300">Password</label>
                                    <input
                                        type="password"
                                        className="bd-input glass"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Min 8 characters"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleBack} variant="secondary" className="flex-1">Back</Button>
                                <Button type="submit" variant="primary" className="flex-2">Continue</Button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-6">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-orange-500">Final Verification</h1>
                                <p className="text-slate-400 mt-2">Select your operating country.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-300">Select Country</label>
                                    <select
                                        className="bd-input glass"
                                        value={country}
                                        onChange={e => setCountry(e.target.value)}
                                    >
                                        <option value="NG">Nigeria 🇳🇬</option>
                                        <option value="BD">Bangladesh 🇧🇩</option>
                                        <option value="GH">Ghana 🇬🇭</option>
                                    </select>
                                </div>

                                {selectedRole === "SUPPLIER" && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-300">Business Type</label>
                                        <select
                                            className="bd-input glass"
                                            value={businessType}
                                            onChange={e => setBusinessType(e.target.value)}
                                        >
                                            <option value="FACTORY">Factory</option>
                                            <option value="WHOLESALER">Wholesaler</option>
                                            <option value="DISTRIBUTOR">Distributor</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 mt-4">
                                <Button onClick={handleBack} variant="secondary" className="flex-1">Back</Button>
                                <Button onClick={handleSubmit} variant="primary" className="flex-2" isLoading={loading}>
                                    Complete Onboarding
                                </Button>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export function SupplierRegisterForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SupplierRegisterFormInner />
        </Suspense>
    );
}
