// src/pages/AddCustomerPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";

const AddCustomerPage = () => {
  const navigate = useNavigate();

  const handleSave = async (customer) => {
    try {
      await addDoc(collection(db, "customers"), customer);
      toast.success("Customer added successfully!");
      navigate("/customers"); // Navigate back to customer list page
    } catch (error) {
      toast.error("Failed to add customer.");
      console.error("Add customer error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex flex-col items-center">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Add New Customer</h1>
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow">
        <CustomerForm onSave={handleSave} />
      </div>
    </div>
  );
};

export default AddCustomerPage;
