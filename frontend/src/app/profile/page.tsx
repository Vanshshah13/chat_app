"use client";

import {
  useAppData,
  user_service,
} from "@/context/AppContext";

import { useRouter } from "next/navigation";

import React, {
  useEffect,
  useState,
} from "react";

import Cookies from "js-cookie";
import axios from "axios";

import toast from "react-hot-toast";

import Loading from "@/components/Loading";

import {
  ArrowLeft,
  Save,
  User,
  UserCircle,
} from "lucide-react";

const ProfilePage = () => {

  const {
    user,
    isAuth,
    loading,
    setUser,
  } = useAppData();

  const [isEdit, setIsEdit] =
    useState(false);

  const [name, setName] =
    useState<string | undefined>("");

  const router = useRouter();

  const editHandler = () => {
    setIsEdit(!isEdit);

    setName(user?.name);
  };

  const submitHandler = async (
    e: any
  ) => {

    e.preventDefault();

    const token =
      Cookies.get("token");

    try {

      const { data } =
        await axios.post(
          `${user_service}/api/v1/update/user`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      Cookies.set(
        "token",
        data.token,
        {
          expires: 15,
          secure: false,
          path: "/",
        }
      );

      toast.success(data.message);

      setUser(data.user);

      setIsEdit(false);

    } catch (error: any) {

      toast.error(
        error?.response?.data
          ?.message ||
          "Something went wrong"
      );
    }
  };

  useEffect(() => {

    if (!isAuth && !loading) {
      router.push("/login");
    }

  }, [isAuth, router, loading]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0B141A] px-4 py-6">

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() =>
              router.push("/chat")
            }
            className="w-12 h-12 rounded-full bg-[#202C33] hover:bg-[#2A3942] flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Profile
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Manage your account
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111B21] border border-[#202C33] rounded-3xl overflow-hidden">

          {/* Top Section */}
          <div className="px-8 py-10 border-b border-[#202C33]">

            <div className="flex items-center gap-5">

              {/* Avatar */}
              <div className="relative">

                <div className="w-24 h-24 rounded-full bg-[#202C33] flex items-center justify-center">
                  <UserCircle className="w-14 h-14 text-gray-300" />
                </div>

                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#25D366] border-2 border-[#111B21]" />
              </div>

              {/* User Info */}
              <div>

                <h2 className="text-2xl font-semibold text-white">
                  {user?.name || "User"}
                </h2>

                <p className="text-sm text-[#25D366] mt-1">
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">

            {/* Display Name */}
            <div>

              <label className="block text-sm text-gray-400 mb-3">
                Display Name
              </label>

              {isEdit ? (

                <form
                  onSubmit={
                    submitHandler
                  }
                  className="space-y-4"
                >

                  <div className="relative">

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      className="w-full bg-[#202C33] border border-[#2A3942] rounded-2xl px-5 py-4 pr-12 text-white outline-none focus:border-[#25D366]"
                    />

                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex gap-3">

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-[#111B21] font-medium transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={
                        editHandler
                      }
                      className="px-6 py-3 rounded-2xl bg-[#202C33] hover:bg-[#2A3942] text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

              ) : (

                <div className="flex items-center justify-between gap-4 bg-[#202C33] rounded-2xl px-5 py-4">

                  <span className="text-white font-medium">
                    {user?.name ||
                      "No Name"}
                  </span>

                  <button
                    onClick={
                      editHandler
                    }
                    className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-[#111B21] font-medium transition-all"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="bg-[#202C33] rounded-2xl px-5 py-4">

              <p className="text-sm text-gray-400 mb-1">
                Email
              </p>

              <p className="text-white font-medium break-all">
                {user?.email}
              </p>
            </div>

            {/* Status */}
            <div className="bg-[#202C33] rounded-2xl px-5 py-4 flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Account Status
                </p>

                <p className="text-[#25D366] font-medium">
                  Active
                </p>
              </div>

              <span className="w-3 h-3 rounded-full bg-[#25D366]" />
            </div>

            {/* Joined */}
            <div className="bg-[#202C33] rounded-2xl px-5 py-4">

              <p className="text-sm text-gray-400 mb-1">
                Joined
              </p>

              <p className="text-white font-medium">
                Recently Joined
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;