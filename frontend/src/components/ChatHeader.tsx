import { User } from "@/context/AppContext";
import { Menu, UserCircle } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
}

const ChatHeader = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
}: ChatHeaderProps) => {

  const isOnlineUser =
    user && onlineUsers.includes(user._id);

  return (
    <>
      {/* Mobile Menu */}
      <div className="sm:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-11 h-11 rounded-full bg-[#202C33] flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Header */}
      <div className="bg-[#111B21] border-b border-[#202C33] px-5 py-4">

        {user ? (
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="relative">

              <div className="w-14 h-14 rounded-full bg-[#202C33] flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-gray-300" />
              </div>

              {/* Online */}
              {isOnlineUser && (
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-[#111B21]" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">

              <h2 className="text-xl font-semibold text-white truncate">
                {user.name}
              </h2>

              {isTyping ? (
                <div className="flex items-center gap-2 mt-1">

                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-bounce" />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-bounce"
                      style={{
                        animationDelay: "0.1s",
                      }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-bounce"
                      style={{
                        animationDelay: "0.2s",
                      }}
                    />
                  </div>

                  <span className="text-sm text-[#25D366]">
                    typing...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">

                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnlineUser
                        ? "bg-[#25D366]"
                        : "bg-gray-500"
                    }`}
                  />

                  <span
                    className={`text-sm ${
                      isOnlineUser
                        ? "text-[#25D366]"
                        : "text-gray-400"
                    }`}
                  >
                    {isOnlineUser
                      ? "online"
                      : "offline"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-[#202C33] flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-gray-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                ChatApp
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Select a conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatHeader;