import { useState, useEffect, useRef } from "react";
import { Note, NoteType } from "../types/note";
import { loadNotesFromDisk, saveNotesToDisk } from "../services/storage";
import { getQuickSummary } from "../services/aiService";
import { processNoteWithAgent } from "../services/aiService";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const isLoadedRef = useRef(false);

  // Uygulama açılışında diskteki dosyayı oku
  useEffect(() => {
    loadNotesFromDisk().then((saved) => {
      setNotes(saved);
      isLoadedRef.current = true;
    });
  }, []);

  // Notlar güncellendikçe diske kaydet
  useEffect(() => {
    if (isLoadedRef.current) {
      saveNotesToDisk(notes);
    }
  }, [notes]);

  const addNote = (type: NoteType) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      type,
      text: "",
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => {
      const cleanedNotes = prev.filter((n) => n.text.trim().length > 0);
      return [newNote, ...cleanedNotes];
    });
  };

  const updateNoteText = (id: string, newText: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: newText } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const askAI = async (id: string, text: string) => {
    if (!text.trim()) return;

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isAiLoading: true } : n))
    );

    const answer = await getQuickSummary(text);

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {...n, aiResponse: answer, isAiLoading: false}
          : n
      )
    );
  };

  const setAllNotes = (newNotes: Note[]) => { 
    setNotes(newNotes);
  };

  const handleCalendarAgent = async (id: string, text: string) => {
  if (!text.trim()) return;

  // Kartı yükleniyor durumuna al
  setNotes((prev) =>
    prev.map((n) => (n.id === id ? { ...n, isAiLoading: true } : n))
  );

  // Gemini Agent notu analiz eder ve tool çağrısı yapıp yapmayacağına karar verir
  const result = await processNoteWithAgent(text);

  if (result.type === "action") {
    // 1. .ics dosyasını üretip Windows Takvim'e fırlat

    // 2. Karta başarılı durumunu ve ayıklanan detayları yaz
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isAiLoading: false,
              eventDate: result.args.startDate,
              eventTitle: result.args.title,
              aiResponse: ` Takvime Aktarıldı:\n**${result.args.title}**\n Başlangıç: ${result.args.startDate}`,
            }
          : n
      )
    );
  } else {
    // Tarih/saat tespit edilemediğinde metin yanıtını göster
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, isAiLoading: false, aiResponse: result.text }
          : n
      )
    );
  }
};

  return {
    notes,
    addNote,
    updateNoteText,
    deleteNote,
    askAI,
    setAllNotes,
    handleCalendarAgent,
  };
}