import { useState, useRef, useEffect } from "react";
import { useNotes } from "./hooks/useNotes";
import "./App.css";
import { exitApp, exportNotes, importNotes } from "./services/fileService";
import { copyAllNotes, sortNotesByDate, resetAiAnswers} from "./services/editService";
import ReactMarkdown from "react-markdown";
import { openInWeb } from "./services/aiService";
import { SettingsModal } from "./components/SettingsModal";
import { ConfirmDeleteModal } from "./components/ConfirmDeleteModal";
import { AboutModal } from "./components/AboutModal";
import { ThemeModal } from "./components/ThemeModal";
import { applyTheme } from "./services/themeService";

export default function App() {
  const { notes, addNote, updateNoteText, deleteNote, askAI, setAllNotes, handleCalendarAgent } = useNotes();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const firstDayIndex = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;
  const menuRef = useRef<HTMLDivElement>(null);
  const textNotes = notes.filter((n) => n.type === "text");
  const questionNotes = notes.filter((n) => n.type === "question");
  const reminderNotes = notes.filter((n) => n.type === "reminder");
  const upcomingReminders = reminderNotes.filter((note) => {
    const rawDate = (note as any).eventDate || note.text?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
    if (!rawDate) return false;
    const targetDate = new Date(rawDate);
    if (isNaN(targetDate.getTime())) return false;
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const sevenDaysLater = new Date(startOfToday);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    return targetDay >= startOfToday && targetDay <= sevenDaysLater;
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const handleDeleteRequest = (id: string, text: string) => {
    if (!text.trim()) {
      deleteNote(id);
    } else {
      setDeleteTargetId(id);
    }
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteNote(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("cognote_theme");
    if (savedTheme) {
      try {
        applyTheme(JSON.parse(savedTheme));
      } catch (e) {
        console.error("Tema yüklenemedi", e);
      }
    }
  }, []);

  return (
    <div className="app-container">
      <header className="titlebar">
        <div className="titlebar-left">
          <span className="app-brand">CogNote</span>
          <nav className="menu-group" ref={menuRef}>
            <div className="menu-item-wrapper">
              <button 
                className={`menu-btn ${activeMenu === "file" ? "active" : ""}`}
                onClick={() => setActiveMenu(activeMenu === "file" ? null : "file")}
              >
                Dosya
              </button>
              {activeMenu === "file" && (
                <div className="dropdown-menu">
                  <div 
                    className="dropdown-item"
                    onClick={async () => {
                      setActiveMenu(null);
                      const success = await exportNotes(notes);
                      if (success) {
                        alert("Notlar başarıyla dışa aktarıldı!");
                      }
                    }}
                  >
                    Notları Dışa Aktar (.json)
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={async () => {
                      setActiveMenu(null);
                      const loadedNotes = await importNotes();
                      if (loadedNotes) {
                        setAllNotes(loadedNotes);
                        alert("Yedek başarıyla yüklendi!");
                      }
                    }}
                  >
                    Yedekten İçe Aktar
                  </div>
                  <div className="dropdown-divider" />
                  <div
                    className="dropdown-item text-danger"
                    onClick={() => {
                      setActiveMenu(null);
                      exitApp();
                    }}
                  >
                    Çıkış
                  </div>
                </div>
              )}
            </div>
            <div className="menu-item-wrapper">
              <button 
                className={`menu-btn ${activeMenu === "edit" ? "active" : ""}`}
                onClick={() => setActiveMenu(activeMenu === "edit" ? null : "edit")}
              >
                Düzenle
              </button>
              {activeMenu === "edit" && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={async () => {
                      setActiveMenu(null);
                      const ok = await copyAllNotes(notes);
                      if (ok) alert("Tüm notlar panoya kopyalandı!");
                    }}
                  >
                    Tüm Notları Panoya Kopyala
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setActiveMenu(null);
                      const nextOrder = sortOrder === "desc" ? "asc" : "desc";
                      const sorted = sortNotesByDate(notes, nextOrder);
                      setSortOrder(nextOrder);
                      setAllNotes(sorted);
                    }}
                  >
                    Tarihe Göre Sırala (Yeni/Eski)
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setActiveMenu(null);
                      const cleaned = resetAiAnswers(notes);
                      setAllNotes(cleaned);
                    }}
                  >
                    Yapay Zeka Yanıtlarını Sıfırla
                  </div>
                  <div className="dropdown-divider" />
                  <div
                    className="dropdown-item text-danger"
                    onClick={() => {
                      setActiveMenu(null);
                      if (notes.length > 0) {
                        setIsDeleteModalOpen(true);
                      }
                    }}
                  >
                    Tüm Notları Temizle
                  </div>
                </div>
              )}
            </div>
            <div className="menu-item-wrapper">
              <button 
                className={`menu-btn ${activeMenu === "settings" ? "active" : ""}`}
                onClick={() => setActiveMenu(activeMenu === "settings" ? null : "settings")}
              >
                Ayarlar
              </button>
              {activeMenu === "settings" && (
                <div className="dropdown-menu">
                  <div 
                    className="dropdown-item"
                    onClick={() => {
                      setIsThemeOpen(true);
                      setActiveMenu(null);
                    }}
                  >
                    Tema Ayarları
                  </div>
                  <div 
                    className="dropdown-item"
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setActiveMenu(null);
                    }}
                  >
                    Gemini API Anahtarı
                  </div>
                  <div className="dropdown-divider" />
                  <div 
                    className="dropdown-item"
                    onClick={() => {
                      setIsAboutOpen(true);
                      setActiveMenu(null);
                    }}
                  >
                    Hakkında
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="titlebar-right">
          <span className="badge">CogNote v0.1</span>
        </div>
      </header>

      <div className="main-workspace">
        <aside className="sidebar">
          <div className="sidebar-group-title">YENİ KART</div>
          <button className="sidebar-btn btn-text" onClick={() => addNote("text")}>
            <span className="icon">📝</span>
            <span className="label">Normal Not</span>
          </button>
          <button className="sidebar-btn btn-question" onClick={() => addNote("question")}>
            <span className="icon">💡</span>
            <span className="label">Soru Notu</span>
          </button>
          <button className="sidebar-btn btn-reminder" onClick={() => addNote("reminder")}>
            <span className="icon">⏰</span>
            <span className="label">Hatırlatma</span>
          </button>
        </aside>
        <main className="board-columns">
          <div className="column col-text">
            <div className="column-header">
              <span className="col-title">Normal Notlar</span>
              <span className="count-pill">{textNotes.length}</span>
            </div>
            <div className="column-content">
              {textNotes.map((note) => (
                <div key={note.id} className="card">
                  <button
                    className="card-delete-btn"
                    onClick={() => handleDeleteRequest(note.id, note.text)}
                  >
                    ×
                  </button>
                  <textarea
                    className="card-textarea"
                    autoFocus={note.text === ""}
                    placeholder="Notunuzu yazın..."
                    value={note.text}
                    onChange={(e) => updateNoteText(note.id, e.target.value)}
                    onBlur={() => !note.text.trim() && deleteNote(note.id)}
                  />
                  <div className="card-timestamp">
                    {formatDate(note.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="column col-question">
            <div className="column-header">
              <span className="col-title">Soru / İnceleme</span>
              <span className="count-pill">{questionNotes.length}</span>
            </div>
            <div className="column-content">
              {questionNotes.map((note) => (
                <div key={note.id} className="card card-ai">
                  <button
                    className="card-delete-btn"
                    onClick={() => handleDeleteRequest(note.id, note.text)}
                  >
                    ×
                  </button>
                  <textarea
                    autoFocus={note.text === ""}
                    placeholder="Merak ettiğiniz kavramı veya soruyu yazın..."
                    value={note.text}
                    onChange={(e) => updateNoteText(note.id, e.target.value)}
                    onBlur={() => !note.text.trim() && deleteNote(note.id)}
                  />
                  <div className="card-footer">
                    <button
                      className="ai-action-btn"
                      disabled={note.isAiLoading}
                      onClick={() => askAI(note.id, note.text)}
                    >
                      {note.isAiLoading ? "Analiz Ediliyor..." : "✦ Gemini İle Çözümle"}
                    </button>
                    {note.aiResponse && (
                      <div className="ai-response-box">
                        <ReactMarkdown>{note.aiResponse}</ReactMarkdown>
                        <div style={{ textAlign: "right", marginTop: "6px" }}>
                          <a 
                            href="#more"
                            onClick={(e) => {
                              e.preventDefault();
                              openInWeb(note.text);
                            }}
                          >
                            Daha fazlası...
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card-timestamp">
                    {formatDate(note.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="column col-reminder">
            <div className="column-header">
              <span className="col-title">Hatırlatıcılar</span>
              <span className="count-pill">{reminderNotes.length}</span>
            </div>
            <div className="column-content">
              {reminderNotes.map((note) => (
                <div key={note.id} className="card">
                  <button
                    className="card-delete-btn"
                    onClick={() => handleDeleteRequest(note.id, note.text)}
                  >
                    ×
                  </button>
                  <textarea
                    autoFocus={note.text === ""}
                    placeholder="Hatırlatma notu..."
                    value={note.text}
                    onChange={(e) => updateNoteText(note.id, e.target.value)}
                    onBlur={() => !note.text.trim() && deleteNote(note.id)}
                  />
                  <div className="card-footer">
                    <button
                      className="btn-agent-calendar"
                      disabled={note.isAiLoading}
                      onClick={() => handleCalendarAgent(note.id, note.text)}
                    >
                      {note.isAiLoading ? "⏳ Analiz Ediliyor..." : "✦ Takvime Aktar (Agent)"}
                    </button>
                    {note.aiResponse && (
                      <div className="ai-response-box">
                        <ReactMarkdown>{note.aiResponse}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <div className="card-timestamp">
                    {formatDate(note.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <div className="calendar-panel">
          <div className="calendar-header">
            <button 
              className="calendar-btn"
              onClick={() => setIsCalendarOpen((prev) => !prev)}
            >
              📅 {isCalendarOpen ? "Takvimi Kapat" : "Takvim"}
            </button>
          </div>

          <div className="calendar-content-wrapper">
            <div className={`calendar-body ${isCalendarOpen ? "open" : "closed"}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)" }}>
                  {monthNames[calMonth]} {calYear}
                </h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="cal-today-btn"
                    onClick={() => setCalendarDate(new Date())}
                    title="Bugüne Git"
                  >
                    Bugün
                  </button>
                  <button 
                    className="cal-nav-btn" 
                    onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}
                  >
                    ‹
                  </button>
                  <button 
                    className="cal-nav-btn" 
                    onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}
                  >
                    ›
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 500, marginBottom: "8px" }}>
                {daysOfWeek.map((day) => (
                  <div key={day} style={{ padding: "4px 0" }}>{day}</div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginTop: "12px" }}>
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="cal-empty-cell" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday = isCurrentMonth && today.getDate() === day;
                  const currentCellDate = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isSelected = selectedDate === currentCellDate;

                  const hasEvents = reminderNotes.some((n) =>
                    (n.text && n.text.includes(currentCellDate)) ||
                    ((n as any).eventDate && (n as any).eventDate.startsWith(currentCellDate))
                  );

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDate(currentCellDate)}
                      className={`cal-day-cell ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                    >
                      <span>{day}</span>
                      {hasEvents && <div className="cal-event-dot" />}
                    </div>
                  );
                })}
              </div>

              <div className="cal-selected-details">
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                  {selectedDate ? `Seçili Tarih: ${selectedDate}` : "Detay görmek için bir gün seçin"}
                </div>

                {selectedDate && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {reminderNotes
                      .filter((n) => (n.text && n.text.includes(selectedDate)) || ((n as any).eventDate && (n as any).eventDate.startsWith(selectedDate)))
                      .map((n) => (
                        <div key={n.id} className="cal-detail-item">
                          {n.text}
                        </div>
                      ))}
                    
                    {reminderNotes.filter((n) => (n.text && n.text.includes(selectedDate)) || ((n as any).eventDate && (n as any).eventDate.startsWith(selectedDate))).length === 0 && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Bu tarihte kayıtlı hatırlatıcı yok.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={`calendar-collapsed-placeholder ${!isCalendarOpen ? "open" : "closed"}`}>
              <div className="collapsed-header-title"></div>
              {upcomingReminders.length > 0 ? (
                <div className="collapsed-reminder-list">
                  {upcomingReminders.map((note) => (
                    <div key={note.id} className="collapsed-reminder-item">
                      <span className="collapsed-bullet">•</span>
                      <span className="collapsed-text">
                        {note.text.trim() ? note.text : "İsimsiz Hatırlatma"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="collapsed-empty-text">
                  Yaklaşan hatırlatıcı bulunmamaktadır.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {deleteTargetId && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h4>Notu Sil</h4>
            <p>Bu not kalıcı olarak silinecektir. Devam etmek istiyor musunuz?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteTargetId(null)}>
                Vazgeç
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setAllNotes([]);
        }}
      />
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
      <ThemeModal 
        isOpen={isThemeOpen} 
        onClose={() => setIsThemeOpen(false)} 
      />
    </div>
  );
}