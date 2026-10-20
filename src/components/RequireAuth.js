import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function RequireAuth({ children }) {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const notified = useRef(false);

  useEffect(() => {
    if (!token && !notified.current) {
      notified.current = true;
      toast.error("Please log in first.");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
