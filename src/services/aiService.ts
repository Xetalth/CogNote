import { GoogleGenAI } from "@google/genai";
import { openUrl } from "@tauri-apps/plugin-opener";

export function getApiKey(): string {
  return localStorage.getItem("thinknote_gemini_api_key") || "";
}
export function setApiKey(key: string): void {
  localStorage.setItem("thinknote_gemini_api_key", key.trim());
}
function getAiClient(): GoogleGenAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Lütfen Ayarlar menüsünden Gemini API anahtarınızı girin.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function getQuickSummary(prompText: string): Promise<string> {
  if (!prompText.trim()) return "Lütfen bir soru veya metin girin.";

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompText,
      config: {
        systemInstruction:
          "Sen CogNote için çalışan bir asistansın. Kullanıcının sorusuna veya notuna yönelik en fazla 2-3 kısa madde ya da 2 cümlelik net, hap bir özet üret. Asla lafı uzatma."
      },
    });

    return response.text || "Özet çıkarılamadı.";
  } catch (error) {
    console.error("Gemini API hatası:", error);
    return "API bağlantısında bir hata oluştu. Anahtarınızı kontrol edin."
  }
}

export async function openInWeb(  question: string): Promise<void> {
  try{
    await navigator.clipboard.writeText(question);
    await openUrl("https://gemini.google.com");
  } catch (error){  
    console.error("Tarayıcı açılırken hata oluştu:",error);
    
  }
}

const calendarTool = {
  functionDeclarations: [
    {
      name: "create_calendar_event",
      description:"Kullanıcının notundan bir takvim etkinliği veya hatırlatıcı oluşturmak için parametreleri ayıklar.",
      parameters: {
        type: "OBJECT",
        properties: {
          title: {
            type: "STRING",
            description: "Etkinliğin veya hatırlatıcının kısa başlığı/özeti.",
          },
          startDate: {
            type: "STRING",
            description:"Etkinliğin başlangıç zamanı (Örnek: 2026-09-21T14:00:00). Eğer saat belirtilmemişse mantıklı bir varsayılan saat ata.",
          },
          description: {
            type: "STRING",
            description: "Notun orijinal içeriği veya ek açıklamalar.",
          },
        },
        required: ["title", "startDate"],
      },
    },
  ],
};

export interface CalendarEventParams {
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type AgentResponse =
  | { type: "action"; functionName: "create_calendar_event"; args: CalendarEventParams }
  | { type: "text"; text: string };

export async function processNoteWithAgent(noteText:string): Promise<AgentResponse> {
  if (!noteText.trim()) {
    return { type: "text", text: "İşlenecek bir not bulunamadı." };
  }

  const currentDate = new Date().toISOString();

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: noteText,
      config: {
        systemInstruction: `Sen bir AI Agent'sın. Bugünün tarihi ve saati: ${currentDate}.
Kullanıcının yazdığı notta bir randevu, toplantı, teslim tarihi veya hatırlatma niyeti sezersen kesinlikle 'create_calendar_event' aracını çağır.
Eğer metinde hiçbir zaman, gün veya eylem planı yoksa kullanıcıya hatırlatıcı oluşturulamadığını belirten kısa bir açıklama yap.`,
        tools: [calendarTool as any],
      },
    });

    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "create_calendar_event") {
        return {
          type: "action",
          functionName: "create_calendar_event",
          args: call.args as unknown as  CalendarEventParams,
        };
      }
    }

    return {
      type: "text",
      text: response.text || "Not analiz edildi fakat bir takvim etkinliği tespit edilemedi.",
    };
  } catch (error){
    console.error("Agent Tool Calling Hatası:", error);
    return {
      type: "text",
      text: "Not analiz edilirken bir hata oluştu.",
    };
  }
}
