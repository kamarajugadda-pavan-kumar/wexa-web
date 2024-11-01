import { useState, useEffect } from "react";
import authService from "../services/authService";
import { showFailureToast, showSuccessToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    error && showFailureToast(error);
  }, [error]);

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await authService.signUpService(
        form.email,
        form.password,
        form.username
      );
      showSuccessToast(res);
      navigate("/login");
      // Handle successful registration (e.g., redirect or show success message)
    } catch (err) {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleRegister} className=" p-6 rounded shadow-md w-96">
        <h1 className="text-xl mb-4">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          className="w-full mb-4 p-2 border"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full mb-4 p-2 border"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="w-full mb-4 p-2 border"
          required
        />
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          placeholder="Confirm Password"
          className="w-full mb-4 p-2 border"
          required
        />
        {loading && (
          <button className="btn btn-primary w-full">
            <LoaderCircle className="inline-block ml-2" size={24} />
          </button>
        )}
        {!loading && (
          <button type="submit" className="w-full btn btn-primary py-2 rounded">
            Register
          </button>
        )}
      </form>
    </div>
  );
}

export default Register;
