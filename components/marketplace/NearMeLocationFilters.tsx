// components/marketplace/NearMeLocationFilters.tsx - State/City/Radius Filters
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import { Icons } from "@/components/icons/icons";

type Loc = { id: string; country: "NG" | "BD"; state: string; city: string };

export function NearMeLocationFilters({ country }: { country: "NG" | "BD" }) {
    const router = useRouter();
    const sp = useSearchParams();

    const [locations, setLocations] = React.useState<Loc[]>([]);
    const [state, setState] = React.useState(sp.get("state") ?? "");
    const [city, setCity] = React.useState(sp.get("city") ?? "");
    const [radiusKm, setRadiusKm] = React.useState(sp.get("radiusKm") ?? "25");

    // Load locations for this country
    React.useEffect(() => {
        (async () => {
            try {
                const res = await apiGet(`/api/locations?country=${country}`);
                const list: Loc[] = res?.data?.locations ?? res?.locations ?? [];
                setLocations(list);
            } catch {
                setLocations([]);
            }
        })();
    }, [country]);

    // Sync with URL changes (back/forward)
    React.useEffect(() => {
        setState(sp.get("state") ?? "");
        setCity(sp.get("city") ?? "");
        setRadiusKm(sp.get("radiusKm") ?? "25");
    }, [sp]);

    // Get unique states
    const states = React.useMemo(() => {
        const s = new Map<string, number>();
        locations.forEach((l) => s.set(l.state, 1));
        return Array.from(s.keys()).sort();
    }, [locations]);

    // Get cities for selected state
    const cities = React.useMemo(() => {
        const list = locations.filter((l) => (state ? l.state === state : true));
        const c = new Map<string, number>();
        list.forEach((l) => c.set(l.city, 1));
        return Array.from(c.keys()).sort();
    }, [locations, state]);

    function apply() {
        const p = new URLSearchParams(sp.toString());
        p.set("country", country);

        if (state) p.set("state", state); else p.delete("state");
        if (city) p.set("city", city); else p.delete("city");

        const r = Number(radiusKm);
        if (!Number.isNaN(r) && r > 0) p.set("radiusKm", String(r));
        else p.delete("radiusKm");

        p.set("page", "1");

        router.push(`/near-me?${p.toString()}`);
    }

    function reset() {
        setState("");
        setCity("");
        setRadiusKm("25");
        router.push(`/near-me?country=${country}`);
    }

    const MapPinIcon = Icons.get("MapPin");
    const XIcon = Icons.get("X");
    const SearchIcon = Icons.get("Search");

    return (
        <div className="bd-card bd-card-pad" style={{ boxShadow: "none", display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontWeight: 950, display: "flex", gap: 8, alignItems: "center" }}>
                    <MapPinIcon size={18} /> Location Filter
                </div>
                <button className="bd-btn" onClick={reset}>
                    <XIcon size={18} /> Reset
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                <select
                    className="bd-input"
                    value={state}
                    onChange={(e) => { setState(e.target.value); setCity(""); }}
                >
                    <option value="">All States</option>
                    {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="bd-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!state && cities.length > 40}
                >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <select className="bd-input" value={radiusKm} onChange={(e) => setRadiusKm(e.target.value)}>
                    <option value="5">5 km radius</option>
                    <option value="10">10 km radius</option>
                    <option value="25">25 km radius</option>
                    <option value="50">50 km radius</option>
                    <option value="100">100 km radius</option>
                </select>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="bd-btn bd-btn-primary" onClick={apply} style={{ justifyContent: "center" }}>
                    <SearchIcon size={18} /> Apply Location
                </button>
            </div>
        </div>
    );
}
