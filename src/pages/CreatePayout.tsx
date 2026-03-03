import { AlertCircle, ArrowLeft, Info, Send, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api';
import { cn } from '../lib/utils';

export default function CreatePayoutPage() {
    const [vendors, setVendors] = useState([]);
    const [formData, setFormData] = useState({
        vendor_id: '',
        amount: '',
        mode: 'UPI',
        note: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data } = await API.get('/vendors');
                setVendors(data.data.filter((v: any) => v.is_active));
                const vendorId = searchParams.get('vendor');
                if (vendorId) {
                    setFormData(prev => ({ ...prev, vendor_id: vendorId }));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchVendors();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (Number(formData.amount) <= 0) {
            setError('Amount must be greater than zero');
            setLoading(false);
            return;
        }

        try {
            await API.post('/payouts', {
                ...formData,
                amount: Number(formData.amount)
            });
            navigate('/payouts');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create payout');
        } finally {
            setLoading(false);
        }
    };

    const selectedVendor: any = vendors.find((v: any) => v._id === formData.vendor_id);

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 animate-fade-in">
            <button
                onClick={() => navigate('/payouts')}
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
            >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-[2.5rem] p-8 bg-slate-900 text-white text-center shadow-xl shadow-slate-900/20">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm ring-1 ring-white/20">
                            <Wallet className="text-blue-400 w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-display font-bold tracking-tight">Issue Payout</h1>
                        <p className="text-slate-400 mt-2 text-sm leading-relaxed">Securely disburse funds to your verified partners and vendors.</p>
                    </div>

                    {selectedVendor && (
                        <div className="glass rounded-[2rem] p-6 border-blue-500/20 bg-blue-50/30 animate-fade-in">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center text-white font-bold text-xs ring-4 ring-blue-500/5">
                                    {selectedVendor.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{selectedVendor.name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Selected Recipient</p>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-slate-200/50">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">Settle Via</span>
                                    <span className="text-slate-900">{formData.mode}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-slate-400 uppercase tracking-widest text-[9px]">ID Proof</span>
                                    <span className="text-slate-900 truncate max-w-[120px]">{selectedVendor.upi_id || 'Bank A/C'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="glass rounded-[2rem] p-6 flex gap-4 border-slate-200/50">
                        <Info className="w-5 h-5 text-blue-500 shrink-0" />
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Verification checks will be performed before settlement is finalized.</p>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="glass rounded-[2.5rem] p-8 md:p-10 border-slate-200/50 shadow-xl shadow-slate-200/40 bg-white/50">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Recipient Partner</label>
                                <select
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 appearance-none shadow-sm"
                                    value={formData.vendor_id}
                                    onChange={e => setFormData({ ...formData, vendor_id: e.target.value })}
                                >
                                    <option value="">Choose a partner...</option>
                                    {vendors.map((v: any) => (
                                        <option key={v._id} value={v._id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Disbursement Amount</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 font-bold group-focus-within:text-blue-600 transition-colors">₹</div>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        step="0.01"
                                        className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-display font-bold text-lg text-slate-900 shadow-sm"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Payment Protocol</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['UPI', 'IMPS', 'NEFT'].map(mode => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, mode })}
                                            className={cn(
                                                "py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border shadow-sm",
                                                formData.mode === mode
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                                                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 active:scale-[0.98]"
                                            )}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Transaction Ref / Note</label>
                                <textarea
                                    placeholder="Purpose of this disbursement..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium min-h-[100px] resize-none shadow-sm"
                                    value={formData.note}
                                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 mt-6 premium-gradient text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Initialize Transaction <Send className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
