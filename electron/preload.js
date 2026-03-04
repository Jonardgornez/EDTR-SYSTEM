import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("EDTR", {
  openInBrowser: (url) => ipcRenderer.invoke("open-in-browser", url),
});
