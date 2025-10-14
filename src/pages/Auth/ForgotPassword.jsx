import { useNavigate } from "react-router-dom";
import { sendResetEmail } from "../../api/auth";
import { IoClose } from "react-icons/io5"; // 👈 install react-icons if not installed
import { useState } from "react";
import ForgetPasswordOtpVerification from "../../components/forgetPassword/ForgetPasswordOtpVerification";

export default function ForgotPassword() {
  const [openLoginVerify, setOpenLoginVerify] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await sendResetEmail(email);
      toast.success("OTP sent successfully. Check your email.");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset link. Try again.");
    }
  };

  return (
    <>
    {openLoginVerify &&
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-black h-[666px] ">
      <form
        className="relative bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        {/* ❌ Cross button */}
        <button
          type="button"
          onClick={() => navigate(-1)} // 👈 go back to previous page
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-gray-400">
          Enter your email address and we'll send you a code to reset your password.
        </p>


        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border-none"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold p-3 rounded-md mt-2"
        >
          Send 
        </button>
      </form>
    </div>
    }
    
    <div>
        {!openLoginVerify && <ForgetPasswordOtpVerification/> }
    </div>
    </>
  );
}
