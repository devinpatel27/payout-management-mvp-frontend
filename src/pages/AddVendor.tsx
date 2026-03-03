import { ArrowLeft, Landmark, Send, Shield, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function AddVendorPage() {
    const [formData, setFormData] = useState({
        name: '',
        upi_id: '',
        bank_account: '',
        ifsc: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/vendors', formData);
            navigate('/vendors');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to onboard vendor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 animate-fade-in">
            <button
                onClick={() => navigate('/vendors')}
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
            >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Partners
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-[2.5rem] p-8 premium-gradient text-white text-center shadow-xl shadow-blue-500/10">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm ring-1 ring-white/30">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-display font-bold tracking-tight">Onboard Partner</h1>
                        <p className="text-blue-100 mt-2 text-sm leading-relaxed">Expand your network by adding verified service providers to the ecosystem.</p>
                    </div>

                    <div className="glass rounded-[2rem] p-6 space-y-6 border-slate-200/50">
                        <div className="flex gap-4">
                            <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">All vendor data is encrypted and saved securely for compliance.</p>
                        </div>
                        <div className="flex gap-4">
                            <Landmark className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">Cross-verify IFSC and Bank details ensuring seamless settlements.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="glass rounded-[2.5rem] p-8 md:p-10 border-slate-200/50 shadow-xl shadow-slate-200/40 bg-white/50">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in">
                                    <Shield className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Legal Entity Name</label>
                                <input
                                    required
                                    placeholder="Acme Corp Pvt Ltd"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">UPI ID (Optional)</label>
                                    <input
                                        placeholder="partner@upi"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        value={formData.upi_id}
                                        onChange={e => setFormData({ ...formData, upi_id: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Partner Status</span>
                                    <div className="py-4 px-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs uppercase tracking-widest text-center">
                                        Auto-Verified
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">Banking Information</h3>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Account Number</label>
                                    <input
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                        value={formData.bank_account}
                                        onChange={e => setFormData({ ...formData, bank_account: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">IFSC Code</label>
                                    <input
                                        placeholder="HDFC0001234"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium uppercase"
                                        value={formData.ifsc}
                                        onChange={e => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 mt-6 premium-gradient text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Finalize Onboarding</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
