"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { Button, Card, CardBody } from "@/components/ui";
import { useToast } from "@/components/ui/toast/ToastProvider";

function BuyerRegisterFormInner() {
    const router = useRouter();
    const { showToast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await apiPost<any>("/api/auth/register", {
                email,
                password,
                role: "BUYER",
                country: "US", // Default for global buyer
                profileData: {
                    displayName: name,
                    companyName: name,
                },
            });

            if (result.success) {
                showToast("Welcome to Banadama!", "success");
                router.push("/buyer/dashboard");
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
        <div className="w-full max-w-md">
            <Card className="glass animate-fadeIn">
                <CardBody className="flex flex-col gap-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-orange-500">Create Buyer Account</h1>
                        <p className="text-slate-400 mt-2">Start sourcing from verified suppliers.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <input
                                className="bd-input glass"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your full name"
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

                        <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export function BuyerRegisterForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BuyerRegisterFormInner />
        </Suspense>
    );
}
