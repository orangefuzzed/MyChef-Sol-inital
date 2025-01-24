"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isValidToken, setIsValidToken] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token") || "";

    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            setMessage("Invalid password reset link.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();
            setMessage(data.message);

            if (res.ok) {
                setTimeout(() => {
                    router.push("/login");
                }, 2000); // Redirect to login page after success
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/breakfast-2.png')" }}>
            <div className="bg-white/45 backdrop-blur-lg border border-white p-6 m-6 rounded-lg shadow-md w-full max-w-md">
                <div className="bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center">
                    <Image
                        src="/images/kAi.png"
                        alt="kai"
                        width={28}
                        height={28}
                    />
                </div>
                <h2 className="text-xl font-semibold mb-4 text-slate-950 text-center">Reset Your Password</h2>
                {!isValidToken ? (
                    <p className="text-red-500">{message}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm New Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        {message && <p className="text-red-500 mb-4">{message}</p>}
                        <button type="submit" className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-white rounded-full">
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
