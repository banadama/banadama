// app/(admin)/admin/users/[id]/page.tsx - Single User Management Page
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
    isActive: boolean;
}

interface User {
    id: string;
    email: string;
    phone?: string;
    status: string;
    role: string;
    country?: string;
    isActive: boolean;
    activeAccountId?: string;
    createdAt: string;
    updatedAt: string;
    accounts: Array<{
        id: string;
        role: string;
        account: Account;
    }>;
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

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, { credentials: 'include' });
            if (!res.ok) throw new Error('User not found');
            const data = await res.json();
            setUser(data.user);
        } catch (err) {
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const updateUser = async (updates: Partial<User>) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (err) {
            console.error('Error updating user:', err);
        } finally {
            setSaving(false);
        }
    };

    const resetPassword = async () => {
        if (!confirm('Are you sure you want to reset this user\'s password?')) return;

        try {
            // In a real implementation, this would send a password reset email
            alert('Password reset email sent (mock)');
        } catch (err) {
            console.error('Error resetting password:', err);
        }
    };

    const suspendUser = async () => {
        if (!confirm('Are you sure you want to suspend this user?')) return;
        await updateUser({ status: 'SUSPENDED', isActive: false });
    };

    const activateUser = async () => {
        await updateUser({ status: 'ACTIVE', isActive: true });
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
                Loading user...
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2 style={{ color: '#ef4444' }}>User not found</h2>
                <Link href="/admin/users">
                    <button className="studio-btn studio-btn-secondary">Back to Users</button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="studio-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/users">
                        <button className="studio-btn studio-btn-secondary">← Back</button>
                    </Link>
                    <h1 className="studio-title">User Details</h1>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="studio-btn studio-btn-secondary" onClick={resetPassword}>
                        Reset Password
                    </button>
                    {user.status === 'ACTIVE' ? (
                        <button className="studio-btn studio-btn-danger" onClick={suspendUser} disabled={saving}>
                            Suspend User
                        </button>
                    ) : (
                        <button className="studio-btn studio-btn-primary" onClick={activateUser} disabled={saving}>
                            Activate User
                        </button>
                    )}
                </div>
            </div>

            {/* User Info */}
            <div className="studio-card">
                <h3>User Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Email
                        </label>
                        <div style={{ color: 'white', fontWeight: 500 }}>{user.email}</div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Phone
                        </label>
                        <div style={{ color: 'white' }}>{user.phone || '-'}</div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Status
                        </label>
                        <div>
                            {user.status === 'ACTIVE' ? (
                                <span className="studio-badge studio-badge-green">Active</span>
                            ) : user.status === 'SUSPENDED' ? (
                                <span className="studio-badge studio-badge-red">Suspended</span>
                            ) : (
                                <span className="studio-badge studio-badge-gray">{user.status}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Role
                        </label>
                        <select
                            className="studio-select"
                            value={user.role}
                            onChange={(e) => updateUser({ role: e.target.value })}
                            style={{ maxWidth: '200px' }}
                        >
                            <option value="BUYER">Buyer</option>
                            <option value="SUPPLIER">Supplier</option>
                            <option value="CREATOR">Creator</option>
                            <option value="AFFILIATE">Affiliate</option>
                            <option value="OPS">Ops</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Country
                        </label>
                        <select
                            className="studio-select"
                            value={user.country || ''}
                            onChange={(e) => updateUser({ country: e.target.value })}
                            style={{ maxWidth: '200px' }}
                        >
                            <option value="">Not set</option>
                            <option value="NG">Nigeria (NG)</option>
                            <option value="BD">Bangladesh (BD)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            Created
                        </label>
                        <div style={{ color: 'white' }}>{new Date(user.createdAt).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Accounts */}
            <div className="studio-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Accounts ({user.accounts.length})</h3>
                    <button
                        className="studio-btn studio-btn-primary"
                        onClick={() => setShowAddAccountModal(true)}
                    >
                        + Add Account
                    </button>
                </div>

                {user.accounts.length === 0 ? (
                    <div style={{ color: '#64748b', padding: '2rem', textAlign: 'center' }}>
                        No accounts linked to this user
                    </div>
                ) : (
                    <table className="studio-table">
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Type</th>
                                <th>Role</th>
                                <th>Verification</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.accounts.map((membership) => (
                                <tr key={membership.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{membership.account.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{membership.account.country}</div>
                                    </td>
                                    <td>
                                        <span className="studio-badge studio-badge-gray">
                                            {ACCOUNT_TYPES.find((t) => t.value === membership.account.type)?.label || membership.account.type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="studio-badge studio-badge-gray">{membership.role}</span>
                                    </td>
                                    <td>{getVerificationBadge(membership.account.verificationLevel)}</td>
                                    <td>
                                        {membership.account.isActive ? (
                                            <span className="studio-badge studio-badge-green">Active</span>
                                        ) : (
                                            <span className="studio-badge studio-badge-red">Inactive</span>
                                        )}
                                    </td>
                                    <td>
                                        <Link href={`/admin/accounts/${membership.account.id}`}>
                                            <button className="studio-btn studio-btn-secondary">View</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Account Modal */}
            {showAddAccountModal && (
                <AddAccountModal
                    userId={user.id}
                    onClose={() => setShowAddAccountModal(false)}
                    onAdded={() => {
                        setShowAddAccountModal(false);
                        fetchUser();
                    }}
                />
            )}
        </div>
    );
}

function AddAccountModal({
    userId,
    onClose,
    onAdded,
}: {
    userId: string;
    onClose: () => void;
    onAdded: () => void;
}) {
    const [type, setType] = useState('BUYER');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('NG');
    const [role, setRole] = useState('OWNER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/users/${userId}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type, name, country, role }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add account');
            }

            onAdded();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                className="studio-card"
                style={{ maxWidth: '500px', width: '90%' }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Add Account</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Account Type *
                        </label>
                        <select className="studio-select" value={type} onChange={(e) => setType(e.target.value)}>
                            {ACCOUNT_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Account Name *
                        </label>
                        <input
                            type="text"
                            className="studio-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Company or profile name"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Country
                        </label>
                        <select className="studio-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                            <option value="NG">Nigeria (NG)</option>
                            <option value="BD">Bangladesh (BD)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Membership Role
                        </label>
                        <select className="studio-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="OWNER">Owner</option>
                            <option value="STAFF">Staff</option>
                        </select>
                    </div>
                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="studio-btn studio-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="studio-btn studio-btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
