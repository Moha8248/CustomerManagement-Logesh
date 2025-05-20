import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { toast } from "react-toastify";

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(false);
    const [openMobilePopupId, setOpenMobilePopupId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "customers"), orderBy("regNo"));
                const querySnapshot = await getDocs(q);
                const customersList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCustomers(customersList);
                setFilteredCustomers(customersList);
            } catch (error) {
                toast.error("Failed to fetch customers");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setOpenMobilePopupId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = customers.filter((c) =>
            Object.values(c).some((val) =>
                String(val).toLowerCase().includes(term)
            )
        );
        setFilteredCustomers(filtered);
    };

    const handleEdit = (customer) => {
        setEditingId(customer.id);
        setEditedData(customer);
    };

    const handleSave = async (id) => {
        try {
            const docRef = doc(db, "customers", id);
            await updateDoc(docRef, editedData);
            toast.success("Customer updated!");
            setEditingId(null);
            const updatedList = customers.map((c) =>
                c.id === id ? { ...c, ...editedData } : c
            );
            setCustomers(updatedList);
            setFilteredCustomers(
                updatedList.filter((c) =>
                    Object.values(c).some((val) =>
                        String(val).toLowerCase().includes(searchTerm)
                    )
                )
            );
        } catch (error) {
            toast.error("Update failed: " + error.message);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedData({});
    };

    const handleFieldChange = (field, value) => {
        setEditedData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteDoc(doc(db, "customers", id));
                toast.success("Customer deleted!");
                const updated = customers.filter((c) => c.id !== id);
                setCustomers(updated);
                setFilteredCustomers(
                    updated.filter((c) =>
                        Object.values(c).some((val) =>
                            String(val).toLowerCase().includes(searchTerm)
                        )
                    )
                );
            } catch (error) {
                toast.error("Delete failed: " + error.message);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch (error) {
            toast.error("Logout failed: " + error.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left animate-fadeIn">
                    Customer List
                </h1>
                <div className="flex gap-2 flex-wrap justify-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border px-3 py-1 rounded text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                    <button
                        onClick={() => navigate("/add-customer")}
                        className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm sm:text-base transform hover:scale-105 transition"
                    >
                        Add Customer
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 text-sm sm:text-base transform hover:scale-105 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                {[
                                    "Reg.No",
                                    "Date & Time",
                                    "Name",
                                    "Mobile",
                                    "Address",
                                    "City",
                                    "Budget",
                                    "Space (Sq Ft)",
                                    "Response",
                                    "Notes",
                                    "Actions",
                                ].map((heading, idx) => (
                                    <th
                                        key={idx}
                                        className={`border px-3 py-2 text-left ${heading === "Actions" ? "text-center" : ""
                                            }`}
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer, index) => {
                                const isEditing = editingId === customer.id;
                                const isMobilePopup = openMobilePopupId === customer.id;
                                return (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-gray-50 relative animate-fadeInUp"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Reg.No */}
                                        <td className="border px-3 py-2">{customer.regNo}</td>

                                        {/* Date & Time */}
                                        <td className="border px-3 py-2 text-xs text-gray-600">
                                            {isEditing ? (
                                                <input
                                                    type="datetime-local"
                                                    value={
                                                        editedData.createdAt
                                                            ? new Date(editedData.createdAt)
                                                                .toISOString()
                                                                .slice(0, 16)
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            "createdAt",
                                                            new Date(e.target.value).toISOString()
                                                        )
                                                    }
                                                    className="w-full p-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                                />
                                            ) : customer.createdAt ? (
                                                new Date(customer.createdAt).toLocaleString()
                                            ) : (
                                                "-"
                                            )}
                                        </td>

                                        {/* Name */}
                                        <td className="border px-3 py-2">
                                            {isEditing ? (
                                                <input
                                                    value={editedData.name || ""}
                                                    onChange={(e) =>
                                                        handleFieldChange("name", e.target.value)
                                                    }
                                                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                                />
                                            ) : (
                                                customer.name
                                            )}
                                        </td>

                                        {/* Mobile with popup */}
                                        <td className="border px-3 py-2 relative">
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={editedData.mobile || ""}
                                                    onChange={(e) =>
                                                        handleFieldChange("mobile", e.target.value)
                                                    }
                                                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                                />
                                            ) : (
                                                <span
                                                    className="text-blue-600 cursor-pointer underline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMobilePopupId((prev) =>
                                                            prev === customer.id ? null : customer.id
                                                        );
                                                    }}
                                                >
                                                    {customer.mobile}
                                                </span>
                                            )}
                                            {isMobilePopup && !isEditing && (
                                                <div
                                                    className="absolute z-10 bg-white shadow border rounded p-2 space-y-1 text-sm top-8 left-0 animate-popupFadeIn"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <a
                                                        href={`https://wa.me/${customer.mobile}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-green-600 hover:underline"
                                                    >
                                                        WhatsApp
                                                    </a>
                                                    <a
                                                        href={`tel:${customer.mobile}`}
                                                        className="block text-blue-600 hover:underline"
                                                    >
                                                        Call
                                                    </a>
                                                </div>
                                            )}
                                        </td>

                                        {/* Rest of the fields */}
                                        {["address", "city", "budget", "space"].map((field) => (
                                            <td key={field} className="border px-3 py-2">
                                                {isEditing ? (
                                                    <input
                                                        value={editedData[field] || ""}
                                                        onChange={(e) =>
                                                            handleFieldChange(field, e.target.value)
                                                        }
                                                        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                                    />
                                                ) : (
                                                    customer[field]
                                                )}
                                            </td>
                                        ))}

                                        {/* Response Dropdown */}
                                        <td className="border px-3 py-2">
                                            {isEditing ? (
                                                <select
                                                    value={editedData.response || ""}
                                                    onChange={(e) =>
                                                        handleFieldChange("response", e.target.value)
                                                    }
                                                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Hot">Hot</option>
                                                    <option value="Warm">Warm</option>
                                                    <option value="Bad">Bad</option>
                                                </select>
                                            ) : (
                                                customer.response
                                            )}
                                        </td>

                                        {/* Notes */}
                                        <td className="border px-3 py-2">
                                            {isEditing ? (
                                                <textarea
                                                    value={editedData.notes || ""}
                                                    onChange={(e) =>
                                                        handleFieldChange("notes", e.target.value)
                                                    }
                                                    className="w-full p-1 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                                    rows={2}
                                                />
                                            ) : (
                                                customer.notes
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="border px-3 py-2 text-center space-x-1 whitespace-nowrap">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(customer.id)}
                                                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transform hover:scale-110 transition"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transform hover:scale-110 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(customer)}
                                                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transform hover:scale-110 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(customer.id)}
                                                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transform hover:scale-110 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomerListPage;
