/**
             * The code can be included in some JS file and included
             * via require or <script> in the renderer process
             */

 const { ipcRenderer } = require('electron');

 // Some data that will be sent to the main process
 let Data = {
     message: "Hi",
     someData: "Let's go"
 };

 // Send information to the main process
 // if a listener has been set, then the main process
 // will react to the request !
 ipcRenderer.send('request-mainprocess-action', Data);