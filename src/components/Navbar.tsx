import { LayoutDashboard, LogOut, Users, Wallet } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { name: 'Payouts', path: '/payouts', icon: Wallet },
        { name: 'Vendors', path: '/vendors', icon: Users },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200/60 h-20">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    <Link to="/payouts" className="flex items-center gap-3">
                        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <LayoutDashboard className="text-white w-6 h-6" />
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
                            Payout<span className="text-blue-600">Pro</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                        isActive
                                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end mr-2">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1.5 px-2 py-0.5 bg-blue-50 rounded-full">
                            {user?.role}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm hover:scale-105 active:scale-95"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
