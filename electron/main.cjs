const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const open = require("open");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // ✅ important (prevents bridge issues in some setups)
    },
  });

  win.loadURL("http://localhost:5173");
  // win.webContents.openDevTools(); // optional
}

app.whenReady().then(createWindow);

// Try open Chrome, fallback to default browser
ipcMain.handle("open-chrome", async (event, url) => {
  try {
    await open(url, { app: { name: open.apps.chrome } });
  } catch {
    await shell.openExternal(url);
  }
});
