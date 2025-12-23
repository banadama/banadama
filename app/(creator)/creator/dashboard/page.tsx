import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Icons } from "@/components/icons/icons";

export default async function CreatorDashboard() {
  const user = await requireRole("CREATOR");

  let listings: any[] = [];
  let orders: any[] = [];
  let stats = {
    totalListings: 0,
    activeListings: 0,
    digitalProducts: 0,
    localServices: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  };

  try {
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: user.id },
    });

    if (creator) {
      // Fetch listings
      listings = await prisma.creatorListing.findMany({
        where: { creatorId: creator.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      // Fetch orders
      orders = await prisma.creatorOrder.findMany({
        where: { creatorId: creator.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      // Calculate stats
      const allListings = await prisma.creatorListing.findMany({
        where: { creatorId: creator.id },
      });

      const allOrders = await prisma.creatorOrder.findMany({
        where: { creatorId: creator.id },
      });

      stats.totalListings = allListings.length;
      stats.activeListings = allListings.filter((l: any) => l.status === "ACTIVE").length;
      stats.digitalProducts = allListings.filter((l: any) => l.type === "DIGITAL").length;
      stats.localServices = allListings.filter((l: any) => l.type === "LOCAL_SERVICE").length;
      stats.totalOrders = allOrders.length;
      stats.activeOrders = allOrders.filter((o: any) =>
        ["PAID_ESCROW", "IN_PROGRESS", "DELIVERED"].includes(o.status)
      ).length;
      stats.completedOrders = allOrders.filter((o: any) => o.status === "CONFIRMED").length;
      stats.totalRevenue = allOrders
        .filter((o: any) => o.status === "CONFIRMED")
        .reduce((sum: number, o: any) => sum + (parseFloat(o.price) || 0), 0);
    }
  } catch (error) {
    console.error("Error fetching creator dashboard data:", error);
  }

  const PackageIcon = Icons.get("Package");
  const LayersIcon = Icons.get("Layers");
  const MapPinIcon = Icons.get("MapPin");
  const ShoppingCartIcon = Icons.get("Cart");
  const CheckCircleIcon = Icons.get("Check");
  const DollarIcon = Icons.get("CreditCard");
  const PlusIcon = Icons.get("Plus");
  const ListIcon = Icons.get("List");

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontWeight: 950, fontSize: 28 }}>Creator Dashboard</div>
        <a className="bd-btn bd-btn-primary" href="/creator/listings/new">
          <PlusIcon size={18} /> New Listing
        </a>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="bd-card bd-card-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <PackageIcon size={18} style={{ color: "var(--bd-brand)" }} />
            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Total Listings</div>
          </div>
          <div style={{ fontWeight: 950, fontSize: 28 }}>{stats.totalListings}</div>
          <div style={{ color: "var(--bd-muted)", fontSize: 12, marginTop: 4 }}>
            {stats.activeListings} active
          </div>
        </div>

        <div className="bd-card bd-card-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <LayersIcon size={18} style={{ color: "var(--bd-brand)" }} />
            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Digital Products</div>
          </div>
          <div style={{ fontWeight: 950, fontSize: 28 }}>{stats.digitalProducts}</div>
        </div>

        <div className="bd-card bd-card-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <MapPinIcon size={18} style={{ color: "var(--bd-brand)" }} />
            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Local Services</div>
          </div>
          <div style={{ fontWeight: 950, fontSize: 28 }}>{stats.localServices}</div>
        </div>

        <div className="bd-card bd-card-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <ShoppingCartIcon size={18} style={{ color: "var(--bd-brand)" }} />
            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Active Orders</div>
          </div>
          <div style={{ fontWeight: 950, fontSize: 28 }}>{stats.activeOrders}</div>
          <div style={{ color: "var(--bd-muted)", fontSize: 12, marginTop: 4 }}>
            {stats.totalOrders} total
          </div>
        </div>

        <div className="bd-card bd-card-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <CheckCircleIcon size={18} style={{ color: "var(--bd-success)" }} />
            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Completed</div>
          </div>
          <div style={{ fontWeight: 950, fontSize: 28 }}>{stats.completedOrders}</div>
        </div>

        <div className="bd-card bd-card-pad">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <DollarIcon size={18} style={{ color: "var(--bd-success)" }} />
            <div style={{ color: "var(--bd-muted)", fontSize: 14 }}>Total Revenue</div>
          </div>
          <div style={{ fontWeight: 950, fontSize: 28 }}>
            ${stats.totalRevenue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)" }}>
        <div style={{ fontWeight: 900, marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="bd-btn bd-btn-primary" href="/creator/listings/new">
            <PlusIcon size={18} /> Create New Listing
          </a>
          <a className="bd-btn" href="/creator/listings">
            <ListIcon size={18} /> Manage All Listings
          </a>
          <a className="bd-btn" href="/creator/orders">
            <ShoppingCartIcon size={18} /> View Orders
          </a>
          <a className="bd-btn" href="/creator/wallet">
            <DollarIcon size={18} /> Wallet
          </a>
        </div>
      </div>

      {/* Recent Listings */}
      {listings.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Recent Listings</div>
            <a className="bd-btn" href="/creator/listings">View All</a>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {listings.map((l: any) => (
              <div key={l.id} className="bd-card bd-card-pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>{l.title}</div>
                  <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                    {l.type} • {l.category} • {l.currency} {l.price || "Quoted"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={`bd-badge ${l.status === "ACTIVE" ? "bd-badge-success" : ""}`}>
                    {l.status}
                  </span>
                  <a className="bd-btn bd-btn-sm" href={`/creator/listings/${l.id}/edit`}>Edit</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Recent Orders</div>
            <a className="bd-btn" href="/creator/orders">View All</a>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {orders.map((o: any) => (
              <div key={o.id} className="bd-card bd-card-pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>Order #{o.id.slice(0, 8)}</div>
                  <div style={{ color: "var(--bd-muted)", fontSize: 13 }}>
                    {o.currency} {o.price} • {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="bd-badge">{o.status}</span>
                  <a className="bd-btn bd-btn-sm" href={`/creator/orders/${o.id}`}>View</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {listings.length === 0 && (
        <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: "60px 20px" }}>
          <PackageIcon size={48} style={{ opacity: 0.3, margin: "0 auto 16px" }} />
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Start Selling Your Products</div>
          <div style={{ color: "var(--bd-muted)", marginBottom: 20 }}>
            Create your first listing to start earning on the platform
          </div>
          <a className="bd-btn bd-btn-primary" href="/creator/listings/new">
            <PlusIcon size={18} /> Create Your First Listing
          </a>
        </div>
      )}
    </div>
  );
}
