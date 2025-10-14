import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import PasswordInput from "../../components/PasswordInput";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    if (password !== confirm) {
      // show error
      return;
    }
    try {
      await resetPassword(token, password);
      alert("Password reset successful. Please login.");
      navigate("/");
    } catch (err) {
      console.error(err);
      // show error
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <PasswordInput name="password" placeholder="New password" required />
        <PasswordInput name="confirm" placeholder="Confirm password" required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
