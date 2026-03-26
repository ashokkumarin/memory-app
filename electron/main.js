const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    autoHideMenuBar: true,   // 👈 hides menu
  });

  win.loadURL("http://localhost:5173");

  // Optional: completely remove menu
  win.setMenu(null);  
}

app.whenReady().then(createWindow);