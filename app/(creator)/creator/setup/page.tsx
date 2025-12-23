// app/(creator)/creator/setup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCreatorTypes, CreatorTypeInfo } from "@/types/creator";

export default function CreatorSetupPage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const creatorTypes = getAllCreatorTypes();

    const handleSetup = async () => {
        if (!selectedType) {
            setError("Please select a creator type");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/creator/setup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    creatorType: selectedType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to setup creator profile");
            }

            // Redirect to type-specific dashboard
            const typeInfo = creatorTypes.find((t) => t.type === selectedType);
            if (typeInfo) {
                router.push(`/creator/${typeInfo.slug}/dashboard`);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-12">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Welcome, Creator! 🎨
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Choose your specialization to get started. You can showcase your work,
                        connect with clients, and grow your creative business.
                    </p>
                </div>

                {/* Creator Type Selection */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {creatorTypes.map((type) => (
                        <button
                            key={type.type}
                            onClick={() => setSelectedType(type.type)}
                            className={`group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all ${selectedType === type.type
                                    ? `border-white/50 bg-gradient-to-br ${type.color}`
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                }`}
                        >
                            <div
                                className={`absolute inset-0 transition-opacity ${selectedType === type.type
                                        ? "bg-slate-950/40"
                                        : "bg-slate-950/60 group-hover:bg-slate-950/50"
                                    }`}
                            ></div>

                            <div className="relative">
                                {/* Icon */}
                                <div className="text-5xl mb-4">{type.icon}</div>

                                {/* Label */}
                                <h3 className="text-xl font-bold text-white mb-2">{type.label}</h3>

                                {/* Description */}
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {type.description}
                                </p>

                                {/* Selected Indicator */}
                                {selectedType === type.type && (
                                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                                            ✓
                                        </span>
                                        Selected
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/50 bg-red-500/10 p-4 text-center">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {/* Continue Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSetup}
                        disabled={!selectedType || loading}
                        className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-12 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                        {loading ? "Setting up..." : "Continue to Dashboard →"}
                    </button>
                </div>

                {/* Help Text */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't worry, you can update your specialization later in settings
                </p>
            </div>
        </div>
    );
}
