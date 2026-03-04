const { contextBridge, ipcRenderer } = require("electron");

// ✅ Debug (so we KNOW preload ran)
console.log("✅ PRELOAD LOADED");

contextBridge.exposeInMainWorld("EDTR", {
  openChrome: (url) => ipcRenderer.invoke("open-chrome", url),
});
