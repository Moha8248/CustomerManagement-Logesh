// src/components/CustomerForm.jsx
import React, { useState, useEffect } from "react";

const CustomerForm = ({ onSave, initialData = null }) => {
    const [customer, setCustomer] = useState({
        name: "",
        mobile: "",
        address: "",
        city: "",
        budget: "",
        space: "",
        response: "Good",
        notes: "",
    });

    useEffect(() => {
        if (initialData) {
            setCustomer({
                name: initialData.name || "",
                mobile: initialData.mobile || "",
                address: initialData.address || "",
                city: initialData.city || "",
                budget: initialData.budget || "",
                space: initialData.space || "",
                response: initialData.response || "Good",
                notes: initialData.notes || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(customer);
    };

    const getLabel = (field) => {
        switch (field) {
            case "city":
                return "Land or Plot Required City";
            case "space":
                return "Required Land (in Sq Ft)";
            default:
                return field.charAt(0).toUpperCase() + field.slice(1);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto p-4 bg-white rounded-lg shadow-md"
        >
            {["name", "mobile", "address", "city", "budget", "space"].map((field) => (
                <div key={field}>
                    <label htmlFor={field} className="block mb-1 font-semibold text-gray-700">
                        {getLabel(field)}
                    </label>
                    <input
                        id={field}
                        name={field}
                        type="text"
                        value={customer[field]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${getLabel(field)}`}
                    />
                </div>
            ))}

            <div>
                <label htmlFor="response" className="block mb-1 font-semibold text-gray-700">
                    Customer Response
                </label>
                <select
                    id="response"
                    name="response"
                    value={customer.response}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Good</option>
                    <option>Very Good</option>
                    <option>Bad</option>
                </select>
            </div>

            <div>
                <label htmlFor="notes" className="block mb-1 font-semibold text-gray-700">
                    Additional Notes
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={customer.notes}
                    onChange={handleChange}
                    placeholder="Enter any notes"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
            >
                {initialData ? "Update Customer" : "Add Customer"}
            </button>
        </form>
    );
};

export default CustomerForm;
