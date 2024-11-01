import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import authService from "../services/authService";

const EmailVerification = () => {
  const location = useLocation();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
          throw new Error("Invalid verification link.");
        }

        // Attempt email verification
        const verificationRes = await authService.verifyEmailService(token);

        setMessage(
          "Your email has been successfully verified! You can now log in."
        );
      } catch (err) {
        setError(err.message || "An error occurred during email verification.");
      }
    };

    verifyEmail();
  }, [location.search]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
    </div>
  );
};

export default EmailVerification;
