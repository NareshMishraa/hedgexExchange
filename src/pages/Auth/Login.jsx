// src/pages/Auth/Login.jsx
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials");
    }
  };

  return (
    <>
      <p className="text-white text-xl text-center font-bold bg-orange-400 flex justify-center">
        To navigate from v1 to v2, you can use this platform.
      </p>

      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black h-[638px]">
        <form
          className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">LogIn</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border-none"
          />
          <PasswordInput name="password" placeholder="Password" required />
          <div className="text-center">
            <a href="/forgot-password" className="text-white text-sm hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold p-3 rounded-md mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
