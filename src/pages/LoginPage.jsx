import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully!");
            navigate("/customers");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-700 px-4">
            <ToastContainer />
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Login</h2>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="your.email@example.com"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="********"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white font-semibold ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
