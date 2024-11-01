import config from "../config.json";
import axios from "axios";
// write services for auth signin and sign up
const signInService = async (email, password, totp) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}/api/v1/auth/sign-in`,
      {
        email,
        password,
        totp,
      },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    console.log(err);
    const explanation = err?.response?.data?.error?.explanation;
    console.log(explanation);
    throw new Error(explanation || "Failed to sign in. Please try again.");
  }
};

const signUpService = async (email, password, username) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}/api/v1/auth/sign-up`,
      {
        email,
        password,
        username,
      },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to sign up. Please try again.");
  }
};

const logoutService = async () => {
  try {
    const response = await axios.post(
      `${config.baseUrl}/api/v1/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to sign out. Please try again.");
  }
};

const verifyEmailService = async (verificationToken) => {
  try {
    const response = await axios.get(
      `${config.baseUrl}/api/v1/auth/verify-email`,
      {
        params: { token: verificationToken },
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (err) {
    throw new Error("Failed to verify email. Please try again.");
  }
};

export default {
  signInService,
  signUpService,
  verifyEmailService,
  logoutService,
};
