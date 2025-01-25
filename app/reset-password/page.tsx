"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Toast from "../components/Toast"; // Import the Toast component

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isValidToken, setIsValidToken] = useState(true);
    const [isSafari, setIsSafari] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token") || "";

    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            setToast({ message: "🚨 Invalid password reset link.", type: "error" });
        }

        // Detect if the user is in Safari
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
            setIsSafari(true);
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setToast(null);

        if (password !== confirmPassword) {
            setToast({ message: "⚠️ Passwords do not match.", type: "error" });
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setToast({ message: "✅ Password updated successfully!", type: "success" });
                setTimeout(() => {
                    router.push("/login");
                }, 2500); // Redirect after success
            } else {
                setToast({ message: `🚨 ${data.message || "Something went wrong!"}`, type: "error" });
            }
        } catch (error) {
            setToast({ message: "Server error. Please try again.", type: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/breakfast-2.png')" }}>
            <div className="bg-white/45 backdrop-blur-lg border border-white p-6 m-6 rounded-2xl shadow-md w-full max-w-md">
                <div className="bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center">
                    <Image
                        src="/images/kAi.png"
                        alt="kai"
                        width={28}
                        height={28}
                    />
                </div>
                <h2 className="text-xl font-semibold mt-2 mb-4 text-slate-950 text-center">Reset Your Password</h2>

                {!isValidToken ? (
                    <p className="text-red-500 text-center">Invalid password reset link.</p>
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

                        <button type="submit" className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-white rounded-full">
                            Reset Password
                        </button>
                    </form>
                )}

                {/* SHOW THIS ONLY IF USER IS IN SAFARI */}
                {isSafari && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-700 mb-2">
                            ⚠️ You are in Safari. To continue in the Dishcovery App:
                        </p>
                        <button
                            onClick={() => router.push("dishcoveryai.app/reset-password?token=" + token)}
                            className="w-full py-2 bg-[#00a39e] text-white rounded-full"
                        >
                            Open in Dishcovery App
                        </button>
                    </div>
                )}
            </div>

            {/* Render the Toast if a message exists */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
