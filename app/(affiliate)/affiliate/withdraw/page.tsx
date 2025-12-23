// app/(affiliate)/affiliate/withdraw/page.tsx - Affiliate Withdrawal Request
'use client';

import { useState, useEffect } from 'react';

interface WithdrawInfo {
    availableBalance: number;
    minimumPayout: number;
    pendingPayouts: Array<{
        id: string;
        amount: number;
        status: string;
        submittedAt: string;
    }>;
}

export default function AffiliateWithdrawPage() {
    const [info, setInfo] = useState<WithdrawInfo>({
        availableBalance: 0,
        minimumPayout: 500000, // ₦5,000
        pendingPayouts: [],
    });
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchInfo = async () => {
        try {
            const res = await fetch('/api/affiliate/withdraw', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setInfo(data);
            }
        } catch (err) {
            console.error('Error fetching withdrawal info:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const formatMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString()}`;

    const handleWithdraw = async () => {
        const amountKobo = Math.floor(parseFloat(amount) * 100);

        if (isNaN(amountKobo) || amountKobo <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (amountKobo > info.availableBalance) {
            alert('Amount exceeds available balance');
            return;
        }

        if (amountKobo < info.minimumPayout) {
            alert(`Minimum withdrawal is ${formatMoney(info.minimumPayout)}`);
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/affiliate/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ amount: amountKobo }),
            });

            if (res.ok) {
                alert('Withdrawal request submitted! Finance team will review and process.');
                setAmount('');
                fetchInfo();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit withdrawal');
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Withdraw</h1>
                <p className="text-slate-400">Request payout of your affiliate earnings</p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading...</div>
            ) : (
                <>
                    {/* Balance Card */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
                        <div className="text-center">
                            <div className="text-slate-400 mb-2">Available to Withdraw</div>
                            <div className="text-4xl font-bold text-green-400 mb-4">
                                {formatMoney(info.availableBalance)}
                            </div>
                            <div className="text-slate-500 text-sm">
                                Minimum withdrawal: {formatMoney(info.minimumPayout)}
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal Form */}
                    {info.availableBalance >= info.minimumPayout ? (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
                            <h3 className="text-white font-medium mb-4">Request Withdrawal</h3>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-slate-400 text-sm mb-2">Amount (₦)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-lg"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        onClick={handleWithdraw}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Withdraw'}
                                    </button>
                                </div>
                            </div>
                            <button
                                className="mt-4 text-sm text-purple-400 hover:underline"
                                onClick={() => setAmount(String(info.availableBalance / 100))}
                            >
                                Withdraw full balance
                            </button>
                        </div>
                    ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
                            <p className="text-yellow-400">
                                ⚠️ Your available balance is below the minimum withdrawal amount of {formatMoney(info.minimumPayout)}.
                                Keep earning to unlock withdrawals!
                            </p>
                        </div>
                    )}

                    {/* Pending Payouts */}
                    {info.pendingPayouts.length > 0 && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-700">
                                <h3 className="text-white font-medium">Pending Withdrawal Requests</h3>
                            </div>
                            <table className="w-full">
                                <thead className="bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Date</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Amount</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-slate-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {info.pendingPayouts.map((payout) => (
                                        <tr key={payout.id}>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(payout.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-white font-medium">
                                                {formatMoney(payout.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${payout.status === 'PENDING_FINANCE' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        payout.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-400' :
                                                            payout.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                                                'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                    {payout.status === 'PENDING_FINANCE' ? 'Awaiting Finance' :
                                                        payout.status === 'APPROVED' ? 'Approved' :
                                                            payout.status === 'COMPLETED' ? 'Completed' :
                                                                payout.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Info Note */}
                    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 mt-8">
                        <h3 className="text-white font-medium mb-2">💡 Withdrawal Process</h3>
                        <ol className="text-slate-400 text-sm space-y-2 list-decimal list-inside">
                            <li>Submit your withdrawal request</li>
                            <li>Finance team reviews and approves (1-2 business days)</li>
                            <li>Funds are transferred to your registered bank account</li>
                        </ol>
                    </div>
                </>
            )}
        </div>
    );
}
