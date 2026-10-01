import React, { useState } from "react";
import { ThemeConfig, PRESET_THEMES, applyTheme } from "../services/themeService";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem("cognote_theme");
    return saved ? JSON.parse(saved) : PRESET_THEMES.defaultDark;
  });

  if (!isOpen) return null;

  const handleSelectPreset = (preset: ThemeConfig) => {
    setCustomTheme(preset);
    applyTheme(preset);
  };

  const handleColorChange = (key: keyof ThemeConfig, val: string) => {
    const updated = { ...customTheme, [key]: val, name: "Özel Tema" };
    setCustomTheme(updated);
    applyTheme(updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog theme-dialog">
        <h4>Tema Ayarları</h4>
        
        {/* Hazır Palet Seçimi */}
        <div style={{ marginTop: "12px" }}>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
            HAZIR TEMALAR
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginTop: "8px" }}>
            {Object.entries(PRESET_THEMES).map(([key, item]) => (
              <button
                key={key}
                className="btn-cancel"
                style={{
                  fontSize: "12px",
                  borderColor: customTheme.name === item.name ? "var(--primary-accent)" : undefined,
                  background: customTheme.name === item.name ? "rgba(56, 189, 248, 0.1)" : undefined
                }}
                onClick={() => handleSelectPreset(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="dropdown-divider" style={{ margin: "16px 0" }} />

        {/* Özel Renk Seçiciler */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "10px" }}>
            ÖZEL RENK SEÇİMİ
          </label>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <span>Ana Arka Plan:</span>
              <input 
                type="color" 
                value={customTheme.bgMain}
                onChange={(e) => handleColorChange("bgMain", e.target.value)} 
                style={{ cursor: "pointer", border: "none", background: "none", width: "32px", height: "32px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <span>Panel / Sütun Arka Planı:</span>
              <input 
                type="color" 
                value={customTheme.bgSidebar}
                onChange={(e) => handleColorChange("bgSidebar", e.target.value)} 
                style={{ cursor: "pointer", border: "none", background: "none", width: "32px", height: "32px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <span>Kart Rengi:</span>
              <input 
                type="color" 
                value={customTheme.bgCard}
                onChange={(e) => handleColorChange("bgCard", e.target.value)} 
                style={{ cursor: "pointer", border: "none", background: "none", width: "32px", height: "32px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <span>Vurgu Rengi:</span>
              <input 
                type="color" 
                value={customTheme.primaryAccent}
                onChange={(e) => handleColorChange("primaryAccent", e.target.value)} 
                style={{ cursor: "pointer", border: "none", background: "none", width: "32px", height: "32px" }}
              />
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: "20px" }}>
          <button className="btn-cancel" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};