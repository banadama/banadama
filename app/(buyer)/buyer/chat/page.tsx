"use client";

import { useState } from "react";

// Mock messages with Ops
const MOCK_MESSAGES = [
    {
        id: "msg-1",
        senderId: "buyer",
        content: "Hi, I have a question about my order ORD-001",
        timestamp: "10:15 AM",
        isOps: false,
    },
    {
        id: "msg-2",
        senderId: "ops",
        content: "Hello! I'd be happy to help. Let me check the status of your order. One moment please.",
        timestamp: "10:18 AM",
        isOps: true,
    },
    {
        id: "msg-3",
        senderId: "ops",
        content: "Your order ORD-001 is currently in production at Lagos Textiles. Expected completion is in 3-5 business days.",
        timestamp: "10:20 AM",
        isOps: true,
    },
    {
        id: "msg-4",
        senderId: "buyer",
        content: "Great, thank you! Will I get a notification when it ships?",
        timestamp: "10:22 AM",
        isOps: false,
    },
    {
        id: "msg-5",
        senderId: "ops",
        content: "Yes! You'll receive an email and a notification in your dashboard when the order ships. You can also track it from your Orders page.",
        timestamp: "10:25 AM",
        isOps: true,
    },
];

// Mock past conversations
const MOCK_CONVERSATIONS = [
    {
        id: "conv-1",
        topic: "Order ORD-001 Status",
        lastMessage: "You'll receive an email and a notification...",
        updatedAt: "Today",
        unread: 0,
    },
    {
        id: "conv-2",
        topic: "RFQ-002 Quote Question",
        lastMessage: "The quote has been sent to your email",
        updatedAt: "Yesterday",
        unread: 0,
    },
];

export default function BuyerChatPage() {
    const [newMessage, setNewMessage] = useState("");
    const [selectedConversation, setSelectedConversation] = useState("conv-1");

    const handleSend = () => {
        if (newMessage.trim()) {
            // Would send message to API
            setNewMessage("");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-50">Messages</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Chat with Banadama Support
                </p>
            </div>

            {/* Info Banner */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                    <span className="text-xl">💬</span>
                    <div>
                        <p className="text-sm font-medium text-blue-300">Ops-Mediated Support</p>
                        <p className="text-xs text-blue-200 mt-1">
                            All buyer-supplier communication goes through our Ops team. This ensures
                            safe transactions and quick resolution of any issues.
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-[calc(100vh-320px)] flex rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                {/* Conversation List */}
                <div className="w-72 border-r border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-slate-800">
                        <button className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors">
                            + New Conversation
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
                        {MOCK_CONVERSATIONS.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv.id)}
                                className={`w-full p-4 text-left hover:bg-slate-800/50 transition-colors ${selectedConversation === conv.id ? "bg-slate-800/50" : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <p className="font-medium text-slate-100 text-sm truncate">
                                        {conv.topic}
                                    </p>
                                    <span className="text-[10px] text-slate-500">{conv.updatedAt}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 truncate">
                                    {conv.lastMessage}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xl">
                            🛡️
                        </div>
                        <div>
                            <p className="font-medium text-slate-100">Banadama Support</p>
                            <p className="text-xs text-slate-400">Ops Team • Usually responds within 2 hours</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Date divider */}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex-1 border-t border-slate-800" />
                            <span>Today</span>
                            <div className="flex-1 border-t border-slate-800" />
                        </div>

                        {MOCK_MESSAGES.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isOps ? "justify-start" : "justify-end"}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.isOps
                                            ? "bg-slate-800 text-slate-100"
                                            : "bg-emerald-500 text-slate-950"
                                        }`}
                                >
                                    {msg.isOps && (
                                        <p className="text-[10px] text-emerald-400 mb-1">Banadama Ops</p>
                                    )}
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${msg.isOps ? "text-slate-500" : "text-emerald-800"
                                        }`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
