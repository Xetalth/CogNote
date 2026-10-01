export interface ThemeConfig {
  name: string;
  bgMain: string;
  bgSidebar: string;
  bgCard: string;
  primaryAccent: string; 
}

export const PRESET_THEMES: Record<string, ThemeConfig> = {
  defaultDark: {
    name: "Varsayılan",
    bgMain: "#0f172a",
    bgSidebar: "#1e293b",
    bgCard: "#334155",
    primaryAccent: "#38bdf8",
  },
  oledBlack: {
    name: "OLED Siyah",
    bgMain: "#000000",
    bgSidebar: "#0a0a0a",
    bgCard: "#171717",
    primaryAccent: "#22c55e",
  },
  dracula: {
    name: "Dracula",
    bgMain: "#1e1e2e",
    bgSidebar: "#252538",
    bgCard: "#313244",
    primaryAccent: "#cba6f7",
  },
  nordic: {
    name: "Nord Buz Mavisi",
    bgMain: "#2e3440",
    bgSidebar: "#3b4252",
    bgCard: "#434c5e",
    primaryAccent: "#88c0d0",
  },
};

export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;
  root.style.setProperty("--bg-main", theme.bgMain);
  root.style.setProperty("--bg-sidebar", theme.bgSidebar);
  root.style.setProperty("--bg-column", theme.bgSidebar);
  root.style.setProperty("--bg-card", theme.bgCard);
  root.style.setProperty("--primary-accent", theme.primaryAccent);

  localStorage.setItem("cognote_theme", JSON.stringify(theme));
};