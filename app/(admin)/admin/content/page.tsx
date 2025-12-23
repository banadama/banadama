// app/(admin)/admin/studio/content/page.tsx - CMS Content Management
'use client';

import { useState, useEffect } from 'react';

interface ContentBlock {
    key: string;
    title: string;
    content: string;
    type: 'text' | 'html' | 'json';
}

const CONTENT_SECTIONS = [
    { key: 'landing_hero_title', title: 'Landing Page - Hero Title', type: 'text' as const },
    { key: 'landing_hero_subtitle', title: 'Landing Page - Hero Subtitle', type: 'text' as const },
    { key: 'landing_cta_text', title: 'Landing Page - CTA Button Text', type: 'text' as const },
    { key: 'footer_tagline', title: 'Footer - Tagline', type: 'text' as const },
    { key: 'footer_copyright', title: 'Footer - Copyright Text', type: 'text' as const },
    { key: 'about_content', title: 'About Page - Content', type: 'html' as const },
    { key: 'terms_content', title: 'Terms of Service - Content', type: 'html' as const },
    { key: 'privacy_content', title: 'Privacy Policy - Content', type: 'html' as const },
    { key: 'contact_email', title: 'Contact - Email', type: 'text' as const },
    { key: 'contact_phone', title: 'Contact - Phone', type: 'text' as const },
    { key: 'social_links', title: 'Social Media Links', type: 'json' as const },
];

export default function ContentPage() {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/site-settings?category=content', { credentials: 'include' });
            const data = await res.json();

            const contentMap: Record<string, string> = {};
            data.settings?.forEach((s: { key: string; value: unknown }) => {
                contentMap[s.key] = typeof s.value === 'object' ? JSON.stringify(s.value, null, 2) : String(s.value);
            });
            setContent(contentMap);
        } catch (err) {
            console.error('Error fetching content:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const saveContent = async (key: string, value: string) => {
        setSaving(key);
        try {
            const section = CONTENT_SECTIONS.find((s) => s.key === key);
            let parsedValue: unknown = value;

            if (section?.type === 'json') {
                try {
                    parsedValue = JSON.parse(value);
                } catch {
                    alert('Invalid JSON format');
                    setSaving(null);
                    return;
                }
            }

            const res = await fetch('/api/admin/site-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    key,
                    value: parsedValue,
                    category: 'content',
                    description: section?.title,
                }),
            });

            if (res.ok) {
                setEditingKey(null);
                fetchContent();
            }
        } catch (err) {
            console.error('Error saving content:', err);
        } finally {
            setSaving(null);
        }
    };

    // Group sections
    const groups = {
        'Landing Page': CONTENT_SECTIONS.filter((s) => s.key.startsWith('landing_')),
        'Footer': CONTENT_SECTIONS.filter((s) => s.key.startsWith('footer_')),
        'Legal Pages': CONTENT_SECTIONS.filter((s) => ['about_content', 'terms_content', 'privacy_content'].includes(s.key)),
        'Contact': CONTENT_SECTIONS.filter((s) => s.key.startsWith('contact_') || s.key === 'social_links'),
    };

    return (
        <div>
            <div className="studio-header">
                <h1 className="studio-title">Content Management</h1>
                <span style={{ color: '#94a3b8' }}>Edit landing page, footer, and legal content</span>
            </div>

            {loading ? (
                <div className="studio-card" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Loading content...
                </div>
            ) : (
                Object.entries(groups).map(([groupName, sections]) => (
                    <div key={groupName} className="studio-card">
                        <h3>{groupName}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sections.map((section) => {
                                const currentValue = content[section.key] || '';
                                const isEditing = editingKey === section.key;
                                const isSaving = saving === section.key;

                                return (
                                    <div
                                        key={section.key}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: '0.5rem',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 500, color: 'white' }}>{section.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace' }}>
                                                    {section.key} ({section.type})
                                                </div>
                                            </div>
                                            {!isEditing && (
                                                <button
                                                    className="studio-btn studio-btn-secondary"
                                                    onClick={() => setEditingKey(section.key)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <div>
                                                {section.type === 'html' || section.type === 'json' ? (
                                                    <textarea
                                                        className="studio-input"
                                                        value={content[section.key] || ''}
                                                        onChange={(e) => setContent({ ...content, [section.key]: e.target.value })}
                                                        rows={section.type === 'html' ? 10 : 6}
                                                        style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="studio-input"
                                                        value={content[section.key] || ''}
                                                        onChange={(e) => setContent({ ...content, [section.key]: e.target.value })}
                                                    />
                                                )}
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                                    <button
                                                        className="studio-btn studio-btn-primary"
                                                        onClick={() => saveContent(section.key, content[section.key] || '')}
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        className="studio-btn studio-btn-secondary"
                                                        onClick={() => {
                                                            setEditingKey(null);
                                                            fetchContent();
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ color: '#94a3b8', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                                {currentValue || <em style={{ color: '#64748b' }}>Not set</em>}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
