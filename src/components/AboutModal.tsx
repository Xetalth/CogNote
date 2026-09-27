import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#1e1e2e",
          border: "1px solid #313244",
          borderRadius: "12px",
          padding: "24px",
          color: "#cdd6f4",
          boxSizing: "border-box",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "36px", marginBottom: "8px" }}>🧠</div>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: 700, color: "#cdd6f4" }}>
          CogNote
        </h2>
        <span
          style={{
            fontSize: "11px",
            backgroundColor: "#313244",
            padding: "2px 8px",
            borderRadius: "12px",
            color: "#89b4fa",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          v1.0.0
        </span>

        <p
          style={{
            fontSize: "13px",
            color: "#a6adc8",
            margin: "16px 0",
            lineHeight: 1.5,
          }}
        >
          Yapay zeka desteğiyle bilmediğiniz dağınık ve karmaşık bilgileri özet bilgilere dönüştüren kişisel çalışma asistanı.
        </p>

        <div
          style={{
            backgroundColor: "#181825",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "12.5px",
            color: "#bac2de",
            textAlign: "left",
            marginBottom: "20px",
            lineHeight: 1.7,
            border: "1px solid #313244",
          }}
        >
          <div><strong style={{ color: "#cdd6f4" }}>Mimari:</strong> Local-First + LLM Agent</div>
          <div><strong style={{ color: "#cdd6f4" }}>AI Motoru:</strong> Google Gemini API</div>
          <div><strong style={{ color: "#cdd6f4" }}>Model:</strong> Human-in-the-Loop (HITL)</div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "9px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#89b4fa",
            color: "#11111b",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};