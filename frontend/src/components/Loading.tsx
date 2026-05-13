import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-[#0B141A] flex items-center justify-center">

      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-[#202C33] border-t-[#25D366] rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;