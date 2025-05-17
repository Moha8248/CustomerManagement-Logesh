// src/pages/CustomerListPage.jsx
import React, { useState, useEffect } from "react";
import CustomerTable from "../components/CustomerTable";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

const CustomerListPage = () => {
    const [refresh, setRefresh] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    // Navigate to Edit page with customer data
    const handleEdit = (customer) => {
        navigate(`/edit/${customer.id}`, { state: { customer } });
    };

    // Logout with loading indicator
    const handleLogout = () => {
        setLoggingOut(true);
        signOut(auth)
            .then(() => {
                toast.success("Logged out successfully!");
                navigate("/login");
            })
            .catch((error) => {
                toast.error("Logout failed!");
                console.error("Logout error:", error);
            })
            .finally(() => {
                setLoggingOut(false);
            });
    };

    // Navigate to Add customer page
    const handleAdd = () => {
        navigate("/add");
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <button
                    onClick={handleAdd}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
                >
                    Add New Customer
                </button>

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className={`bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition flex items-center justify-center ${loggingOut ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                >
                    {loggingOut ? (
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    ) : null}
                    Logout
                </button>
            </div>

            <CustomerTable onEdit={handleEdit} refresh={refresh} />
        </div>
    );
};

export default CustomerListPage;
