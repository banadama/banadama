// app/(admin)/admin/studio/admins/page.tsx - Admin Role & Permission Manager Page
'use client';

import { useState, useEffect } from 'react';

interface AdminUser {
    id: string;
    email: string;
    phone?: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    adminRole?: {
        id: string;
        roleType: string;
        permissions?: Record<string, boolean>;
        restrictedTo?: Record<string, unknown>;
        notes?: string;
        assignedAt: string;
    };
}

const ROLE_TYPES = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Full access to everything', color: 'gold' },
    { value: 'OPS_ADMIN', label: 'Ops Admin', description: 'Operations, disputes, verifications', color: 'blue' },
    { value: 'CONTENT_ADMIN', label: 'Content Admin', description: 'Products, categories, CMS', color: 'green' },
    { value: 'FINANCE_ADMIN', label: 'Finance Admin', description: 'Payouts, fees, commissions', color: 'blue' },
    { value: 'SUPPORT_ADMIN', label: 'Support Admin', description: 'User support, basic access', color: 'gray' },
];

const DEFAULT_PERMISSIONS = [
    'canManageUsers',
    'canManageAccounts',
    'canManageProducts',
    'canManageDisputes',
    'canManagePricing',
    'canManageSettings',
    'canManageAdmins',
    'canViewAuditLog',
];

export default function AdminsPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAssign, setShowAssign] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/admins', { credentials: 'include' });
            const data = await res.json();
            setAdmins(data.admins || []);
        } catch (err) {
            console.error('Error fetching admins:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const getRoleBadge = (roleType: string) => {
        const role = ROLE_TYPES.find((r) => r.value === roleType);
        return (
            <span className={`studio-badge studio-badge-${role?.color || 'gray'}`}>
                {role?.label || roleType}
            </span>
        );
    };

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Admin Role Manager</h1>
                <button className="studio-btn studio-btn-primary" onClick={() => setShowAssign(true)}>
                    + Assign Admin Role
                </button>
            </div>

            {/* Role Legend */}
            <div className="studio-card" style={{ marginBottom: '1rem' }}>
                <h3>Role Hierarchy</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {ROLE_TYPES.map((role) => (
                        <div key={role.value} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                            <div className={`studio-badge studio-badge-${role.color}`} style={{ marginBottom: '0.5rem' }}>
                                {role.label}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{role.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Admins Table */}
            <div className="studio-card">
                <h3>Admin Users</h3>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        Loading admins...
                    </div>
                ) : admins.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No admin users found
                    </div>
                ) : (
                    <table className="studio-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Admin Role</th>
                                <th>Restrictions</th>
                                <th>Assigned</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{admin.email}</div>
                                        {admin.phone && (
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{admin.phone}</div>
                                        )}
                                    </td>
                                    <td>
                                        {admin.adminRole
                                            ? getRoleBadge(admin.adminRole.roleType)
                                            : <span className="studio-badge studio-badge-gray">No Role Assigned</span>}
                                    </td>
                                    <td>
                                        {admin.adminRole?.restrictedTo ? (
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                                {JSON.stringify(admin.adminRole.restrictedTo)}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#64748b' }}>None</span>
                                        )}
                                    </td>
                                    <td>
                                        {admin.adminRole?.assignedAt
                                            ? new Date(admin.adminRole.assignedAt).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="studio-btn studio-btn-secondary"
                                                onClick={() => setEditingAdmin(admin)}
                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Assign/Edit Modal */}
            {(showAssign || editingAdmin) && (
                <AdminRoleModal
                    admin={editingAdmin}
                    onClose={() => {
                        setShowAssign(false);
                        setEditingAdmin(null);
                    }}
                    onSaved={() => {
                        setShowAssign(false);
                        setEditingAdmin(null);
                        fetchAdmins();
                    }}
                />
            )}
        </div>
    );
}

function AdminRoleModal({
    admin,
    onClose,
    onSaved,
}: {
    admin: AdminUser | null;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [userId, setUserId] = useState(admin?.id || '');
    const [roleType, setRoleType] = useState(admin?.adminRole?.roleType || 'SUPPORT_ADMIN');
    const [permissions, setPermissions] = useState<Record<string, boolean>>(
        admin?.adminRole?.permissions || {}
    );
    const [restrictedCountries, setRestrictedCountries] = useState('');
    const [notes, setNotes] = useState(admin?.adminRole?.notes || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePermissionToggle = (perm: string) => {
        setPermissions({ ...permissions, [perm]: !permissions[perm] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                userId: admin?.id || userId,
                roleType,
                permissions,
                restrictedTo: restrictedCountries
                    ? { countries: restrictedCountries.split(',').map((c) => c.trim()) }
                    : null,
                notes,
            };

            const res = await fetch('/api/admin/admins', {
                method: admin ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save admin role');
            }

            onSaved();
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
                style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>{admin ? 'Edit Admin Role' : 'Assign Admin Role'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!admin && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                                User ID *
                            </label>
                            <input
                                type="text"
                                className="studio-input"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter user ID"
                                required
                            />
                        </div>
                    )}
                    {admin && (
                        <div>
                            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>User</label>
                            <div style={{ color: 'white' }}>{admin.email}</div>
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Admin Role *
                        </label>
                        <select
                            className="studio-select"
                            value={roleType}
                            onChange={(e) => setRoleType(e.target.value)}
                        >
                            {ROLE_TYPES.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label} - {role.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Granular Permissions
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                            {DEFAULT_PERMISSIONS.map((perm) => (
                                <label
                                    key={perm}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        color: permissions[perm] ? '#4ade80' : '#94a3b8',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={permissions[perm] || false}
                                        onChange={() => handlePermissionToggle(perm)}
                                    />
                                    {perm.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Restrict to Countries (comma-separated)
                        </label>
                        <input
                            type="text"
                            className="studio-input"
                            value={restrictedCountries}
                            onChange={(e) => setRestrictedCountries(e.target.value)}
                            placeholder="e.g., NG, BD"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
                            Notes
                        </label>
                        <input
                            type="text"
                            className="studio-input"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional notes"
                        />
                    </div>
                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="studio-btn studio-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="studio-btn studio-btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : admin ? 'Update Role' : 'Assign Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
