import React from "react";
import { FiMessageSquare } from "react-icons/fi";

export default function EmptyState({ title = "Nothing here yet", description = "Check back soon for new activity.", actionLabel, onAction }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state-icon"><FiMessageSquare aria-hidden="true" /></span>
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {actionLabel && onAction && <button type="button" className="btn-secondary btn-sm mt-4" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
