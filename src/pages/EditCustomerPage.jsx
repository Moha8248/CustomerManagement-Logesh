// src/pages/EditCustomerPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import CustomerForm from "../components/CustomerForm";
import { toast } from "react-toastify";

const EditCustomerPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Try to get customer data from location.state (passed from list page)
    const [customer, setCustomer] = useState(location.state?.customer || null);
    const [loading, setLoading] = useState(!customer);

    useEffect(() => {
        // If no customer in state, fetch from Firestore by id
        if (!customer) {
            const fetchCustomer = async () => {
                setLoading(true);
                try {
                    const docRef = doc(db, "customers", id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCustomer({ id: docSnap.id, ...docSnap.data() });
                    } else {
                        toast.error("Customer not found!");
                        navigate("/customers"); // redirect back to list page
                    }
                } catch (error) {
                    toast.error("Failed to fetch customer data");
                    console.error(error);
                    navigate("/customers");
                }
                setLoading(false);
            };
            fetchCustomer();
        }
    }, [customer, id, navigate]);

    const handleSave = async (updatedCustomer) => {
        try {
            const docRef = doc(db, "customers", id);
            await updateDoc(docRef, updatedCustomer);
            toast.success("Customer updated successfully");
            navigate("/customers");
        } catch (error) {
            toast.error("Failed to update customer");
            console.error(error);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading customer data...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
            <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
            <CustomerForm selectedCustomer={customer} onSave={handleSave} />
        </div>
    );
};

export default EditCustomerPage;
