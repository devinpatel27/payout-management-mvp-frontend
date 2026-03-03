import { Filter, Globe, Heart, Mail, Search, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { cn } from '../lib/utils';

export default function VendorsPage() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data } = await API.get('/vendors');
                setVendors(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-10 px-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight text-center md:text-left">Partner Network</h1>
                    <p className="text-slate-500 mt-2 font-medium text-center md:text-left">Directory of verified vendors and service providers.</p>
                </div>

                <Link
                    to="/vendors/add"
                    className="btn-premium premium-gradient text-white flex items-center justify-center gap-2 group w-full md:w-auto shadow-xl shadow-blue-500/20"
                >
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Onboard New Vendor
                </Link>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
                <div className="flex-1 glass rounded-2xl px-5 py-3 flex items-center gap-3 border-slate-200/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        placeholder="Find a partner by name, ID or category..."
                        className="bg-transparent border-none outline-none w-full text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                </div>
                <button className="glass px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-slate-600 hover:bg-slate-50 border-slate-200/50 transition-all">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 glass rounded-[2rem] animate-pulse bg-slate-50/50" />
                    ))}
                </div>
            ) : vendors.length === 0 ? (
                <div className="glass rounded-[3rem] p-20 text-center border-slate-200/40 animate-fade-in">
                    <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No Vendors Found</h3>
                    <p className="text-slate-500 mt-2">Start by onboarding your first business partner.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center animate-fade-in">
                    {vendors.map((vendor: any, index: number) => (
                        <div
                            key={vendor._id}
                            className="glass rounded-[2rem] p-8 border-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden h-full flex flex-col items-center hover:-translate-y-1"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center font-display font-bold text-2xl text-blue-600 mb-6 group-hover:premium-gradient group-hover:text-white transition-all shadow-sm">
                                {vendor.name.charAt(0)}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{vendor.name}</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Verified Vendor</p>

                            <div className="mt-6 w-full space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Heart className={cn("w-4 h-4", vendor.is_active ? "text-emerald-500 fill-emerald-500" : "text-slate-300")} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{vendor.is_active ? 'Active Partner' : 'Inactive'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium truncate">{vendor.upi_id || 'Bank Settlement'}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-2 w-full justify-center">
                                <Link
                                    to={`/payouts/create?vendor=${vendor._id}`}
                                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20 active:scale-95"
                                >
                                    Disburse
                                </Link>
                                <button className="w-12 h-11 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border-slate-200/50 active:scale-95">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
