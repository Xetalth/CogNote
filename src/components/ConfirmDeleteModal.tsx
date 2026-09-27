import React, { useState } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputText.trim().toUpperCase() === "ONAYLA") {
      onConfirm();
      setInputText("");
      onClose();
    }
  };

  const handleClose = () => {
    setInputText("");
    onClose();
  };

  const isMatched = inputText.trim().toUpperCase() === "ONAYLA";

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
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1e1e2e",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          color: "#cdd6f4",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#f38ba8" }}>
            Tüm Notları Sil
          </h3>
        </div>

        <p style={{ fontSize: "13.5px", color: "#a6adc8", lineHeight: "1.5", margin: "0 0 16px 0" }}>
          Bu işlem geri alınamaz. Kayıtlı tüm notlarınız kalıcı olarak silinecektir. Devam etmek için kutuya{" "}
          <strong style={{ color: "#f38ba8" }}>ONAYLA</strong> yazın.
        </p>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ONAYLA"
          autoFocus
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: `1px solid ${isMatched ? "#a6e3a1" : "#45475a"}`,
            backgroundColor: "#181825",
            color: "#cdd6f4",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "1px",
            textAlign: "center",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "20px",
            transition: "border-color 0.2s",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isMatched) {
              handleConfirm();
            }
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #45475a",
              backgroundColor: "transparent",
              color: "#cdd6f4",
              fontSize: "13px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#313244")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            İptal
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isMatched}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: isMatched ? "#f38ba8" : "rgba(243, 139, 168, 0.25)",
              color: isMatched ? "#11111b" : "#6c7086",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isMatched ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            Evet, Hepsini Sil
          </button>
        </div>
      </div>
    </div>
  );
};