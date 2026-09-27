# CogNote 

A lightweight desktop notepad with built-in AI to take notes and quickly explain concepts on the fly.

> ⚠️ **Status:** In active development (WIP). Releases/installers will be available soon.

---

### Key Features
- **Local-First Note Taking:** Instant, offline-capable note management with persistent storage.
- **AI-Powered Concept Explanations:** Integrated Google Gemini assistant to clarify technical terms and summarize content directly within your workflow.
- **File & Storage Management:** Fast local file operations and organized note lists.
- **Customizable Environment:** Built-in settings modal to configure API keys and preferences securely.

### Tech Stack
- **Desktop Runtime:** Tauri (Rust)
- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS
- **AI Integration:** Google Gemini API

---

### Roadmap (Upcoming)
- [ ] Pre-built Windows desktop installer (`.exe`)
- [ ] Keyboard shortcuts for quick capture
- [ ] Custom prompt presets for different summary styles
- [ ] Export notes to Markdown/PDF

---

### Getting Started (Local Development)

#### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/) and platform build tools for Tauri

#### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/Xetalth/CogNote.git](https://github.com/Xetalth/CogNote.git)
   cd CogNote