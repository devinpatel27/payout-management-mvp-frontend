'use client';

import Navbar from '@/components/Navbar';
import API from '@/lib/api';
import { useEffect, useState } from 'react';

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Vendors</h1>
                    <a href="/vendors/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Vendor
                    </a>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPI ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vendors.map((vendor: any) => (
                                    <tr key={vendor._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{vendor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{vendor.upi_id || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {vendor.bank_account} {vendor.ifsc && `(${vendor.ifsc})`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {vendor.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
