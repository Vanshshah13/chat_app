"use client"

import Loading from '@/components/Loading';
import { useAppData, user_service } from '@/context/AppContext';
import axios from 'axios';
import { ArrowRight, Loader2, MessageCircle } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const { isAuth, loading: userLoading } = useAppData();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(
                `${user_service}/api/v1/login`,
                {
                    email,
                }
            );

            toast.success(data.message);

            router.push(`/verify?email=${email}`);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) return <Loading />;
    if (isAuth) return redirect("/chat");

    return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg">
                        <MessageCircle className="text-white w-10 h-10" />
                    </div>

                    <h1 className="text-4xl font-bold text-white mt-5">
                        ChatApp
                    </h1>

                    <p className="text-gray-400 mt-2 text-center">
                        Simple. Secure. Fast messaging.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#111b21] border border-[#202c33] rounded-2xl p-8 shadow-2xl">

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">
                            Welcome Back 👋
                        </h2>

                        <p className="text-gray-400 text-sm">
                            Enter your email to receive a verification code.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm text-gray-300 mb-2"
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[#202c33] border border-[#2a3942] focus:border-[#25D366] outline-none text-white px-4 py-4 rounded-xl transition-all duration-200 placeholder:text-gray-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            By continuing, you agree to our Terms & Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;