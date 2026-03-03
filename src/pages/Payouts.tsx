import { ArrowRight, Filter, Plus, Search, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { cn } from '../lib/utils';

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                const { data } = await API.get('/payouts');
                setPayouts(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayouts();
    }, []);

    const totalVolume = payouts.reduce((acc: number, curr: any) => acc + curr.amount, 0);

    return (
        <div className="max-w-7xl mx-auto py-10 px-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Financial Overview</h1>
                    <p className="text-slate-500 mt-2 font-medium">Track and manage all outgoing disbursements.</p>
                </div>

                <div className="flex items-center gap-4 animate-fade-in">
                    <div className="glass px-6 py-3 rounded-2xl hidden lg:block border-slate-200/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Volume</p>
                        <p className="text-xl font-display font-bold text-slate-900">₹{totalVolume.toLocaleString()}</p>
                    </div>
                    <Link
                        to="/payouts/create"
                        className="btn-premium premium-gradient text-white flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        Create Payout
                    </Link>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
                <div className="flex-1 glass rounded-2xl px-5 py-3 flex items-center gap-3 border-slate-200/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        placeholder="Search transactions by reference or vendor..."
                        className="bg-transparent border-none outline-none w-full text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                </div>
                <button className="glass px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:bg-slate-50 border-slate-200/50 transition-all">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border-slate-200/50 shadow-2xl shadow-slate-200/40 animate-fade-in">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-8 py-6"><div className="h-6 bg-slate-100 rounded-lg w-full" /></td>
                                </tr>
                            ))
                        ) : payouts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <Wallet className="w-12 h-12 text-slate-100" />
                                        <div>
                                            <p className="text-slate-900 font-bold text-lg">No disbursements found</p>
                                            <p className="text-slate-400 mt-1 text-sm">Your disbursement history will appear here.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : payouts.map((payout: any, index: number) => (
                            <tr
                                key={payout._id}
                                className="group hover:bg-blue-50/20 transition-all duration-300"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-display font-bold text-blue-600 group-hover:premium-gradient group-hover:text-white transition-all shadow-sm">
                                            {payout.vendor_id?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{payout.vendor_id?.name || 'Unknown'}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{payout.mode}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-display font-bold text-slate-900 text-lg">₹{payout.amount.toLocaleString()}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border inline-flex items-center gap-2",
                                        payout.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/10" :
                                            payout.status === 'Rejected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                payout.status === 'Submitted' ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-500/10" :
                                                    "bg-slate-100 text-slate-500 border-slate-200"
                                    )}>
                                        <span className={cn("w-1.5 h-1.5 rounded-full",
                                            payout.status === 'Approved' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                                payout.status === 'Submitted' ? "bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" :
                                                    "bg-current")}
                                        />
                                        {payout.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link
                                        to={`/payouts/${payout._id}`}
                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors group/btn"
                                    >
                                        Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
