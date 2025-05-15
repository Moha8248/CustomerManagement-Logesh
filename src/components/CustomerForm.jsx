import React, { useState, useEffect } from 'react';

const CustomerForm = ({ onSave, selectedCustomer }) => {
    const [customer, setCustomer] = useState({
        name: '',
        mobile: '',
        address: '',
        city: '',
        budget: '',
        space: '',
        response: 'Good',
        notes: ''
    });

    useEffect(() => {
        if (selectedCustomer) setCustomer(selectedCustomer);
    }, [selectedCustomer]);

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(customer);
        setCustomer({
            name: '', mobile: '', address: '', city: '', budget: '',
            space: '', response: 'Good', notes: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "mobile", "address", "city", "budget", "space"].map((field) => (
                <div key={field}>
                    <label className="block text-sm font-semibold mb-1 capitalize">{field}</label>
                    <input
                        name={field}
                        value={customer[field]}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300"
                        type="text"
                        required
                    />
                </div>
            ))}
            <div>
                <label className="block text-sm font-semibold mb-1">Customer Response</label>
                <select
                    name="response"
                    value={customer.response}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300"
                >
                    <option>Good</option>
                    <option>Very Good</option>
                    <option>Bad</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold mb-1">Additional Notes</label>
                <textarea
                    name="notes"
                    value={customer.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 rounded-md border border-gray-300"
                />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white w-full">
                {selectedCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
        </form>
    );
};

export default CustomerForm;
