// src/components/CustomerTable.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const CustomerTable = ({ onEdit, refresh }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "customers"));
            const customerList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCustomers(customerList);
        } catch (error) {
            console.error("Error fetching customers: ", error);
            toast.error("Failed to load customers");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, [refresh]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteDoc(doc(db, "customers", id));
                toast.success("Customer deleted");
                fetchCustomers();
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete customer");
            }
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading customers...</div>;
    }

    if (customers.length === 0) {
        return <div className="text-center p-4">No customers found.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded-md">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Mobile</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Address</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">City</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Budget</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Space (Sq Ft)</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Response</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Notes</th>
                        <th className="border border-gray-300 px-3 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-3 py-2">{cust.name}</td>
                            <td className="border border-gray-300 px-3 py-2">{cust.mobile}</td>
                            <td className="border border-gray-300 px-3 py-2">{cust.address}</td>
                            <td className="border border-gray-300 px-3 py-2">{cust.city}</td>
                            <td className="border border-gray-300 px-3 py-2">{cust.budget}</td>
                            <td className="border border-gray-300 px-3 py-2">{cust.space}</td>
                            <td className="border border-gray-300 px-3 py-2">{cust.response}</td>
                            <td className="border border-gray-300 px-3 py-2 max-w-xs truncate">{cust.notes}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center space-x-2">
                                <button
                                    onClick={() => onEdit(cust)}
                                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cust.id)}
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTable;
