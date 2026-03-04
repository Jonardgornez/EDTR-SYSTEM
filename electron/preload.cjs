const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ PRELOAD LOADED");

contextBridge.exposeInMainWorld("EDTR", {
  printInChrome: (html) => ipcRenderer.invoke("print-in-chrome", html),
});
