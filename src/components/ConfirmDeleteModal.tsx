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
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: "420px", borderColor: "rgba(239, 68, 68, 0.4)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--danger-accent)" }}>
            Tüm Notları Sil
          </h3>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5", margin: "0 0 16px 0" }}>
          Bu işlem geri alınamaz. Kayıtlı tüm notlarınız kalıcı olarak silinecektir. Devam etmek için kutuya{" "}
          <strong style={{ color: "var(--danger-accent)" }}>ONAYLA</strong> yazın.
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
            borderRadius: "6px",
            border: `1px solid ${isMatched ? "var(--success-accent)" : "var(--border-card)"}`,
            backgroundColor: "var(--bg-main)",
            color: "var(--text-main)",
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

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleClose}>
            İptal
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isMatched}
            className="btn-danger"
            style={{
              opacity: isMatched ? 1 : 0.4,
              cursor: isMatched ? "pointer" : "not-allowed",
            }}
          >
            Evet, Hepsini Sil
          </button>
        </div>
      </div>
    </div>
  );
};