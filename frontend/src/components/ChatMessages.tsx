import { Message } from "@/app/chat/page";
import { User } from "@/context/AppContext";
import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import moment from "moment";

import {
  Check,
  CheckCheck,
} from "lucide-react";

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInUser: User | null;
}

const ChatMessages = ({
  selectedUser,
  messages,
  loggedInUser,
}: ChatMessagesProps) => {

  const bottomRef =
    useRef<HTMLDivElement>(null);

  // Remove Duplicate Messages
  const uniqueMessages = useMemo(() => {
    if (!messages) return [];

    const seen = new Set();

    return messages.filter((message) => {
      if (seen.has(message._id)) {
        return false;
      }

      seen.add(message._id);

      return true;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedUser, uniqueMessages]);

  return (
    <div className="flex-1 overflow-hidden bg-[#0B141A]">

      <div className="h-full max-h-[calc(100vh-145px)] overflow-y-auto px-3 py-4 space-y-2 custom-scroll">

        {!selectedUser ? (
          <div className="flex items-center justify-center h-full">

            <p className="text-gray-500 text-sm">
              Select a chat to start messaging
            </p>
          </div>
        ) : (
          <>
            {uniqueMessages.map((e, i) => {

              const isSentByMe =
                e.sender ===
                loggedInUser?._id;

              const uniqueKey = `${e._id}-${i}`;

              return (
                <div
                  key={uniqueKey}
                  className={`flex ${
                    isSentByMe
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-sm px-3 py-2 rounded-2xl ${
                      isSentByMe
                        ? "bg-[#005C4B] text-white rounded-br-md"
                        : "bg-[#202C33] text-white rounded-bl-md"
                    }`}
                  >

                    {/* Image */}
                    {e.messageType ===
                      "image" &&
                      e.image && (
                        <img
                          src={e.image.url}
                          alt="shared"
                          className="rounded-xl max-w-full h-auto mb-2"
                        />
                      )}

                    {/* Text */}
                    {e.text && (
                      <p className="text-sm break-words">
                        {e.text}
                      </p>
                    )}

                    {/* Time */}
                    <div
                      className={`flex items-center gap-1 mt-1 text-[11px] ${
                        isSentByMe
                          ? "justify-end text-gray-300"
                          : "justify-end text-gray-400"
                      }`}
                    >

                      <span>
                        {moment(
                          e.createdAt
                        ).format("hh:mm A")}
                      </span>

                      {isSentByMe && (
                        <>
                          {e.seen ? (
                            <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-gray-300" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;