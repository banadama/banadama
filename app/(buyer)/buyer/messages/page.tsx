"use client";

import { useState, useEffect, FormEvent } from "react";
import { apiGet, apiPost, isApiError } from "@/lib/api";

interface Thread {
    id: string;
    title?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount?: number;
    participants?: Array<{ email: string; role: string }>;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderEmail?: string;
    senderRole?: string;
    createdAt: string;
}

export default function BuyerMessagesPage() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiGet<any>("/api/chat/threads?type=BUYER_TO_OPS");
            setThreads(data.threads || []);
        } catch (err: any) {
            if (isApiError(err) && err.status === 403) {
                setError("You don't have permission to access messages. Please contact support.");
            } else {
                setError(err.message || "Failed to load messages");
            }
        } finally {
            setLoading(false);
        }
    };

    const selectThread = async (thread: Thread) => {
        setSelectedThread(thread);
        try {
            // Use canonical endpoint: GET /api/chat/threads/[threadId]/messages
            const data = await apiGet<any>(`/api/chat/threads/${thread.id}/messages`);
            setMessages(data.messages || []);
        } catch (err: any) {
            if (isApiError(err) && err.status === 403) {
                setError("Access denied to this conversation.");
            } else {
                setError(err.message || "Failed to load messages");
            }
        }
    };

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedThread || !newMessage.trim() || sending) return;

        setSending(true);
        try {
            // Use canonical endpoint: POST /api/chat/threads/[threadId]/messages
            await apiPost(`/api/chat/threads/${selectedThread.id}/messages`, {
                content: newMessage.trim(),
            });
            setNewMessage("");
            // Refresh messages
            const data = await apiGet<any>(`/api/chat/threads/${selectedThread.id}/messages`);
            setMessages(data.messages || []);
        } catch (err: any) {
            if (isApiError(err) && err.status === 403) {
                setError("You don't have permission to send messages in this thread.");
            } else {
                setError(err.message || "Failed to send message");
            }
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-slate-400">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Messages</h1>
                <p className="text-sm text-slate-400 mt-1">Communicate with our operations team</p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                    <button onClick={() => setError(null)} className="text-xs text-slate-400 mt-2 hover:text-slate-300">
                        Dismiss
                    </button>
                </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden h-[600px] flex">
                {/* Thread List */}
                <div className="w-1/3 border-r border-slate-800 flex flex-col">
                    <div className="p-3 border-b border-slate-800">
                        <h3 className="font-medium text-slate-100 text-sm">Conversations</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {threads.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">
                                No conversations yet
                            </div>
                        ) : (
                            threads.map((thread) => (
                                <button
                                    key={thread.id}
                                    onClick={() => selectThread(thread)}
                                    className={`w-full p-3 text-left border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${selectedThread?.id === thread.id ? "bg-slate-800/50" : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-medium text-slate-100 truncate">
                                            {thread.title || "Ops Support"}
                                        </p>
                                        {thread.unreadCount && thread.unreadCount > 0 && (
                                            <span className="bg-emerald-500 text-slate-950 text-xs rounded-full px-1.5 py-0.5">
                                                {thread.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    {thread.lastMessage && (
                                        <p className="text-xs text-slate-400 mt-1 truncate">{thread.lastMessage}</p>
                                    )}
                                    {thread.lastMessageAt && (
                                        <p className="text-xs text-slate-500 mt-1">{formatDate(thread.lastMessageAt)}</p>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Messages View */}
                <div className="flex-1 flex flex-col">
                    {selectedThread ? (
                        <>
                            {/* Header */}
                            <div className="p-3 border-b border-slate-800">
                                <h3 className="font-medium text-slate-100">{selectedThread.title || "Ops Support"}</h3>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderRole === "BUYER" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[70%] rounded-lg p-3 ${msg.senderRole === "BUYER"
                                            ? "bg-emerald-500/20 text-slate-100"
                                            : "bg-slate-800 text-slate-100"
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs text-slate-400 mt-1">{formatTime(msg.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                                >
                                    {sending ? "..." : "Send"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-slate-500">
                                <div className="text-4xl mb-2">💬</div>
                                <p>Select a conversation to view messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
