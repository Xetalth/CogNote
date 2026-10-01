import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: "400px", textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "36px", marginBottom: "8px" }}>🧠</div>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: 700, color: "var(--text-main)" }}>
          CogNote
        </h2>
        <span
          style={{
            fontSize: "11px",
            backgroundColor: "var(--bg-main)",
            border: "1px solid var(--border-subtle)",
            padding: "2px 8px",
            borderRadius: "12px",
            color: "var(--primary-accent)",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          v1.0.0
        </span>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            margin: "16px 0",
            lineHeight: 1.5,
          }}
        >
          Yapay zeka desteğiyle notlarınızı organize eden ve çalışma akışınızı hızlandıran kişisel çalışma asistanı.
        </p>

        <div
          style={{
            backgroundColor: "var(--bg-main)",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "12px",
            color: "var(--text-muted)",
            textAlign: "left",
            marginBottom: "20px",
            lineHeight: 1.7,
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div><strong style={{ color: "var(--text-main)" }}>Mimari:</strong> Local-First + LLM Agent</div>
          <div><strong style={{ color: "var(--text-main)" }}>AI Motoru:</strong> Google Gemini API</div>
          <div><strong style={{ color: "var(--text-main)" }}>Model:</strong> Human-in-the-Loop (HITL)</div>
        </div>

        <button
          onClick={onClose}
          className="calendar-btn"
          style={{ width: "100%", padding: "9px 16px", fontSize: "13px" }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};