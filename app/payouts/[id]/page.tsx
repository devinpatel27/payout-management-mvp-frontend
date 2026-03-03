'use client';

import Navbar from '@/components/Navbar';
import API from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PayoutDetailPage() {
    const [payout, setPayout] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const params = useParams();
    const router = useRouter();

    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userString ? JSON.parse(userString) : null;

    const fetchPayout = async () => {
        try {
            const { data } = await API.get(`/payouts/${params.id}`);
            setPayout(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayout();
    }, [params.id]);

    const handleAction = async (action: string) => {
        try {
            setError('');
            if (action === 'reject' && !reason) {
                setError('Please provide a reason for rejection');
                return;
            }
            await API.post(`/payouts/${params.id}/${action}`, { reason });
            fetchPayout();
            setReason('');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Action failed');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!payout) return <div>Payout not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                        <h1 className="text-xl font-bold">Payout Details</h1>
                        <span className={`px-3 py-1 text-sm rounded-full font-bold bg-opacity-20 ${payout.status === 'Draft' ? 'bg-gray-500 text-gray-700' :
                                payout.status === 'Submitted' ? 'bg-blue-500 text-blue-700' :
                                    payout.status === 'Approved' ? 'bg-green-500 text-green-700' :
                                        'bg-red-500 text-red-700'
                            }`}>
                            {payout.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Vendor</p>
                            <p className="font-semibold text-lg">{payout.vendor_id?.name}</p>
                            <p className="text-sm text-gray-600">UPI: {payout.vendor_id?.upi_id || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Bank: {payout.vendor_id?.bank_account} ({payout.vendor_id?.ifsc})</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Amount & Mode</p>
                            <p className="font-semibold text-lg">₹{payout.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Mode: {payout.mode}</p>
                            <p className="text-sm text-gray-600">Created by: {payout.created_by?.name}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500">Note</p>
                            <p className="text-gray-700">{payout.note || 'No note added'}</p>
                        </div>
                        {payout.decision_reason && (
                            <div className="col-span-2 bg-red-50 p-3 rounded border border-red-100">
                                <p className="text-sm text-red-600 font-bold">Decision Reason</p>
                                <p className="text-red-700">{payout.decision_reason}</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t flex flex-col space-y-4">
                        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

                        <div className="flex space-x-2">
                            {user?.role === 'OPS' && payout.status === 'Draft' && (
                                <button
                                    onClick={() => handleAction('submit')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                                >
                                    Submit for Approval
                                </button>
                            )}

                            {user?.role === 'FINANCE' && payout.status === 'Submitted' && (
                                <>
                                    <button
                                        onClick={() => handleAction('approve')}
                                        className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <div className="flex-1 flex space-x-2">
                                        <input
                                            className="flex-1 border border-gray-300 rounded px-3 py-1"
                                            placeholder="Reason for rejection..."
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleAction('reject')}
                                            className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h2 className="text-lg font-bold">Audit History</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {payout.audit_history?.map((audit: any, index: number) => (
                                <div key={audit._id} className="relative flex items-start space-x-3">
                                    <div className={`mt-1.5 h-2 w-2 rounded-full ring-4 ring-white shrink-0 ${audit.action === 'CREATED' ? 'bg-gray-400' :
                                            audit.action === 'SUBMITTED' ? 'bg-blue-500' :
                                                audit.action === 'APPROVED' ? 'bg-green-500' :
                                                    'bg-red-500'
                                        }`} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-gray-900">{audit.action}</p>
                                            <p className="text-xs text-gray-500">{new Date(audit.timestamp).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-gray-600">by {audit.user_id?.name} ({audit.user_id?.role})</p>
                                        {audit.details && <p className="mt-1 text-sm text-gray-500 italic">{audit.details}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
