import { Note } from "../types/note";

export async function copyAllNotes(notes:Note[]): Promise<boolean> {
  if (notes.length === 0) return false;

  const categoryTitles = {
    text: "---Notlar---",
    question: "---Sorular---",
    reminder: "---Hatırlatıcılar",
  };

  let formattedText = "";

  (["text", "question", "reminder"] as const).forEach((type) => {
    const group = notes.filter((n) => n.type === type && n.text.trim() !== "");
    if (group.length > 0) {
      formattedText += `${categoryTitles[type]}\n`;
      group.forEach((item, i) => {
        formattedText += `${i+1}. ${item.text}\n`;
        if (item.aiResponse) {
          formattedText += ` Cevap: ${item.aiResponse}\n`;
        }
      });
      formattedText += "\n";
    }
  });
  try {
    await navigator.clipboard.writeText(formattedText.trim());
    return true;
  } catch (error) {
    console.error("Panoya kopyalama hatası;", error);
    return false;
  }
}

export function sortNotesByDate(notes: Note[], order: "asc" | "desc"): Note[] {
  return [...notes].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return order === "desc" ? timeB - timeA : timeA - timeB;
  });
}

export function resetAiAnswers(notes: Note[]): Note[] {
  return notes.map((note) => {
    if (note.type === "question") {
      const { aiResponse, isAiLoading, ...rest } = note;
      return rest;
    }
    return note;
  });
}