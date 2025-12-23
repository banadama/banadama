// components/shared/AccountSwitcher.tsx - Account Switching Dropdown
'use client';

import { useState, useEffect, useRef } from 'react';
import { getAccountTypeLabel, getVerificationBadge as getVerBadge } from '@/types/account';

interface Account {
    id: string;
    type: string;
    name: string;
    country: string;
    verificationLevel: string;
    isActive: boolean;
    membershipRole: string;
}

interface AccountSwitcherProps {
    className?: string;
}

export default function AccountSwitcher({ className }: AccountSwitcherProps) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [switching, setSwitching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchAccounts();

        // Close dropdown on outside click
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/auth/switch-account', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setAccounts(data.accounts || []);
                setActiveAccountId(data.activeAccountId);
            }
        } catch (err) {
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    const switchAccount = async (accountId: string) => {
        if (accountId === activeAccountId || switching) return;

        setSwitching(true);
        try {
            const res = await fetch('/api/auth/switch-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ accountId }),
            });

            if (res.ok) {
                const data = await res.json();
                setActiveAccountId(data.activeAccountId);
                setIsOpen(false);

                // Reload page to reflect account change
                window.location.reload();
            }
        } catch (err) {
            console.error('Error switching account:', err);
        } finally {
            setSwitching(false);
        }
    };

    const activeAccount = accounts.find((a) => a.id === activeAccountId);

    // Don't show if no accounts or only one account
    if (loading) {
        return null;
    }

    if (accounts.length <= 1) {
        return null;
    }

    const getVerificationIcon = (level: string) => {
        switch (level) {
            case 'BLUE':
                return '🔵';
            case 'GREEN':
                return '🟢';
            case 'GOLD':
                return '🟡';
            default:
                return '';
        }
    };

    return (
        <div ref={dropdownRef} className={className} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(148, 163, 184, 0.1)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                }}
            >
                {activeAccount ? (
                    <>
                        <span>{getVerificationIcon(activeAccount.verificationLevel)}</span>
                        <span style={{ fontWeight: 500 }}>{activeAccount.name}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                            ({getAccountTypeLabel(activeAccount.type as any)})
                        </span>
                    </>
                ) : (
                    <span>Select Account</span>
                )}
                <span style={{ marginLeft: '0.25rem' }}>▼</span>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        minWidth: '280px',
                        background: '#1e293b',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                            color: '#94a3b8',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Switch Account
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {accounts.map((account) => {
                            const isActive = account.id === activeAccountId;

                            return (
                                <button
                                    key={account.id}
                                    onClick={() => switchAccount(account.id)}
                                    disabled={isActive || switching}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
                                        color: 'white',
                                        cursor: isActive ? 'default' : 'pointer',
                                        textAlign: 'left',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: '1.25rem' }}>
                                        {getVerificationIcon(account.verificationLevel) || '⚪'}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>
                                            {account.name}
                                            {isActive && (
                                                <span
                                                    style={{
                                                        marginLeft: '0.5rem',
                                                        fontSize: '0.7rem',
                                                        color: '#60a5fa',
                                                        fontWeight: 400,
                                                    }}
                                                >
                                                    (Active)
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {getAccountTypeLabel(account.type as any)} • {account.country}
                                        </div>
                                    </div>
                                    {account.membershipRole === 'OWNER' && (
                                        <span
                                            style={{
                                                padding: '0.125rem 0.5rem',
                                                background: 'rgba(234, 179, 8, 0.2)',
                                                color: '#facc15',
                                                borderRadius: '9999px',
                                                fontSize: '0.7rem',
                                            }}
                                        >
                                            Owner
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
