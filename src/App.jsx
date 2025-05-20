import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import CustomerListPage from "./pages/CustomerListPage";
import AddCustomerPage from "./pages/AddCustomerPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/customers" /> : <LoginPage />} />
        <Route path="/customers" element={user ? <CustomerListPage /> : <Navigate to="/login" />} />
        <Route path="/add-customer" element={user ? <AddCustomerPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/customers" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;