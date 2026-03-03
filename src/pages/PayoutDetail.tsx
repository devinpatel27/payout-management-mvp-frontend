import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    MessageSquare,
    Send,
    ShieldCheck,
    User,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { cn } from '../lib/utils';

export default function PayoutDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payout, setPayout]: any = useState(null);
    const [loading, setLoading] = useState(true);
    const [reason, setReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        fetchPayout();
    }, [id]);

    const fetchPayout = async () => {
        try {
            const { data } = await API.get(`/payouts/${id}`);
            setPayout(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string) => {
        if (['Approve', 'Reject'].includes(action) && !reason) {
            setError('Please provide a reason for this action');
            return;
        }

        setActionLoading(true);
        setError('');
        try {
            await API.post(`/payouts/${id}/${action.toLowerCase()}`, { reason });
            fetchPayout();
            setReason('');
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to ${action}`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="flex-1 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" /></div>;
    if (!payout) return <div className="p-10 text-center">Payout not found</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 animate-fade-in">
            <button
                onClick={() => navigate('/payouts')}
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
            >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass rounded-[2.5rem] p-10 border-slate-200/50 relative overflow-hidden bg-white/50">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <ShieldCheck className="w-40 h-40 text-slate-900" />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Transaction Summary</h1>
                                <p className="text-slate-500 mt-1 font-medium">Ref: <span className="text-blue-600 font-bold">{payout._id.slice(-8).toUpperCase()}</span></p>
                            </div>
                            <div className={cn(
                                "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border self-start",
                                payout.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                    payout.status === 'Rejected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                        "bg-blue-50 text-blue-600 border-blue-100"
                            )}>
                                {payout.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Vendor Recipient</p>
                                        <p className="font-bold text-slate-900">{payout.vendor_id?.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{payout.vendor_id?.upi_id || payout.vendor_id?.bank_account}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Payment Method</p>
                                        <p className="font-bold text-slate-900">{payout.mode}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Disbursement Amount</p>
                                        <p className="text-3xl font-display font-bold text-slate-900">₹{payout.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Transaction Note</p>
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed">{payout.note || 'No transaction notes provided.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[2rem] p-10 border-slate-200/50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Management Controls</h3>

                        {payout.status === 'Draft' && user?.role === 'OPS' && (
                            <button
                                onClick={() => handleAction('Submit')}
                                className="btn-premium premium-gradient text-white w-full flex items-center justify-center gap-3 active:scale-95"
                                disabled={actionLoading}
                            >
                                <Send className="w-5 h-5" /> {actionLoading ? 'Processing...' : 'Submit for Approval'}
                            </button>
                        )}

                        {payout.status === 'Submitted' && user?.role === 'FINANCE' && (
                            <div className="space-y-6">
                                <textarea
                                    placeholder="State the reason for approval or rejection..."
                                    className="w-full h-32 glass rounded-2xl p-5 border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                {error && <div className="text-rose-600 text-xs font-bold flex items-center gap-2 px-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleAction('Approve')}
                                        className="py-4 rounded-2xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                        disabled={actionLoading}
                                    >
                                        <CheckCircle2 className="w-5 h-5" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction('Reject')}
                                        className="py-4 rounded-2xl bg-rose-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                                        disabled={actionLoading}
                                    >
                                        <XCircle className="w-5 h-5" /> Reject
                                    </button>
                                </div>
                            </div>
                        )}

                        {(!((payout.status === 'Draft' && user?.role === 'OPS') ||
                            (payout.status === 'Submitted' && user?.role === 'FINANCE'))) && (
                                <div className="py-4 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-sm font-bold flex items-center justify-center gap-3">
                                    <Clock className="w-5 h-5" /> Actions currently locked for your role
                                </div>
                            )}
                    </div>
                </div>

                <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="glass rounded-[2rem] p-8 border-slate-200/50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Audit History</h3>
                        <div className="space-y-8 relative before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {payout.audit_trail?.map((log: any, i: number) => (
                                <div key={i} className="relative pl-12">
                                    <div className={cn(
                                        "absolute left-0 top-0 w-11 h-11 rounded-xl glass border-slate-200 flex items-center justify-center z-10",
                                        i === 0 ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-400"
                                    )}>
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-bold text-sm">{log.action}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{log.user_id?.name} • {new Date(log.timestamp).toLocaleDateString()}</p>
                                        {log.reason && (
                                            <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium italic">
                                                "{log.reason}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass rounded-[2rem] p-8 premium-gradient text-white border-none shadow-xl shadow-blue-500/20">
                        <ShieldCheck className="w-8 h-8 mb-4 opacity-50" />
                        <h4 className="font-bold text-lg mb-2">Verified Transaction</h4>
                        <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                            This payout is end-to-end encrypted and follows all regulatory compliance standards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
