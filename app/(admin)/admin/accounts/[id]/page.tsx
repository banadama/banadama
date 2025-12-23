// app/(admin)/admin/accounts/[id]/page.tsx - Single Account Management
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Account {
    id: string;
    type: string;
    name: string;
    country: string;
    verificationLevel: string;
    verifiedAt?: string;
    verificationNotes?: string;
    isActive: boolean;
    profileData?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    memberships: Array<{
        id: string;
        role: string;
        user: {
            id: string;
            email: string;
            phone?: string;
            status: string;
        };
    }>;
    verifiedByAdmin?: {
        id: string;
        email: string;
    };
}

const ACCOUNT_TYPES = [
    { value: 'BUYER', label: 'Buyer' },
    { value: 'COMPANY_FACTORY', label: 'Factory' },
    { value: 'COMPANY_WHOLESALER', label: 'Wholesaler' },
    { value: 'COMPANY_RETAIL', label: 'Retail' },
    { value: 'CREATOR_MODEL', label: 'Model' },
    { value: 'CREATOR_GRAPHIC', label: 'Graphic Designer' },
    { value: 'CREATOR_MOCK', label: 'Mock Designer' },
];

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchAccount = async () => {
        try {
            const res = await fetch(`/api/admin/accounts/${id}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Account not found');
            const data = await res.json();
            setAccount(data.account);
        } catch (err) {
            console.error('Error fetching account:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, [id]);

    const updateAccount = async (updates: Partial<Account>) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/accounts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const data = await res.json();
                setAccount(data.account);
            }
        } catch (err) {
            console.error('Error updating account:', err);
        } finally {
            setSaving(false);
        }
    };

    const updateVerification = async (level: string, notes?: string) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/accounts/${id}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ verificationLevel: level, verificationNotes: notes }),
            });
            if (res.ok) {
                const data = await res.json();
                setAccount(data.account);
            }
        } catch (err) {
            console.error('Error updating verification:', err);
        } finally {
            setSaving(false);
        }
    };

    const getVerificationBadge = (level: string) => {
        switch (level) {
            case 'BLUE':
                return <span className="studio-badge studio-badge-blue">Verified</span>;
            case 'GREEN':
                return <span className="studio-badge studio-badge-green">Business</span>;
            case 'GOLD':
                return <span className="studio-badge studio-badge-gold">Premium</span>;
            default:
                return <span className="studio-badge studio-badge-gray">Not Verified</span>;
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                Loading account...
            </div>
        );
    }

    if (!account) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2 style={{ color: '#ef4444' }}>Account not found</h2>
                <Link href="/admin/accounts">
                    <button className="studio-btn studio-btn-secondary">Back to Accounts</button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="studio-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/accounts">
                        <button className="studio-btn studio-btn-secondary">← Back</button>
                    </Link>
                    <h1 className="studio-title">{account.name}</h1>
                    {getVerificationBadge(account.verificationLevel)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {account.isActive ? (
                        <button
                            className="studio-btn studio-btn-danger"
                            onClick={() => updateAccount({ isActive: false })}
                            disabled={saving}
                        >
                            Suspend Account
                        </button>
                    ) : (
                        <button
                            className="studio-btn studio-btn-primary"
                            onClick={() => updateAccount({ isActive: true })}
                            disabled={saving}
                        >
                            Activate Account
                        </button>
                    )}
                </div>
            </div>

            {/* Account Details */}
            <div className="studio-card">
                <h3>Account Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Account Name
                        </label>
                        <input
                            type="text"
                            className="studio-input"
                            value={account.name}
                            onChange={(e) => setAccount({ ...account, name: e.target.value })}
                            onBlur={() => updateAccount({ name: account.name })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Account Type
                        </label>
                        <select
                            className="studio-select"
                            value={account.type}
                            onChange={(e) => updateAccount({ type: e.target.value })}
                        >
                            {ACCOUNT_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Country
                        </label>
                        <select
                            className="studio-select"
                            value={account.country}
                            onChange={(e) => updateAccount({ country: e.target.value })}
                        >
                            <option value="NG">Nigeria (NG)</option>
                            <option value="BD">Bangladesh (BD)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Status
                        </label>
                        <div>
                            {account.isActive ? (
                                <span className="studio-badge studio-badge-green">Active</span>
                            ) : (
                                <span className="studio-badge studio-badge-red">Suspended</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Created
                        </label>
                        <div style={{ color: 'white' }}>{new Date(account.createdAt).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Verification Control */}
            <div className="studio-card">
                <h3>Verification Control</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <button
                        className={`studio-btn ${account.verificationLevel === 'NONE' ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                        onClick={() => updateVerification('NONE')}
                        disabled={saving}
                    >
                        Remove Verification
                    </button>
                    <button
                        className={`studio-btn ${account.verificationLevel === 'BLUE' ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                        onClick={() => updateVerification('BLUE')}
                        disabled={saving}
                        style={{ background: account.verificationLevel === 'BLUE' ? '#3b82f6' : undefined }}
                    >
                        Assign Blue Tick
                    </button>
                    <button
                        className={`studio-btn ${account.verificationLevel === 'GREEN' ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                        onClick={() => updateVerification('GREEN')}
                        disabled={saving}
                        style={{ background: account.verificationLevel === 'GREEN' ? '#22c55e' : undefined }}
                    >
                        Assign Green Tick
                    </button>
                    <button
                        className={`studio-btn ${account.verificationLevel === 'GOLD' ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                        onClick={() => updateVerification('GOLD')}
                        disabled={saving}
                        style={{ background: account.verificationLevel === 'GOLD' ? '#eab308' : undefined }}
                    >
                        Assign Gold Tick
                    </button>
                </div>

                {account.verifiedAt && (
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Verified on {new Date(account.verifiedAt).toLocaleString()}
                        {account.verifiedByAdmin && ` by ${account.verifiedByAdmin.email}`}
                    </div>
                )}

                {account.verificationNotes && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', color: '#94a3b8' }}>
                        Notes: {account.verificationNotes}
                    </div>
                )}
            </div>

            {/* Members */}
            <div className="studio-card">
                <h3>Members ({account.memberships.length})</h3>
                {account.memberships.length === 0 ? (
                    <div style={{ color: '#64748b', padding: '2rem', textAlign: 'center' }}>
                        No members in this account
                    </div>
                ) : (
                    <table className="studio-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {account.memberships.map((membership) => (
                                <tr key={membership.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{membership.user.email}</div>
                                        {membership.user.phone && (
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{membership.user.phone}</div>
                                        )}
                                    </td>
                                    <td>
                                        <span className="studio-badge studio-badge-gray">{membership.role}</span>
                                    </td>
                                    <td>
                                        {membership.user.status === 'ACTIVE' ? (
                                            <span className="studio-badge studio-badge-green">Active</span>
                                        ) : (
                                            <span className="studio-badge studio-badge-red">{membership.user.status}</span>
                                        )}
                                    </td>
                                    <td>
                                        <Link href={`/admin/users/${membership.user.id}`}>
                                            <button className="studio-btn studio-btn-secondary">View User</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
