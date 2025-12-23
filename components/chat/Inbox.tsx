// components/chat/Inbox.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Thread {
    id: string;
    type: string;
    title: string;
    participants: Array<{
        id: string;
        email: string;
        role: string;
    }>;
    lastMessage: any;
    unreadCount: number;
    lastMessageAt: string | null;
}

export default function Inbox() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetchThreads();
    }, [filter]);

    async function fetchThreads() {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter === 'unread') params.set('unreadOnly', 'true');

            const response = await fetch(`/api/chat/threads?${params}`);
            const data = await response.json();
            setThreads(data.threads || []);
        } catch (error) {
            console.error('Error fetching threads:', error);
        } finally {
            setLoading(false);
        }
    }

    function getThreadIcon(type: string) {
        const icons: Record<string, string> = {
            BUYER_TO_OPS: '💬',
            OPS_TO_SUPPLIER: '📦',
            CREATOR_TO_SUPPLIER: '🎨',
            MINI_MARKET: '🏪',
        };
        return icons[type] || '💬';
    }

    function formatTime(timestamp: string | null) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    return (
        <div className="h-full bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'unread'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        Unread
                    </button>
                </div>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : threads.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {threads.map((thread) => (
                            <Link
                                key={thread.id}
                                href={`/messages/${thread.id}`}
                                className="block p-4 hover:bg-slate-800/50 transition"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="text-3xl">{getThreadIcon(thread.type)}</div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-semibold text-white truncate">
                                                {thread.title}
                                            </h3>
                                            {thread.lastMessageAt && (
                                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                                    {formatTime(thread.lastMessageAt)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Participants */}
                                        <div className="text-sm text-slate-400 mb-1">
                                            {thread.participants
                                                .map((p) => p.email.split('@')[0])
                                                .slice(0, 2)
                                                .join(', ')}
                                            {thread.participants.length > 2 &&
                                                ` +${thread.participants.length - 2} more`}
                                        </div>

                                        {/* Last Message */}
                                        {thread.lastMessage && (
                                            <div className="text-sm text-slate-500 truncate">
                                                {thread.lastMessage.content}
                                            </div>
                                        )}
                                    </div>

                                    {/* Unread Badge */}
                                    {thread.unreadCount > 0 && (
                                        <div className="min-w-[24px] h-6 px-2 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">
                                                {thread.unreadCount > 99 ? '99+' : thread.unreadCount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
