// app/(admin)/admin/overview/page.tsx - Admin Overview Dashboard
"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icons } from "@/components/icons";

export default function AdminOverviewPage() {
    return (
        <div className="bd-grid" style={{ gap: 24 }}>
            <div className="bd-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 className="bd-h1">Admin Overview</h1>
                    <p className="bd-p" style={{ opacity: 0.7 }}>
                        Platform health and key metrics
                    </p>
                </div>
                <Badge variant="success">All Systems Operational</Badge>
            </div>

            {/* Quick Stats */}
            <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Users size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Total Users</div>
                                <div style={{ fontSize: 28, fontWeight: 900 }}>2,847</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Orders size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Active Orders</div>
                                <div style={{ fontSize: 28, fontWeight: 900 }}>156</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Product size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Products</div>
                                <div style={{ fontSize: 28, fontWeight: 900 }}>1,234</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="bd-row" style={{ gap: 12, alignItems: "center" }}>
                            <Icons.Bank size={24} />
                            <div>
                                <div className="bd-small" style={{ opacity: 0.7 }}>Escrow Balance</div>
                                <div style={{ fontSize: 28, fontWeight: 900 }}>₦45.2M</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="bd-grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                <Card>
                    <CardHeader>
                        <div className="bd-h3">Recent Activity</div>
                    </CardHeader>
                    <CardBody className="bd-grid" style={{ gap: 12 }}>
                        {[
                            { action: "New supplier verified", time: "2 min ago", type: "success" },
                            { action: "Order #4521 completed", time: "15 min ago", type: "success" },
                            { action: "RFQ assigned to supplier", time: "32 min ago", type: "default" },
                            { action: "Payout processed - ₦250,000", time: "1 hour ago", type: "default" },
                            { action: "New verification request", time: "2 hours ago", type: "warning" },
                        ].map((item, i) => (
                            <div key={i} className="bd-row" style={{ justifyContent: "space-between" }}>
                                <div>{item.action}</div>
                                <Badge variant={item.type as any}>{item.time}</Badge>
                            </div>
                        ))}
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="bd-h3">Pending Actions</div>
                    </CardHeader>
                    <CardBody className="bd-grid" style={{ gap: 12 }}>
                        <div className="bd-row" style={{ justifyContent: "space-between" }}>
                            <div className="bd-row" style={{ gap: 8 }}>
                                <Icons.Shield size={16} />
                                <span>Verifications</span>
                            </div>
                            <Badge variant="warning">12</Badge>
                        </div>
                        <div className="bd-row" style={{ justifyContent: "space-between" }}>
                            <div className="bd-row" style={{ gap: 8 }}>
                                <Icons.Bank size={16} />
                                <span>Payouts</span>
                            </div>
                            <Badge variant="warning">5</Badge>
                        </div>
                        <div className="bd-row" style={{ justifyContent: "space-between" }}>
                            <div className="bd-row" style={{ gap: 8 }}>
                                <Icons.Warning size={16} />
                                <span>Disputes</span>
                            </div>
                            <Badge variant="danger">3</Badge>
                        </div>
                        <div className="bd-row" style={{ justifyContent: "space-between" }}>
                            <div className="bd-row" style={{ gap: 8 }}>
                                <Icons.RFQ size={16} />
                                <span>Unassigned RFQs</span>
                            </div>
                            <Badge>8</Badge>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* System Health */}
            <Card>
                <CardHeader>
                    <div className="bd-h3">System Health</div>
                </CardHeader>
                <CardBody>
                    <div className="bd-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                        {[
                            { name: "API", status: "Operational", ok: true },
                            { name: "Database", status: "Operational", ok: true },
                            { name: "Payments", status: "Operational", ok: true },
                            { name: "Notifications", status: "Operational", ok: true },
                        ].map((service) => (
                            <div key={service.name} className="bd-row" style={{ gap: 8, alignItems: "center" }}>
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: service.ok ? "hsl(var(--bd-success))" : "hsl(var(--bd-danger))",
                                    }}
                                />
                                <div>
                                    <div style={{ fontWeight: 700 }}>{service.name}</div>
                                    <div className="bd-small" style={{ opacity: 0.7 }}>{service.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
