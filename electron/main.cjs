const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { exec } = require("child_process");

console.log("✅ ELECTRON MAIN LOADED");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // ✅ DEV vs BUILD
  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    // loads the built React app after `vite build`
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("print-in-chrome", async (event, html) => {
    const filePath = path.join(os.tmpdir(), `dtr-print-${Date.now()}.html`);
    fs.writeFileSync(filePath, html, "utf-8");

    console.log("Opening Chrome with:", filePath);

    // ✅ Try common Chrome locations
    const chromePaths = [
      "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
      "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    ];

    const chromeExe = chromePaths.find((p) => fs.existsSync(p));

    if (chromeExe) {
      exec(`"${chromeExe}" "${filePath}"`);
    } else {
      // fallback: open with default browser if Chrome not found
      exec(`start "" "${filePath}"`);
    }

    return { ok: true };
  });

  console.log("✅ IPC handler registered: print-in-chrome");
});
