// index.js
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron');
const path = require('path');
const win32 = require('../../lib/win32');
const { emit } = require('process')

/* ---------------------------------------------- CONSTANTES ----------------------------------------------------- */

const TOPMOST = true;

/* ---------------------------------- CONFIGURATION DE LA FENETRE SWITCHER-------------------------------------------- */

var mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 80,
    titleBarStyle: 'hidden',
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.setAlwaysOnTop(TOPMOST);
  mainWindow.loadFile('app/switcher/index.html');
  //mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
 
}).then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/* -------------------------------- LISTENERS --------------------------------------------- */

// Récupération des fenêtres Dofus ouvertes
ipcMain.on('request-mainprocess-action', (event, arg) => {
  let dofusWindows = win32.enumDofusWindows();
  mainWindow.webContents.send('dofus-windows-found', dofusWindows);
});

// Permet d'envoyer une fenêtre Dofus au plus haut de la pile de fenêtres
ipcMain.on('set-window-to-top', (event, windowId) => {
  win32.selectDofusWindow(windowId);
});