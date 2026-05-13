import {
  Loader2,
  Paperclip,
  Send,
  X,
} from "lucide-react";

import React, { useState } from "react";

interface MessageInputProps {
  selectedUser: string | null;

  message: string;

  setMessage: (message: string) => void;

  handleMessageSend: (
    e: any,
    imageFile?: File | null
  ) => void;
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  handleMessageSend,
}: MessageInputProps) => {

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!message.trim() && !imageFile)
      return;

    setIsUploading(true);

    await handleMessageSend(
      e,
      imageFile
    );

    setImageFile(null);

    setIsUploading(false);
  };

  if (!selectedUser) return null;

  return (
    <div className="bg-[#111B21] border-t border-[#202C33] px-3 py-3">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >

        {/* Image Preview */}
        {imageFile && (
          <div className="relative w-fit">

            <img
              src={URL.createObjectURL(
                imageFile
              )}
              alt="preview"
              className="w-24 h-24 object-cover rounded-2xl border border-[#2A3942]"
            />

            <button
              type="button"
              onClick={() =>
                setImageFile(null)
              }
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#202C33] flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2">

          {/* File Upload */}
          <label className="w-11 h-11 rounded-full bg-[#202C33] hover:bg-[#2A3942] flex items-center justify-center cursor-pointer transition-all">

            <Paperclip className="w-5 h-5 text-gray-300" />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (
                  file &&
                  file.type.startsWith(
                    "image/"
                  )
                ) {
                  setImageFile(file);
                }
              }}
            />
          </label>

          {/* Message Input */}
          <input
            type="text"
            placeholder={
              imageFile
                ? "Add a caption..."
                : "Type a message"
            }
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="flex-1 bg-[#202C33] rounded-full px-5 py-3 text-sm text-white placeholder:text-gray-400 outline-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={
              (!imageFile &&
                !message.trim()) ||
              isUploading
            }
            className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#20BD5A] flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;