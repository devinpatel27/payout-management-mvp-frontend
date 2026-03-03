'use client';

import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <span className="font-bold text-xl text-blue-600">PayoutManager</span>
                    <div className="space-x-4">
                        <a href="/payouts" className="text-gray-600 hover:text-blue-600">Payouts</a>
                        <a href="/vendors" className="text-gray-600 hover:text-blue-600">Vendors</a>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-500 text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
