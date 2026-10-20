const statusMessages = {
  400: "The request was invalid. Check the information and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don’t have permission to do that.",
  404: "The requested item could not be found.",
  409: "This action conflicts with existing data. Refresh and try again.",
  413: "The uploaded file is too large. Choose a smaller file.",
  422: "Some information is missing or invalid. Review the form and try again.",
  429: "There have been too many attempts. Wait a moment and try again.",
};

function readServerMessage(data) {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";

  const message = data.message || data.error || data.errors;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    return message.map((item) => (typeof item === "string" ? item : item?.message)).filter(Boolean).join(" ");
  }
  if (message && typeof message === "object") {
    return Object.values(message).filter((item) => typeof item === "string").join(" ");
  }
  return "";
}

export function getErrorMessage(error, fallback) {
  const status = error?.response?.status;
  const serverMessage = readServerMessage(error?.response?.data);
  const technicalMessage = error?.message || "";
  const genericTechnicalMessage = /^request failed with status code \d+$/i.test(technicalMessage);

  if (/jwt verification failed|token expired|invalid token|authentication failed/i.test(serverMessage || technicalMessage)) {
    return "Your session has expired. Please sign in again.";
  }
  if (serverMessage.trim()) return serverMessage.trim();
  if (status && statusMessages[status]) return statusMessages[status];
  if (error?.code === "ECONNABORTED" || /timeout/i.test(technicalMessage)) {
    return "The request timed out. Check your connection and try again.";
  }
  if (!error?.response && (error?.request || error?.code === "ERR_NETWORK")) {
    return "Could not reach the server. Check your internet connection and try again.";
  }
  if (status >= 500) return "The server encountered an error. Please try again shortly.";
  if (technicalMessage && !genericTechnicalMessage) {
    return technicalMessage;
  }
  return fallback;
}
