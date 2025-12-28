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

    return (
        <div style={{ backgroundColor: '#5bc5cf', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2b3d2d', padding: '1rem 0', borderBottom: '2px solid white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Careers at Banadama</h1>
                </div>
            </header>
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                    <h2 style={{ color: '#2b3d2d', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Join Our Growing Team</h2>
                    <p style={{ color: '#333', lineHeight: '1.8', marginBottom: '2rem' }}>
                        We're building the future of B2B trade in emerging markets. Join us in making cross-border trade safer, more transparent, and accessible to everyone.
                    </p>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '1rem' }}>Open Positions</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {jobOpenings.map(job => (
                                <div key={job.id} style={{ padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.375rem' }}>
                                    <h4 style={{ color: '#2b3d2d', fontWeight: 700, marginBottom: '0.5rem' }}>{job.title}</h4>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                                        <span>{job.location}</span>
                                        <span>{job.type}</span>
                                    </div>
                                    <button style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>View Details</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="mailto:careers@banadama.com" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Apply Now</a>
                    </div>
                </div>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="/marketplace" style={{ backgroundColor: '#5bc5cf', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', textDecoration: 'none', fontWeight: 500 }}>Back to Marketplace</a>
                </div>
            </main>
        </div>
    );
}
