import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Note } from "../types/note";

export async function exportNotes(notes: Note[]): Promise <boolean> {
  try {
    const filePath = await save({
      title:"Notları Yedekle",
      defaultPath: "thinknote-yedek.json",
      filters: [{name: "JSON Dosyası", extensions: ["json"]}],
    });
    if (!filePath) return false;

    const data = JSON.stringify(notes, null, 2);
    await writeTextFile(filePath, data);
    return true;
  } catch (error){
    console.error("Dışa aktarım hatası", error);
    return false;
  }
}

export async function importNotes(): Promise<Note[] | null> {
  try {
    const selectedPath = await open({
      title: "Yedek Dosyası Seç",
      multiple: false, 
      filters: [{name: "JSON Dosyası", extensions:["json"]}],
    });
    if(!selectedPath || typeof selectedPath !== "string") return null;

    const content = await readTextFile(selectedPath);
    const parsedData = JSON.parse(content);

    if (Array.isArray(parsedData)) {
      return parsedData as Note [];
    }
    return null;
  } catch (error) {
    console.error("İçe aktarma hatası", error);
    return null;
  }
}
  
export async function exitApp(): Promise<void> {
  const window = getCurrentWindow();
  await window.close();
}