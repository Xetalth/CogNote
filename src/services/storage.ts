import { BaseDirectory, readTextFile, writeTextFile, exists, mkdir } from "@tauri-apps/plugin-fs";
import { Note } from "../types/note";

const FILE_NAME = "thinknote_data.json";

// Notları dosyadan oku
export async function loadNotesFromDisk(): Promise<Note[]> {
  try {
    const fileExists = await exists(FILE_NAME, { baseDir: BaseDirectory.AppData });
    if (!fileExists) {
      console.log("Dosya henüz oluşturulmamış, temiz liste ile başlanıyor.");
      return [];
    }
    const content = await readTextFile(FILE_NAME, { baseDir: BaseDirectory.AppData });
    console.log("Notlar diskten başarıyla okundu!");
    return JSON.parse(content);
  } catch (error) {
    console.error("Notlar diskten okunamadı:", error);
    return [];
  }
}

// Notları dosyaya yaz
export async function saveNotesToDisk(notes: Note[]): Promise<void> {
  try {
    // 1. AppData klasörünün var olduğundan emin ol, yoksa oluştur
    const dirExists = await exists("", { baseDir: BaseDirectory.AppData });
    if (!dirExists) {
      await mkdir("", { baseDir: BaseDirectory.AppData, recursive: true });
    }

    // 2. Dosyayı kaydet
    const data = JSON.stringify(notes, null, 2);
    await writeTextFile(FILE_NAME, data, { baseDir: BaseDirectory.AppData });
    console.log("Notlar diske başarıyla kaydedildi! Toplam not:", notes.length);
  } catch (error) {
    console.error("Notlar diske kaydedilirken hata:", error);
  }
}