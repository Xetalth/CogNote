import React, { useState, useEffect } from "react";
import { getApiKey, setApiKey } from "../services/aiService"; // Eğer dosya src/components içindeyse "../services/aiService" yap

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
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "12px",
        padding: "24px",
        width: "90%",
        maxWidth: "460px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.2rem" }}>⚙️ Ayarlar</h3>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.875rem", marginBottom: "8px", fontWeight: 500 }}>
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
              padding: "10px 12px",
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "0.9rem",
              outline: "none"
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "6px", display: "block" }}>
            Anahtarınız yalnızca tarayıcı/uygulama yerel hafızasında saklanır.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
          {savedSuccess && <span style={{ color: "#10b981", fontSize: "0.85rem" }}>Kaydedildi! ✓</span>}
          <button
            onClick={onClose}
            style={{
              padding: "8px 14px",
              background: "#334155",
              color: "#cbd5e1",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 16px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};