import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { UserProvider } from "./context/UserContext";
import PageNotFound from "./pages/PageNotFound";
import Feed from "./pages/Feed";
import EmailVerification from "./pages/EmailVerification";

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to={"/dashboard"} />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              path="/profile"
              element={<PrivateRoute element={<Profile />} />}
            />
            <Route
              path="/user-feed"
              element={<PrivateRoute element={<Feed />} />}
            />
            <Route path="/auth/verify-email" element={<EmailVerification />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
