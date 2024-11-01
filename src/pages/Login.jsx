import { useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { showFailureToast, showSuccessToast } from "../utils/toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { LoaderCircle } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { fetchProfile } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [error, setError] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    error && showFailureToast(error);
  }, [errorCount]);

  const handleLogin = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    try {
      const response = await authService.signInService(email, password);
      if (response.twoFactorEnabled) {
        setTwoFactorEnabled(true); // Show TOTP form
      } else {
        showSuccessToast("Login successful");
        fetchProfile();
        navigate("/dashboard"); // Navigate to dashboard or desired route
      }
    } catch (err) {
      setError(err.message || "Invalid credentials, please try again.");
      setErrorCount((prevCount) => prevCount + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await authService.signInService(email, password, totp);
      showSuccessToast("2FA Verification successful");
      fetchProfile();
    } catch (err) {
      setError(err.message || "Invalid TOTP, please try again.");
      setErrorCount((prevCount) => prevCount + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={twoFactorEnabled ? handleTotpSubmit : handleLogin}
        className="p-6 rounded shadow-md"
      >
        <h1 className="text-xl mb-4">Login</h1>
        {error && <p className="text-red-500">{error}</p>}

        {!twoFactorEnabled ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full mb-4 p-2 border"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-4 p-2 border"
            />
          </>
        ) : (
          <input
            type="text"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            placeholder="Enter TOTP"
            className="w-full mb-4 p-2 border"
          />
        )}

        {loading ? (
          <button className="btn btn-primary w-full" disabled>
            <LoaderCircle className="inline-block ml-2" size={24} />
          </button>
        ) : (
          <button type="submit" className="btn btn-primary w-full">
            {twoFactorEnabled ? "Verify TOTP" : "Login"}
          </button>
        )}

        {!twoFactorEnabled && (
          <div className="p-2">
            <Link
              to={"/register"}
              className="inline-block text-center text-blue-500 hover:text-blue-700 transition-colors underline"
            >
              Don't have an account? Register
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
