"use client";

import axios from "axios";
import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Cookies from "js-cookie";

import {
  useAppData,
  user_service,
} from "@/context/AppContext";

import Loading from "./Loading";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const {
    isAuth,
    setIsAuth,
    setUser,
    loading: userLoading,
    fetchChats,
    fetchUsers,
  } = useAppData();

  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState<string>("");

  const [resendLoading, setResendLoading] =
    useState(false);

  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<
    Array<HTMLInputElement | null>
  >([]);

  const router = useRouter();

  const searchParams = useSearchParams();

  const email: string =
    searchParams.get("email") || "";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
  if (isAuth) {
    router.push("/chat");
  }
}, [isAuth, router]);

  const handleInputChange = (
    index: number,
    value: string
  ): void => {
    if (value.length > 1) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLElement>
  ): void => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();

    const pasteData =
      e.clipboardData.getData("text");

    const digits = pasteData
      .replace(/\D/g, "")
      .slice(0, 6);

    if (digits.length === 6) {
      const newOtp = digits.split("");

      setOtp(newOtp);

      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/verify`,
        {
          email,
          otp: otpString,
        }
      );

      toast.success(data.message);

      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        sameSite : "none",
        path: "/",
      });

      setOtp(["", "", "", "", "", ""]);

      inputRefs.current[0]?.focus();

      setUser(data.user);
      setIsAuth(true);
      router.push("/chat");
      setTimeout(() => {
        fetchChats();
        fetchUsers();
      }, 100);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    setError("");

    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/login`,
        {
          email,
        }
      );

      toast.success(data.message);

      setTimer(60);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Failed to resend code"
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0B141A] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Back Button */}
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Main Card */}
        <div className="bg-[#111B21] border border-[#202C33] rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="mx-auto w-24 h-24 rounded-full bg-[#25D366] flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Verify your account
            </h1>

            <p className="text-gray-400 text-sm leading-6">
              We’ve sent a 6-digit verification code to
            </p>

            <p className="text-[#25D366] font-medium mt-2 break-all">
              {email}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* OTP Inputs */}
            <div>

              <label className="block text-center text-sm text-gray-300 mb-5">
                Enter OTP
              </label>

              <div className="flex justify-center gap-3">

                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(
                      el: HTMLInputElement | null
                    ) => {
                      inputRefs.current[index] =
                        el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    inputMode="numeric"
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={
                      index === 0
                        ? handlePaste
                        : undefined
                    }
                    className="w-14 h-14 bg-[#202C33] border border-[#2A3942] rounded-2xl text-white text-xl text-center font-bold outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all"
                  />
                ))}

              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                <p className="text-red-400 text-sm text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-[#111B21] font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-8 text-center">

            <p className="text-gray-500 text-sm mb-3">
              Didn’t receive the code?
            </p>

            {timer > 0 ? (
              <p className="text-sm text-gray-400">
                Resend code in{" "}
                <span className="text-[#25D366] font-semibold">
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-[#25D366] hover:text-[#20BD5A] font-semibold transition-all disabled:opacity-50"
              >
                {resendLoading
                  ? "Sending..."
                  : "Resend Code"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;