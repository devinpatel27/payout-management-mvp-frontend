'use client';

import Navbar from '@/components/Navbar';
import API from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreatePayoutPage() {
    const [vendors, setVendors] = useState([]);
    const [formData, setFormData] = useState({ vendor_id: '', amount: '', mode: 'UPI', note: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data } = await API.get('/vendors');
                setVendors(data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVendors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post('/payouts', formData);
            router.push('/payouts');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create payout');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="bg-white p-6 shadow rounded-lg">
                    <h1 className="text-2xl font-bold mb-6">Create New Payout</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Vendor *</label>
                            <select
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.vendor_id}
                                onChange={e => setFormData({ ...formData, vendor_id: e.target.value })}
                            >
                                <option value="">Choose a vendor</option>
                                {vendors.map((v: any) => (
                                    <option key={v._id} value={v._id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount (INR) *</label>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Mode *</label>
                            <select
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.mode}
                                onChange={e => setFormData({ ...formData, mode: e.target.value })}
                            >
                                <option value="UPI">UPI</option>
                                <option value="IMPS">IMPS</option>
                                <option value="NEFT">NEFT</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Note</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                rows={3}
                                value={formData.note}
                                onChange={e => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>
                        <div className="pt-4 flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600"
                            >
                                Create (as Draft)
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
