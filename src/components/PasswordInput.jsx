import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function PasswordInput({ name, placeholder, required }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border-none pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
      >
        {show ? <LuEyeOff size={20} /> : <LuEye size={20} />}
      </button>
    </div>
  );
}
