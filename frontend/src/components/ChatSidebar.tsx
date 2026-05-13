import { User } from "@/context/AppContext";
import {
  CornerDownLeft,
  CornerUpRight,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";

import Link from "next/link";
import React, { useState } from "react";

interface chatSidebarProps {
  sidebarOpen: boolean;

  setSidebarOpen: (
    open: boolean
  ) => void;

  showAllUsers: boolean;

  setShowAllUsers: (
    show:
      | boolean
      | ((
          prev: boolean
        ) => boolean)
  ) => void;

  users: User[] | null;

  loggedInUser: User | null;

  chats: any[] | null;

  selectedUser: string | null;

  setSelectedUser: (
    userId: string | null
  ) => void;

  handleLogout: () => void;

  createChat: (
    user: User
  ) => void;

  onlineUsers: string[];
}

const ChatSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  showAllUsers,
  setShowAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  handleLogout,
  setSelectedUser,
  createChat,
  onlineUsers,
}: chatSidebarProps) => {

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    showLogoutPopup,
    setShowLogoutPopup,
  ] = useState(false);

  return (
    <>
      <aside
        className={`fixed sm:static z-30 top-0 left-0 h-screen w-80 bg-[#111B21] border-r border-[#202C33] flex flex-col transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full sm:translate-x-0"
        }`}
      >

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#202C33]">

          {/* Mobile Close */}
          <div className="sm:hidden flex justify-end mb-3">

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="p-2 hover:bg-[#202C33] rounded-full transition-all"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Top */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>

              <h2 className="text-xl font-bold text-white">
                {showAllUsers
                  ? "New Chat"
                  : "Chats"}
              </h2>
            </div>

            {/* Toggle */}
            <button
              onClick={() =>
                setShowAllUsers(
                  (prev) => !prev
                )
              }
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                showAllUsers
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#25D366] hover:bg-[#20BD5A]"
              }`}
            >
              {showAllUsers ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Plus className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-5">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder={
                showAllUsers
                  ? "Search users..."
                  : "Search chats..."
              }
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="w-full bg-[#202C33] border border-[#2A3942] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-[#25D366]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-3">

          {/* Users */}
          {showAllUsers ? (
            <div className="space-y-2">

              {users
                ?.filter(
                  (u) =>
                    u._id !==
                      loggedInUser?._id &&
                    u.name
                      .toLowerCase()
                      .includes(
                        searchQuery.toLowerCase()
                      )
                )
                .map((u) => (
                  <button
                    key={u._id}
                    onClick={() =>
                      createChat(u)
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#202C33] transition-all text-left"
                  >

                    {/* Avatar */}
                    <div className="relative">

                      <div className="w-14 h-14 rounded-full bg-[#202C33] flex items-center justify-center">
                        <UserCircle className="w-9 h-9 text-gray-300" />
                      </div>

                      {onlineUsers.includes(
                        u._id
                      ) && (
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#111B21] rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">

                      <h3 className="text-white font-medium truncate">
                        {u.name}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {onlineUsers.includes(
                          u._id
                        )
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          ) : chats &&
            chats.length > 0 ? (

            /* Chats */
            <div className="space-y-1">

              {chats.map((chat) => {

                const latestMessage =
                  chat.chat.latestMessage;

                const isSelected =
                  selectedUser ===
                  chat.chat._id;

                const isSentByMe =
                  latestMessage?.sender ===
                  loggedInUser?._id;

                const unseenCount =
                  chat.chat.unseenCount ||
                  0;

                return (
                  <button
                    key={chat.chat._id}
                    onClick={() => {

                      setSelectedUser(
                        chat.chat._id
                      );

                      setSidebarOpen(
                        false
                      );
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                      isSelected
                        ? "bg-[#202C33]"
                        : "hover:bg-[#1A252F]"
                    }`}
                  >

                    {/* Avatar */}
                    <div className="relative">

                      <div className="w-14 h-14 rounded-full bg-[#202C33] flex items-center justify-center">
                        <UserCircle className="w-9 h-9 text-gray-300" />
                      </div>

                      {onlineUsers.includes(
                        chat.user?._id
                      ) && (
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#111B21] rounded-full" />
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">

                      <div className="flex items-center justify-between mb-1">

                        <h3 className="font-medium text-white truncate">
                          {chat.user?.name || "Unknown User"}
                        </h3>

                        {unseenCount >
                          0 && (
                          <div className="min-w-5 h-5 px-1.5 rounded-full bg-[#25D366] text-[#111B21] text-xs font-bold flex items-center justify-center">
                            {unseenCount >
                            99
                              ? "99+"
                              : unseenCount}
                          </div>
                        )}
                      </div>

                      {/* Last Message */}
                      {latestMessage && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">

                          {isSentByMe ? (
                            <CornerUpRight className="w-4 h-4 text-[#53BDEB]" />
                          ) : (
                            <CornerDownLeft className="w-4 h-4 text-[#25D366]" />
                          )}

                          <span className="truncate">
                            {
                              latestMessage.text
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (

            /* Empty */
            <div className="flex flex-col items-center justify-center h-full text-center">

              <div className="w-20 h-20 rounded-full bg-[#202C33] flex items-center justify-center mb-5">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>

              <h3 className="text-white text-lg font-semibold">
                No chats yet
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                Start a conversation
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#202C33] space-y-2">

          {/* Profile */}
          <Link
            href={"/profile"}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#202C33] transition-all"
          >

            <div className="w-11 h-11 rounded-full bg-[#202C33] flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-gray-300" />
            </div>

            <div>
              <p className="text-white font-medium">
                Profile
              </p>

              <p className="text-xs text-gray-400">
                Manage your account
              </p>
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={() =>
              setShowLogoutPopup(true)
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 transition-all text-left"
          >

            <div className="w-11 h-11 rounded-full bg-red-500/20 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>

            <div>
              <p className="text-red-400 font-medium">
                Logout
              </p>

              <p className="text-xs text-gray-500">
                Sign out from account
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">

          <div className="w-full max-w-sm bg-[#111B21] border border-[#202C33] rounded-3xl p-6">

            <h2 className="text-xl font-semibold text-white mb-2">
              Logout
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowLogoutPopup(
                    false
                  )
                }
                className="flex-1 py-3 rounded-2xl bg-[#202C33] hover:bg-[#2A3942] text-white transition-all"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleLogout
                }
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;