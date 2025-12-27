"use client";

interface Props {
  email: string;
  onClose: () => void;
}

export default function OtpModal({ email, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-[420px] rounded-2xl p-8 shadow-xl z-10">
        <h3 className="text-xl text-black font-semibold text-center mb-2">
          Enter OTP
        </h3>

        <p className="text-sm text-gray-500 text-center mb-6">
          We’ve sent a code to <br />
          <span className="font-medium">{email}</span>
        </p>

        {/* OTP INPUTS */}
        <div className="flex justify-between gap-3 mb-6 text-black">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              maxLength={1}
              className="w-12 h-12 text-center text-xl rounded-lg border border-red-300 focus:ring-2 focus:ring-[#FF7A7A] outline-none"
            />
          ))}
        </div>

        <button className="w-full py-3 rounded-full bg-[#FF7A7A] text-white font-medium cursor-pointer hover:opacity-50">
          Submit
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Didn’t get a code?{" "}
          <span className="text-[#FF7A7A] font-medium cursor-pointer hover:opacity-35">
            Click to resend
          </span>
        </p>
      </div>
    </div>
  );
}
