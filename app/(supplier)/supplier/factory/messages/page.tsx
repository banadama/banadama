"use client";

import { useState, useEffect, FormEvent } from "react";
import { apiGet, apiPost, isApiError } from "@/lib/api";

interface Thread {
    id: string;
    title?: string;
    lastMessage?: string;
    lastMessageAt?: string;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderRole?: string;
    createdAt: string;
}

export default function FactoryMessagesPage() {
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
            const data = await apiGet<any>("/api/chat/threads?type=OPS_TO_SUPPLIER");
            setThreads(data.threads || []);
        } catch (err: any) {
            if (isApiError(err) && err.status === 403) {
                setError("Access denied.");
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
            }
        }
    };

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedThread || !newMessage.trim() || sending) return;

        setSending(true);
        try {
            // Use canonical endpoint: POST /api/chat/threads/[threadId]/messages
            await apiPost(`/api/chat/threads/${selectedThread.id}/messages`, { content: newMessage.trim() });
            setNewMessage("");
            const data = await apiGet<any>(`/api/chat/threads/${selectedThread.id}/messages`);
            setMessages(data.messages || []);
        } catch (err: any) {
            if (isApiError(err) && err.status === 403) {
                setError("Cannot send message.");
            }
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
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
                <p className="text-sm text-slate-400 mt-1">Communicate with Ops team</p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                    <button onClick={() => setError(null)} className="text-xs text-slate-400 mt-2">Dismiss</button>
                </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden h-[500px] flex">
                {/* Thread List */}
                <div className="w-1/3 border-r border-slate-800 flex flex-col">
                    <div className="p-3 border-b border-slate-800 bg-slate-800/50">
                        <h3 className="font-medium text-slate-100 text-sm">Ops Threads</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {threads.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">No conversations</div>
                        ) : (
                            threads.map((thread) => (
                                <button
                                    key={thread.id}
                                    onClick={() => selectThread(thread)}
                                    className={`w-full p-3 text-left border-b border-slate-800 hover:bg-slate-800/50 ${selectedThread?.id === thread.id ? "bg-slate-800/50" : ""
                                        }`}
                                >
                                    <p className="text-sm font-medium text-slate-100 truncate">{thread.title || "Ops Support"}</p>
                                    {thread.lastMessage && (
                                        <p className="text-xs text-slate-400 mt-1 truncate">{thread.lastMessage}</p>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 flex flex-col">
                    {selectedThread ? (
                        <>
                            <div className="p-3 border-b border-slate-800 bg-slate-800/50">
                                <h3 className="font-medium text-slate-100">{selectedThread.title || "Ops Support"}</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderRole === "FACTORY" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[70%] rounded-lg p-3 ${msg.senderRole === "FACTORY"
                                            ? "bg-blue-500/20 text-slate-100"
                                            : "bg-slate-800 text-slate-100"
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs text-slate-400 mt-1">{formatTime(msg.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-blue-400 disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500">
                            <div className="text-center">
                                <div className="text-4xl mb-2">💬</div>
                                <p>Select a conversation</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
