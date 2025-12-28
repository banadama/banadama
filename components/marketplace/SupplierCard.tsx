// components/marketplace/SupplierCard.tsx - Premium Dashboard Style
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { Icons } from "../icons/icons";

interface SupplierCardProps {
    supplier: {
        id: string;
        name: string;
        type: string;
        verification: string;
        city?: string;
        state?: string;
        country?: string;
        rating?: number;
        reviewsCount?: number;
        mainCategory?: string;
        logoUrl?: string;
        stats?: {
            fulfillmentRate?: string;
            responseTime?: string;
        }
    };
}

export function SupplierCard({ supplier }: SupplierCardProps) {
    const isVerified = supplier.verification === "VERIFIED" || supplier.verification === "GOLD";
    const href = `/suppliers/${supplier.id}`;

    return (
        <Card className="group bg-white border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 flex flex-col h-full overflow-hidden rounded-[1.5rem] relative">
            <Link href={href} className="relative aspect-[16/9] overflow-hidden bg-slate-50">
                <div
                    className="w-full h-full transition-transform duration-700 group-hover:scale-110 flex items-center justify-center p-8"
                >
                    {supplier.logoUrl ? (
                        <img src={supplier.logoUrl} alt={supplier.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400">
                            <Icons.Building size={32} />
                        </div>
                    )}
                </div>

                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {isVerified && (
                        <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 uppercase tracking-widest flex items-center gap-1">
                            <Icons.ShieldCheck size={12} /> Verified
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <CardBody className="flex flex-col gap-3 p-5 flex-1 relative">
                <div className="flex items-center justify-between">
                    <div className="flex text-[#FFA41C] gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Icons.Star key={i} size={12} fill={i < (supplier.rating || 4) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {supplier.reviewsCount || 0} Reviews
                    </span>
                </div>

                <Link href={href}>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-tight group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                        {supplier.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <Icons.Location size={12} className="text-slate-400" />
                    <span>{supplier.city}, {supplier.country || "Nigeria"}</span>
                </div>

                <div className="flex flex-wrap gap-2 py-2">
                    <Badge variant="glass" className="bg-slate-50 text-slate-600 border-slate-100 rounded-lg text-[10px] font-bold">
                        {supplier.mainCategory || "General Supplier"}
                    </Badge>
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-4 border-t border-slate-50">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Response</div>
                            <div className="text-xs font-black text-slate-900">{supplier.stats?.responseTime || "< 24h"}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Fulfillment</div>
                            <div className="text-xs font-black text-emerald-600">{supplier.stats?.fulfillmentRate || "98%"}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <Link href={href}>
                            <Button className="w-full bg-slate-900 hover:bg-black text-white text-[10px] font-black py-3 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest">
                                Visit Showroom
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
