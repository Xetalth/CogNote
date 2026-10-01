import React, { useState, useEffect } from "react";
import { getApiKey, setApiKey } from "../services/aiService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [keyInput, setKeyInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: "460px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h4 style={{ margin: 0, color: "var(--text-main)", fontSize: "14px" }}>⚙️ Ayarlar</h4>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer", padding: "2px" }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "var(--text-main)", fontSize: "12px", marginBottom: "8px", fontWeight: 500 }}>
            Google Gemini API Anahtarı
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 12px",
              background: "var(--bg-main)",
              border: "1px solid var(--border-card)",
              borderRadius: "6px",
              color: "var(--text-main)",
              fontSize: "13px",
              outline: "none"
            }}
          />
          <span style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "6px", display: "block" }}>
            Anahtarınız yalnızca tarayıcı/uygulama yerel hafızasında saklanır.
          </span>
        </div>

        <div className="modal-actions" style={{ alignItems: "center" }}>
          {savedSuccess && <span style={{ color: "var(--success-accent)", fontSize: "12px", marginRight: "auto" }}>Kaydedildi! ✓</span>}
          <button className="btn-cancel" onClick={onClose}>
            İptal
          </button>
          <button
            onClick={handleSave}
            className="calendar-btn"
            style={{ padding: "6px 14px", fontSize: "12px" }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};