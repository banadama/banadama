// app/(admin)/admin/studio/locations/page.tsx - Admin Locations Management
import { requireRole } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { LocationEditor } from "@/components/admin/actions";
import { Icons } from "@/components/icons/icons";

async function getLocations() {
    try {
        const res = await apiGet<{ ok: boolean; data: { locations: any[] } }>("/api/admin/locations");
        return res.data?.locations || [];
    } catch {
        return [];
    }
}

export default async function AdminLocationsPage() {
    await requireRole("ADMIN");
    const locations = await getLocations();

    // Group by country
    const ngLocations = locations.filter((l: any) => l.country === "NG");
    const bdLocations = locations.filter((l: any) => l.country === "BD");

    return (
        <div className="bd-container bd-page">
            <div style={{ marginBottom: 20 }}>
                <h1 className="bd-h1">Locations</h1>
                <p className="bd-p" style={{ opacity: 0.7 }}>
                    Manage local trading locations (NG/BD) for Buy Near Me and local suppliers
                </p>
            </div>

            {/* New Location Form */}
            <div style={{ marginBottom: 30 }}>
                <LocationEditor />
            </div>

            {/* Nigeria Locations */}
            <div style={{ marginBottom: 30 }}>
                <h2 className="bd-h2">Nigeria Locations ({ngLocations.length})</h2>
                {ngLocations.length === 0 ? (
                    <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: 20, opacity: 0.5 }}>
                        <Icons.Location size={24} style={{ margin: "0 auto 8px" }} />
                        <div className="bd-small">No Nigeria locations yet</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                        {ngLocations.map((loc: any) => (
                            <div key={loc.id} className="bd-card bd-card-pad">
                                <LocationEditor initial={loc} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bangladesh Locations */}
            <div>
                <h2 className="bd-h2">Bangladesh Locations ({bdLocations.length})</h2>
                {bdLocations.length === 0 ? (
                    <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: 20, opacity: 0.5 }}>
                        <Icons.Location size={24} style={{ margin: "0 auto 8px" }} />
                        <div className="bd-small">No Bangladesh locations yet</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                        {bdLocations.map((loc: any) => (
                            <div key={loc.id} className="bd-card bd-card-pad">
                                <LocationEditor initial={loc} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
