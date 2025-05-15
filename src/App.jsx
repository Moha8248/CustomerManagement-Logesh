import React, { useState } from "react";
import CustomerForm from "./components/CustomerForm";
import CustomerTable from "./components/CustomerTable";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleSave = async (customer) => {
    if (customer.id) {
      await updateDoc(doc(db, "customers", customer.id), customer);
      toast.success("Customer updated!");
    } else {
      await addDoc(collection(db, "customers"), customer);
      toast.success("Customer added!");
    }
    setSelectedCustomer(null);
    setRefresh(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-800">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-center mb-6">Customer Manager</h1>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow">
          <CustomerForm onSave={handleSave} selectedCustomer={selectedCustomer} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow overflow-auto">
          <CustomerTable onEdit={setSelectedCustomer} refresh={refresh} />
        </div>
      </div>
    </div>
  );
}

export default App;
