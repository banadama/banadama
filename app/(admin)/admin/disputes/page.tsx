// app/(admin)/admin/studio/disputes/page.tsx - Dispute & Resolution Control Page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Dispute {
    id: string;
    orderId: string;
    buyerId: string;
    supplierId: string;
    type: string;
    status: string;
    description: string;
    resolutionType?: string;
    refundAmount?: number;
    supplierPenalty?: number;
    buyerCredit?: number;
    createdAt: string;
    resolvedAt?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    OPEN: { label: 'Open', color: 'red' },
    INVESTIGATING: { label: 'Investigating', color: 'blue' },
    RESOLVED_BUYER_FAVOR: { label: 'Resolved (Buyer)', color: 'green' },
    RESOLVED_SUPPLIER_FAVOR: { label: 'Resolved (Supplier)', color: 'green' },
    RESOLVED_PARTIAL: { label: 'Resolved (Partial)', color: 'green' },
    CLOSED: { label: 'Closed', color: 'gray' },
};

const TYPE_LABELS: Record<string, string> = {
    NON_DELIVERY: 'Non-Delivery',
    QUALITY_ISSUE: 'Quality Issue',
    WRONG_ITEM: 'Wrong Item',
    PRICING_DISPUTE: 'Pricing Dispute',
    SHIPPING_DAMAGE: 'Shipping Damage',
    OTHER: 'Other',
};

export default function DisputesPage() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDisputes = async (pageNum = 1) => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(pageNum), limit: '20' });
        if (statusFilter) params.set('status', statusFilter);
        if (typeFilter) params.set('type', typeFilter);

        try {
            const res = await fetch(`/api/admin/disputes?${params}`, { credentials: 'include' });
            const data = await res.json();
            setDisputes(data.disputes || []);
            setPage(data.pagination?.page || 1);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (err) {
            console.error('Error fetching disputes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, [statusFilter, typeFilter]);

    const getStatusBadge = (status: string) => {
        const config = STATUS_LABELS[status] || { label: status, color: 'gray' };
        return <span className={`studio-badge studio-badge-${config.color}`}>{config.label}</span>;
    };

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Dispute & Resolution Control</h1>
            </div>

            {/* Help Text */}
            <div className="studio-card" style={{ marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                <div style={{ color: '#f87171', fontSize: '0.9rem' }}>
                    <strong>⚠️ Power Control:</strong> This page allows you to override payouts, issue refunds,
                    and penalize suppliers. All actions are logged in the audit trail.
                </div>
            </div>

            {/* Filters */}
            <div className="studio-card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <select
                        className="studio-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="INVESTIGATING">Investigating</option>
                        <option value="RESOLVED_BUYER_FAVOR">Resolved (Buyer)</option>
                        <option value="RESOLVED_SUPPLIER_FAVOR">Resolved (Supplier)</option>
                        <option value="RESOLVED_PARTIAL">Resolved (Partial)</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <select
                        className="studio-select"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="">All Types</option>
                        {Object.entries(TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Disputes Table */}
            <div className="studio-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        Loading disputes...
                    </div>
                ) : disputes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No disputes found
                    </div>
                ) : (
                    <>
                        <table className="studio-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Description</th>
                                    <th>Resolution</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disputes.map((dispute) => (
                                    <tr key={dispute.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            {dispute.orderId.substring(0, 8)}...
                                        </td>
                                        <td>
                                            <span className="studio-badge studio-badge-gray">
                                                {TYPE_LABELS[dispute.type] || dispute.type}
                                            </span>
                                        </td>
                                        <td>{getStatusBadge(dispute.status)}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {dispute.description}
                                        </td>
                                        <td>
                                            {dispute.refundAmount && (
                                                <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>
                                                    Refund: ₦{(dispute.refundAmount / 100).toLocaleString()}
                                                </div>
                                            )}
                                            {dispute.supplierPenalty && (
                                                <div style={{ fontSize: '0.8rem', color: '#f87171' }}>
                                                    Penalty: ₦{(dispute.supplierPenalty / 100).toLocaleString()}
                                                </div>
                                            )}
                                            {!dispute.refundAmount && !dispute.supplierPenalty && '-'}
                                        </td>
                                        <td>{new Date(dispute.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Link href={`/admin/studio/disputes/${dispute.id}`}>
                                                <button className="studio-btn studio-btn-primary" style={{ fontSize: '0.75rem' }}>
                                                    {dispute.status === 'OPEN' ? 'Resolve' : 'View'}
                                                </button>
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
                                    onClick={() => fetchDisputes(page - 1)}
                                    disabled={page <= 1}
                                >
                                    Previous
                                </button>
                                <span style={{ color: '#94a3b8', alignSelf: 'center' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="studio-btn studio-btn-secondary"
                                    onClick={() => fetchDisputes(page + 1)}
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
