import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiMessageCircle, FiRefreshCcw } from "react-icons/fi";
import { sendrequest } from "../service/operations";

export default function ChatRequestButton({ person, label = "Chat", className = "" }) {
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const personId = person?._id || person?.id;

  if (!personId || String(personId) === String(currentUser?._id || currentUser?.id)) return null;

  async function requestChat() {
    if (!token) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (loading || requested) return;
    setLoading(true);
    const result = await sendrequest(personId, token);
    if (result) {
      setRequested(true);
      toast.success("Chat request sent. You can chat after they accept it.");
    }
    setLoading(false);
  }

  return (
    <button type="button" onClick={requestChat} disabled={loading || requested} className={`btn-primary btn-sm ${className}`} title={requested ? "Chat request sent" : `Send a chat request to ${person?.Name || "this member"}`}>
      {loading ? <FiRefreshCcw className="animate-spin" aria-hidden="true" /> : <FiMessageCircle aria-hidden="true" />}
      {requested ? "Request sent" : label}
    </button>
  );
}
