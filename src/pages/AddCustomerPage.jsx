import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const AddCustomerPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    budget: "",
    space: "",
    response: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getNextRegNo = async () => {
    try {
      const q = query(collection(db, "customers"), orderBy("regNo", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const lastCustomer = querySnapshot.docs[0].data();
        return lastCustomer.regNo + 1;
      }
      return 1;
    } catch (error) {
      console.error("Error getting last regNo:", error);
      return 1;
    }
  };

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    const hours24 = date.getHours();
    const hours = hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? "PM" : "AM";
    const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    const formattedTime = `${pad(hours)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nextRegNo = await getNextRegNo();
      const now = new Date();
      await addDoc(collection(db, "customers"), {
        ...formData,
        regNo: nextRegNo,
        createdAt: now.toISOString(),
        createdDateTime: formatDateTime(now),
      });
      toast.success("Customer added successfully!");
      navigate("/customers");
    } catch (error) {
      toast.error("Error adding customer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Add New Customer
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name" },
            { label: "Mobile", name: "mobile", type: "tel" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "Budget", name: "budget" },
            { label: "Space (Sq Ft)", name: "space" },
            { label: "Response", name: "response" },
            { label: "Notes", name: "notes" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="p-2 border rounded text-sm"
              />
            </div>
          ))}

          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-center sm:justify-start gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {loading ? "Adding..." : "Add Customer"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerPage;
