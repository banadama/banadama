// components/chat/ChatThread.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderEmail: string;
    senderRole: string;
    attachments: string[];
    createdAt: string;
}

interface ChatThreadProps {
    threadId: string;
    currentUserId: string;
}

export default function ChatThread({ threadId, currentUserId }: ChatThreadProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
    }, [threadId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function fetchMessages() {
        setLoading(true);
        try {
            const response = await fetch(`/api/chat/threads/${threadId}/messages`);
            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();

        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await fetch(`/api/chat/threads/${threadId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage.trim(),
                    attachments: [],
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessages([...messages, data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    }

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    function formatTimestamp(timestamp: string) {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    return (
        <div className="h-full bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    <>
                        {messages.map((message) => {
                            const isOwnMessage = message.senderId === currentUserId;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${isOwnMessage
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                : 'bg-slate-800 text-slate-100'
                                            }`}
                                    >
                                        {!isOwnMessage && (
                                            <div className="text-xs text-slate-400 mb-1">
                                                {message.senderEmail.split('@')[0]} ({message.senderRole})
                                            </div>
                                        )}
                                        <div className="text-sm leading-relaxed">{message.content}</div>
                                        <div
                                            className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-slate-500'
                                                }`}
                                        >
                                            {formatTimestamp(message.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sending}
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
}
