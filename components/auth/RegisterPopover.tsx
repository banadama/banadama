'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiPost } from '@/lib/api';

export function RegisterPopover() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await apiPost<any>('/api/auth/register', {
                email,
                password,
                role: 'BUYER',
                country: 'US',
                profileData: {
                    displayName: name,
                    companyName: name,
                },
            });

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/buyer/dashboard');
                }, 1500);
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
        }}>
            {/* Popover Container */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                maxWidth: '500px',
                width: '100%'
            }}>
                {/* Header - Styled like Join Banadama */}
                <div style={{
                    background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem'
                    }}>
                        Ship to Nigeria
                    </h2>
                    <p style={{
                        fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.9)'
                    }}>
                        Returns & Orders
                    </p>
                </div>

                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #5bc5cf 0%, #4ab8c2 100%)',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem'
                    }}>
                        Join Banadama
                    </h1>
                    <p style={{
                        fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '1.5rem'
                    }}>
                        Start trading with verified suppliers
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link href="/auth/login" style={{
                            padding: '0.625rem 1.25rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                        }}>
                            Sign In
                        </Link>
                        <button style={{
                            padding: '0.625rem 1.25rem',
                            background: 'white',
                            color: '#5bc5cf',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'inline-block'
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                            Create Free Account
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div style={{ padding: '2rem' }}>
                    {success ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 0'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#dcfce7',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                fontSize: '2rem'
                            }}>
                                ✓
                            </div>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#1f2937',
                                marginBottom: '0.5rem'
                            }}>
                                Account Created!
                            </h2>
                            <p style={{
                                color: '#6b7280',
                                fontSize: '0.95rem'
                            }}>
                                Welcome to Banadama. Redirecting...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Full Name */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#1f2937',
                                    marginBottom: '0.5rem'
                                }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#f97316';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#1f2937',
                                    marginBottom: '0.5rem'
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#f97316';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#1f2937',
                                    marginBottom: '0.5rem'
                                }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 8 characters"
                                    required
                                    minLength={8}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#f97316';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div style={{
                                    background: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    color: '#dc2626',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '0.875rem 1.5rem',
                                    background: loading ? '#d97706' : '#f97316',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: loading ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.background = '#ea580c';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.background = '#f97316';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            {/* Divider */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginTop: '1rem'
                            }}>
                                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                            </div>

                            {/* Sign In Link */}
                            <p style={{
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '0.95rem'
                            }}>
                                Already have an account?{' '}
                                <Link href="/auth/login" style={{
                                    color: '#f97316',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}>
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    background: '#2b3d2d',
                    padding: '1rem',
                    textAlign: 'center',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: '0.75rem',
                    color: '#ffffff'
                }}>
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </div>
            </div>
        </div>
    );
}
