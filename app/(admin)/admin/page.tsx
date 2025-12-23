import { db } from '@/lib/db';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { Icons } from '@/components/icons/icons';

export default async function AdminStudioDashboard() {
    await requireRole('ADMIN');
    // Fetch dashboard metrics
    const [
        totalUsers,
        activeUsers,
        totalAccounts,
        verifiedAccounts,
        pendingVerifications,
        activeFlags,
    ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { status: 'ACTIVE' } }),
        db.account.count(),
        db.account.count({ where: { verificationLevel: { not: 'NONE' } } }),
        db.verificationRequest.count({ where: { status: 'PENDING' } }),
        db.featureFlag.count({ where: { enabled: true } }),
    ]);

    const stats = [
        { label: 'Total Users', value: totalUsers, icon: <Icons.Users size={32} />, href: '/admin/users' },
        { label: 'Active Users', value: activeUsers, icon: <Icons.Check size={32} />, href: '/admin/users?status=ACTIVE' },
        { label: 'Total Accounts', value: totalAccounts, icon: <Icons.Building size={32} />, href: '/admin/accounts' },
        { label: 'Verified Accounts', value: verifiedAccounts, icon: <Icons.TickBlue size={32} />, href: '/admin/verifications' },
        { label: 'Pending Verifications', value: pendingVerifications, icon: <Icons.Clock size={32} />, href: '/admin/verifications' },
        { label: 'Active Features', value: activeFlags, icon: <Icons.Flag size={32} />, href: '/admin/features' },
    ];

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Admin Studio Dashboard</h1>
            </div>

            <div className="studio-grid">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
                        <div className="studio-card" style={{ cursor: 'pointer' }}>
                            <div className="studio-stat">
                                {stat.icon}
                                <span className="studio-stat-value">{stat.value.toLocaleString()}</span>
                                <span className="studio-stat-label">{stat.label}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="studio-card">
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href="/admin/users">
                        <button className="studio-btn studio-btn-primary">Manage Users</button>
                    </Link>
                    <Link href="/admin/accounts">
                        <button className="studio-btn studio-btn-primary">Manage Accounts</button>
                    </Link>
                    <Link href="/admin/verifications">
                        <button className="studio-btn studio-btn-primary">Review Verifications</button>
                    </Link>
                    <Link href="/admin/features">
                        <button className="studio-btn studio-btn-secondary">Feature Flags</button>
                    </Link>
                    <Link href="/admin/settings">
                        <button className="studio-btn studio-btn-secondary">Settings</button>
                    </Link>
                    <Link href="/admin/audit-log">
                        <button className="studio-btn studio-btn-secondary">Audit Log</button>
                    </Link>
                </div>
            </div>

            <div className="studio-card">
                <h3>System Status</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem' }}>
                        <div style={{ color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icons.Check size={18} /> All Systems Operational
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                        <div style={{ color: '#60a5fa' }}>Database: Connected</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                        <div style={{ color: '#60a5fa' }}>Auth: Active</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
