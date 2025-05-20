import React, { useState } from "react";
import CustomerTable from "../components/CustomerTable";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import CustomerForm from "../components/CustomerForm";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const CustomerListPage = () => {
    const [refresh, setRefresh] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth();

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditCustomer(null);
    };

    const handleCustomerUpdate = async (updatedCustomer) => {
        try {
            const docRef = doc(db, "customers", updatedCustomer.id);
            await updateDoc(docRef, updatedCustomer);
            toast.success("Customer updated");
            setShowModal(false);
            setEditCustomer(null);
            setRefresh((prev) => !prev);
        } catch (error) {
            toast.error("Update failed");
            console.error(error);
        }
    };

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
                    className={`bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition flex items-center justify-center ${loggingOut ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                    {loggingOut ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    ) : null}
                    Logout
                </button>
            </div>

            <CustomerTable onEdit={handleEdit} refresh={refresh} />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button onClick={handleModalClose} className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-black">&times;</button>
                        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
                        <CustomerForm initialData={editCustomer} onSave={handleCustomerUpdate} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerListPage;
