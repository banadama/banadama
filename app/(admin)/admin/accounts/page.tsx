// app/(admin)/admin/accounts/page.tsx - Accounts Management Page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Account {
    id: string;
    type: string;
    name: string;
    country: string;
    verificationLevel: string;
    verifiedAt?: string;
    isActive: boolean;
    createdAt: string;
    memberships: Array<{
        id: string;
        role: string;
        user: {
            id: string;
            email: string;
        };
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

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [verificationFilter, setVerificationFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAccounts = async (pageNum = 1) => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(pageNum), limit: '20' });
        if (search) params.set('search', search);
        if (typeFilter) params.set('type', typeFilter);
        if (verificationFilter) params.set('verificationLevel', verificationFilter);

        try {
            const res = await fetch(`/api/admin/accounts?${params}`, { credentials: 'include' });
            const data = await res.json();
            setAccounts(data.accounts || []);
            setPage(data.pagination?.page || 1);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (err) {
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [search, typeFilter, verificationFilter]);

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

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Accounts Management</h1>
            </div>

            {/* Filters */}
            <div className="studio-card">
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="studio-input"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: '300px' }}
                    />
                    <select
                        className="studio-select"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="">All Types</option>
                        {ACCOUNT_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    <select
                        className="studio-select"
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="">All Verifications</option>
                        <option value="NONE">Not Verified</option>
                        <option value="BLUE">Blue</option>
                        <option value="GREEN">Green</option>
                        <option value="GOLD">Gold</option>
                    </select>
                </div>
            </div>

            {/* Accounts Table */}
            <div className="studio-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        Loading accounts...
                    </div>
                ) : (
                    <>
                        <table className="studio-table">
                            <thead>
                                <tr>
                                    <th>Account</th>
                                    <th>Type</th>
                                    <th>Country</th>
                                    <th>Verification</th>
                                    <th>Members</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.id}>
                                        <td style={{ fontWeight: 500 }}>{account.name}</td>
                                        <td>
                                            <span className="studio-badge studio-badge-gray">
                                                {ACCOUNT_TYPES.find((t) => t.value === account.type)?.label || account.type}
                                            </span>
                                        </td>
                                        <td>{account.country}</td>
                                        <td>{getVerificationBadge(account.verificationLevel)}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {account.memberships.slice(0, 2).map((m) => (
                                                    <span key={m.id} style={{ fontSize: '0.85rem' }}>
                                                        {m.user.email} ({m.role})
                                                    </span>
                                                ))}
                                                {account.memberships.length > 2 && (
                                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                        +{account.memberships.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {account.isActive ? (
                                                <span className="studio-badge studio-badge-green">Active</span>
                                            ) : (
                                                <span className="studio-badge studio-badge-red">Inactive</span>
                                            )}
                                        </td>
                                        <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Link href={`/admin/accounts/${account.id}`}>
                                                <button className="studio-btn studio-btn-secondary">Manage</button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                <button
                                    className="studio-btn studio-btn-secondary"
                                    onClick={() => fetchAccounts(page - 1)}
                                    disabled={page <= 1}
                                >
                                    Previous
                                </button>
                                <span style={{ color: '#94a3b8', alignSelf: 'center' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="studio-btn studio-btn-secondary"
                                    onClick={() => fetchAccounts(page + 1)}
                                    disabled={page >= totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
