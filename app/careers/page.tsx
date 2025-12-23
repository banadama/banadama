"use client";

import { Icons } from "@/components/icons/icons";
import { useState } from "react";

export default function CareersPage() {
    const BriefcaseIcon = Icons.get("Briefcase");
    const MapPinIcon = Icons.get("MapPin");
    const ClockIcon = Icons.get("Clock");
    const UsersIcon = Icons.get("Users");
    const RocketIcon = Icons.get("TrendingUp");
    const GlobeIcon = Icons.get("Globe");
    const TrendingUpIcon = Icons.get("TrendingUp");
    const LightbulbIcon = Icons.get("Star");
    const DollarIcon = Icons.get("CreditCard");
    const HeartIcon = Icons.get("Heart");
    const HomeIcon = Icons.get("Home");
    const BookIcon = Icons.get("BookOpen");
    const CalendarIcon = Icons.get("Calendar");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const jobOpenings = [
        {
            id: 1,
            title: "Senior Full-Stack Engineer",
            department: "Engineering",
            location: "Lagos, Nigeria (Remote)",
            type: "Full-time",
            description: "Build and scale our marketplace platform using Next.js, Node.js, and PostgreSQL."
        },
        {
            id: 2,
            title: "Operations Manager",
            department: "Operations",
            location: "Dhaka, Bangladesh",
            type: "Full-time",
            description: "Manage supplier onboarding, order fulfillment, and logistics coordination."
        },
        {
            id: 3,
            title: "Product Designer",
            department: "Design",
            location: "Remote",
            type: "Full-time",
            description: "Design intuitive experiences for buyers and suppliers across web and mobile."
        },
        {
            id: 4,
            title: "Business Development Associate",
            department: "Sales",
            location: "Lagos, Nigeria",
            type: "Full-time",
            description: "Onboard new suppliers and build partnerships with key stakeholders."
        },
        {
            id: 5,
            title: "Customer Support Specialist",
            department: "Support",
            location: "Remote",
            type: "Full-time",
            description: "Provide exceptional support to buyers and suppliers via chat, email, and phone."
        },
        {
            id: 6,
            title: "Marketing Manager",
            department: "Marketing",
            location: "Remote",
            type: "Full-time",
            description: "Lead digital marketing campaigns to grow buyer and supplier acquisition."
        }
    ];

    const filteredJobs = selectedDepartment === "all"
        ? jobOpenings
        : jobOpenings.filter(job => job.department === selectedDepartment);

    return (
        <div className="bd-container bd-page">
            <div className="bd-card bd-card-pad" style={{ background: "linear-gradient(135deg, var(--bd-brand) 0%, #f97316 100%)", textAlign: "center", padding: "80px 20px" }}>
                <BriefcaseIcon size={64} style={{ margin: "0 auto 20px", color: "white" }} />
                <h1 className="bd-h1" style={{ fontSize: 42, marginBottom: 12, color: "white" }}>Careers at Banadama</h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 20, maxWidth: 700, margin: "0 auto" }}>
                    Join us in building the future of B2B trade in emerging markets
                </p>
            </div>

            <div style={{ maxWidth: 1000, margin: "60px auto", display: "grid", gap: 60 }}>
                {/* Why Join Us */}
                <section>
                    <h2 className="bd-h2" style={{ textAlign: "center", marginBottom: 40 }}>Why Join Banadama?</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
                        <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                            <RocketIcon size={48} style={{ margin: "0 auto 12px", color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>High Impact</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Shape a platform used by thousands of businesses daily
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                            <GlobeIcon size={48} style={{ margin: "0 auto 12px", color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Global Reach</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Work on products that connect Nigeria, Bangladesh, and the world
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                            <TrendingUpIcon size={48} style={{ margin: "0 auto 12px", color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Fast Growth</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Grow your career in a rapidly expanding startup
                            </p>
                        </div>

                        <div className="bd-card bd-card-pad" style={{ textAlign: "center" }}>
                            <LightbulbIcon size={48} style={{ margin: "0 auto 12px", color: "var(--bd-brand)" }} />
                            <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Innovation</h3>
                            <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>
                                Solve challenging problems with cutting-edge technology
                            </p>
                        </div>
                    </div>
                </section>

                {/* Perks & Benefits */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 20 }}>Perks & Benefits</h2>
                    <div className="bd-card bd-card-pad">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                    <DollarIcon size={20} style={{ color: "var(--bd-brand)" }} />
                                    Competitive Salary
                                </h4>
                                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>Market-rate compensation with equity options</p>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                    <HeartIcon size={20} style={{ color: "var(--bd-brand)" }} />
                                    Health Insurance
                                </h4>
                                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>Comprehensive medical coverage for you and family</p>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                    <HomeIcon size={20} style={{ color: "var(--bd-brand)" }} />
                                    Remote Work
                                </h4>
                                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>Flexible work arrangements and home office stipend</p>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                    <BookIcon size={20} style={{ color: "var(--bd-brand)" }} />
                                    Learning Budget
                                </h4>
                                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>Annual budget for courses, books, and conferences</p>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                    <CalendarIcon size={20} style={{ color: "var(--bd-brand)" }} />
                                    Paid Time Off
                                </h4>
                                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>Generous vacation days plus public holidays</p>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                    <HeartIcon size={20} style={{ color: "var(--bd-brand)" }} />
                                    Parental Leave
                                </h4>
                                <p style={{ color: "var(--bd-muted)", fontSize: 14 }}>Paid leave for new parents</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section>
                    <h2 className="bd-h2" style={{ marginBottom: 30 }}>Open Positions</h2>

                    {/* Filter */}
                    <div style={{ marginBottom: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <button
                            className={selectedDepartment === "all" ? "bd-btn bd-btn-primary" : "bd-btn"}
                            onClick={() => setSelectedDepartment("all")}
                        >
                            All Departments
                        </button>
                        <button
                            className={selectedDepartment === "Engineering" ? "bd-btn bd-btn-primary" : "bd-btn"}
                            onClick={() => setSelectedDepartment("Engineering")}
                        >
                            Engineering
                        </button>
                        <button
                            className={selectedDepartment === "Operations" ? "bd-btn bd-btn-primary" : "bd-btn"}
                            onClick={() => setSelectedDepartment("Operations")}
                        >
                            Operations
                        </button>
                        <button
                            className={selectedDepartment === "Sales" ? "bd-btn bd-btn-primary" : "bd-btn"}
                            onClick={() => setSelectedDepartment("Sales")}
                        >
                            Sales
                        </button>
                        <button
                            className={selectedDepartment === "Marketing" ? "bd-btn bd-btn-primary" : "bd-btn"}
                            onClick={() => setSelectedDepartment("Marketing")}
                        >
                            Marketing
                        </button>
                    </div>

                    {/* Jobs List */}
                    <div style={{ display: "grid", gap: 16 }}>
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="bd-card bd-card-pad" style={{ cursor: "pointer" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 20, flexWrap: "wrap" }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>{job.title}</h3>
                                        <p style={{ color: "var(--bd-muted)", marginBottom: 12 }}>{job.description}</p>
                                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 14, color: "var(--bd-muted)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <UsersIcon size={14} />
                                                <span>{job.department}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <MapPinIcon size={14} />
                                                <span>{job.location}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <ClockIcon size={14} />
                                                <span>{job.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bd-btn bd-btn-primary">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="bd-card bd-card-pad" style={{ textAlign: "center", padding: "40px 20px" }}>
                            <p style={{ color: "var(--bd-muted)" }}>No openings in this department at the moment.</p>
                        </div>
                    )}
                </section>

                {/* Don't See a Fit */}
                <div className="bd-card bd-card-pad" style={{ background: "var(--bd-muted-bg)", textAlign: "center", padding: "40px 20px" }}>
                    <h3 style={{ fontWeight: 900, marginBottom: 12 }}>Don't See a Perfect Fit?</h3>
                    <p style={{ color: "var(--bd-muted)", marginBottom: 24 }}>
                        We're always looking for talented people. Send us your resume and tell us why you want to join Banadama.
                    </p>
                    <a href="mailto:careers@banadama.com" className="bd-btn bd-btn-primary">
                        careers@banadama.com
                    </a>
                </div>
            </div>
        </div>
    );
}
