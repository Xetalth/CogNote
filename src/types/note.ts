export type NoteType = "text" | "question" | "reminder";

export interface Note {
  id: string;
  type: NoteType;
  text: string;
  createdAt: string;
  aiResponse?: string;
  isAiLoading?: boolean;
  eventDate?: string;
  eventTitle?: string;
}