// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcRenderer } = require('electron');
const path = require('path');
const win32 = require('./win32');

var mainWindow
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
  // et charger l'index.html de l'application.
  mainWindow.loadFile('./app/index.html')

  mainWindow.webContents.openDevTools({ mode: 'detach' })
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


// In some file from the main process
// like main.js
const { ipcMain } = require('electron');
const { emit } = require('process')

// Attach listener in the main process with the given ID
ipcMain.on('request-mainprocess-action', (event, arg) => {
  let dofusWindows = win32.enumDofusWindows();

  mainWindow.webContents.send('dofus-windows-found', dofusWindows);
});

ipcMain.on('set-window-to-top', (event, windowId) => {
  win32.selectDofusWindow(windowId);
});