// File: src/components/CustomerTable.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

const CustomerTable = ({ onEdit, refresh }) => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [activeMobile, setActiveMobile] = useState(null);

    const fetchCustomers = async () => {
        const snapshot = await getDocs(collection(db, "customers"));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(list);
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "customers", id));
        toast.error("Customer deleted!");
        fetchCustomers();
    };

    useEffect(() => {
        fetchCustomers();
    }, [refresh]);

    const filtered = customers.filter((c) =>
        Object.values(c).some(value =>
            value?.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    const toggleMobileMenu = (id) => {
        setActiveMobile(prev => (prev === id ? null : id));
    };

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Search all fields..."
                className="w-full p-2 rounded-md border border-gray-300"
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-white text-black rounded-md overflow-hidden shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-2 text-left">Name</th>
                            <th className="px-3 py-2 text-left">Mobile</th>
                            <th className="px-3 py-2 text-left">Address</th>
                            <th className="px-3 py-2 text-left">City</th>
                            <th className="px-3 py-2 text-left">Budget</th>
                            <th className="px-3 py-2 text-left">Space</th>
                            <th className="px-3 py-2 text-left">Response</th>
                            <th className="px-3 py-2 text-left">Notes</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c) => (
                            <tr key={c.id} className="border-b hover:bg-gray-100 relative">
                                <td className="px-3 py-2">{c.name}</td>
                                <td className="px-3 py-2 relative">
                                    <span
                                        className="cursor-pointer text-blue-600 underline"
                                        onClick={() => toggleMobileMenu(c.id)}
                                    >
                                        {c.mobile}
                                    </span>
                                    {activeMobile === c.id && (
                                        <div className="absolute z-10 mt-1 bg-white border border-gray-300 shadow-md rounded-md p-2 space-y-1">
                                            <a
                                                href={`tel:${c.mobile}`}
                                                className="block text-blue-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                📞 Call
                                            </a>
                                            <a
                                                href={`https://wa.me/91${c.mobile}`}
                                                className="block text-green-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                💬 WhatsApp
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="px-3 py-2">{c.address}</td>
                                <td className="px-3 py-2">{c.city}</td>
                                <td className="px-3 py-2">{c.budget}</td>
                                <td className="px-3 py-2">{c.space}</td>
                                <td className="px-3 py-2">{c.response}</td>
                                <td className="px-3 py-2">{c.notes}</td>
                                <td className="px-3 py-2 flex flex-wrap gap-2">
                                    <button onClick={() => onEdit(c)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center p-4 text-gray-500">No customers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;
