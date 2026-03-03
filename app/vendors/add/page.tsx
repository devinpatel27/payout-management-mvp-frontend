'use client';

import Navbar from '@/components/Navbar';
import API from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddVendorPage() {
    const [formData, setFormData] = useState({ name: '', upi_id: '', bank_account: '', ifsc: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post('/vendors', formData);
            router.push('/vendors');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add vendor');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="bg-white p-6 shadow rounded-lg">
                    <h1 className="text-2xl font-bold mb-6">Add New Vendor</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vendor Name *</label>
                            <input
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.upi_id}
                                onChange={e => setFormData({ ...formData, upi_id: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.bank_account}
                                onChange={e => setFormData({ ...formData, bank_account: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData.ifsc}
                                onChange={e => setFormData({ ...formData, ifsc: e.target.value })}
                            />
                        </div>
                        <div className="pt-4 flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save Vendor
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
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
