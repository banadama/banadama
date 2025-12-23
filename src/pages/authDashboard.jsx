import React from 'react';

export default function AuthDashboard() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Authentication Dashboard</h1>
                        <p className="text-slate-400">Manage user authentication and access control</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <div className="text-3xl mb-2">👥</div>
                            <div className="text-2xl font-bold">1,234</div>
                            <div className="text-sm text-slate-400">Total Users</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <div className="text-3xl mb-2">✅</div>
                            <div className="text-2xl font-bold text-green-400">892</div>
                            <div className="text-sm text-slate-400">Verified</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <div className="text-3xl mb-2">⏳</div>
                            <div className="text-2xl font-bold text-yellow-400">342</div>
                            <div className="text-sm text-slate-400">Pending</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                            <div className="text-3xl mb-2">🔒</div>
                            <div className="text-2xl font-bold text-sky-400">156</div>
                            <div className="text-sm text-slate-400">Active Sessions</div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Authentication Activity</h2>
                        <div className="space-y-3">
                            {[
                                { user: 'buyer@demo.com', action: 'Logged in', time: '2 mins ago', status: 'success' },
                                { user: 'factory@demo.com', action: 'Password reset', time: '15 mins ago', status: 'info' },
                                { user: 'wholesaler@demo.com', action: 'Failed login attempt', time: '1 hour ago', status: 'warning' },
                                { user: 'creator@demo.com', action: 'Email verified', time: '2 hours ago', status: 'success' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-400' :
                                                activity.status === 'warning' ? 'bg-yellow-400' :
                                                    'bg-blue-400'
                                            }`}></div>
                                        <div>
                                            <div className="font-medium">{activity.user}</div>
                                            <div className="text-sm text-slate-400">{activity.action}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-400">{activity.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
