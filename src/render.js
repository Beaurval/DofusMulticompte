 const { ipcRenderer } = require('electron');

 // Send information to the main process
 // if a listener has been set, then the main process
 // will react to the request !
 ipcRenderer.send('request-mainprocess-action');

 ipcRenderer.on('dofus-windows-found', (event,args) => {
    console.log(args)
 });