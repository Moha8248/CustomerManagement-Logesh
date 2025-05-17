import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setLoading(true);
        signOut(auth)
            .then(() => {
                setLoading(false);
                navigate("/login", { replace: true }); // Navigate to login immediately
            })
            .catch(() => {
                setLoading(false);
                alert("Logout failed, please try again.");
            });
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
        >
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutButton;
