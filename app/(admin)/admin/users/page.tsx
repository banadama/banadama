// app/(admin)/admin/users/page.tsx - Users Management Page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    phone?: string;
    status: string;
    role: string;
    country?: string;
    isActive: boolean;
    createdAt: string;
    accounts: Array<{
        id: string;
        role: string;
        account: {
            id: string;
            name: string;
            type: string;
            verificationLevel: string;
        };
    }>;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);

        try {
            const res = await fetch(`/api/admin/users?${params}`, { credentials: 'include' });
            const data = await res.json();
            setUsers(data.users || []);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="studio-badge studio-badge-green">Active</span>;
            case 'SUSPENDED':
                return <span className="studio-badge studio-badge-red">Suspended</span>;
            case 'PENDING':
                return <span className="studio-badge studio-badge-gray">Pending</span>;
            default:
                return <span className="studio-badge studio-badge-gray">{status}</span>;
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
                return null;
        }
    };

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Users Management</h1>
                <button
                    className="studio-btn studio-btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Create User
                </button>
            </div>

            {/* Filters */}
            <div className="studio-card">
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="studio-input"
                        placeholder="Search by email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: '300px' }}
                    />
                    <select
                        className="studio-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="PENDING">Pending</option>
                    </select>
                    <button type="submit" className="studio-btn studio-btn-primary">
                        Search
                    </button>
                </form>
            </div>

            {/* Users Table */}
            <div className="studio-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        Loading users...
                    </div>
                ) : (
                    <>
                        <table className="studio-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Role</th>
                                    <th>Accounts</th>
                                    <th>Country</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{user.email}</div>
                                                {user.phone && (
                                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user.phone}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(user.status)}</td>
                                        <td>
                                            <span className="studio-badge studio-badge-gray">{user.role}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {user.accounts.length === 0 ? (
                                                    <span style={{ color: '#64748b' }}>No accounts</span>
                                                ) : (
                                                    user.accounts.slice(0, 2).map((m) => (
                                                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.85rem' }}>{m.account.name}</span>
                                                            {getVerificationBadge(m.account.verificationLevel)}
                                                        </div>
                                                    ))
                                                )}
                                                {user.accounts.length > 2 && (
                                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                        +{user.accounts.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{user.country || '-'}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <button className="studio-btn studio-btn-secondary">View</button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                <button
                                    className="studio-btn studio-btn-secondary"
                                    onClick={() => fetchUsers(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                >
                                    Previous
                                </button>
                                <span style={{ color: '#94a3b8', alignSelf: 'center' }}>
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    className="studio-btn studio-btn-secondary"
                                    onClick={() => fetchUsers(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        fetchUsers();
                    }}
                />
            )}
        </div>
    );
}

function CreateUserModal({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('BUYER');
    const [country, setCountry] = useState('NG');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, phone: phone || null, role, country }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create user');
            }

            onCreated();
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
                <h3>Create New User</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            className="studio-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Phone
                        </label>
                        <input
                            type="tel"
                            className="studio-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Role
                        </label>
                        <select className="studio-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="BUYER">Buyer</option>
                            <option value="SUPPLIER">Supplier</option>
                            <option value="CREATOR">Creator</option>
                            <option value="AFFILIATE">Affiliate</option>
                            <option value="OPS">Ops</option>
                            <option value="ADMIN">Admin</option>
                        </select>
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
                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="studio-btn studio-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="studio-btn studio-btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
