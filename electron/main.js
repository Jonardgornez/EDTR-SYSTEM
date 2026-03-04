import { app, BrowserWindow, ipcMain } from "electron";
import open from "open";

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: new URL("./preload.js", import.meta.url), // we will add this
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);

// open user's Chrome (default browser) at a url
ipcMain.handle("open-in-browser", async (event, url) => {
  await open(url);
});
