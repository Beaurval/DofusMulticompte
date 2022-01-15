const { ipcRenderer } = require('electron');

function character_button_clicked(button,windowId){
    ipcRenderer.send('set-window-to-top', windowId);
    var buttons = document.getElementsByClassName('character-button');
    for(var i = 0; i < buttons.length; i++){
        buttons[i].parentNode.setAttribute('class','character');
    }

    var container = button.parentNode;
    container.setAttribute('class','character character-selected');
}


// Send information to the main process
// if a listener has been set, then the main process
// will react to the request !
ipcRenderer.send('request-mainprocess-action');

ipcRenderer.on('dofus-windows-found', (event, dofusWindowsList) => {
    //Création des bouttons personnages
    const characterList = document.getElementById('characters-container');

    for (var i = 0; i < dofusWindowsList.length; i++) {
        var character = document.createElement('div');
        character.setAttribute('class', 'character');

        var button = document.createElement('button');
        button.setAttribute('class', 'character-button');
        button.setAttribute('type', 'button');
        button.setAttribute('data-window-id', dofusWindowsList[i].hwnd);
        button.setAttribute('data-window-title', dofusWindowsList[i].title);

        var img = document.createElement('img');
        img.setAttribute('draggable', 'false');
        img.setAttribute('src', '../ressources/Feca-min.png');

        button.appendChild(img);
        character.appendChild(button);

        characterList.appendChild(character);
    }

    /* ------------------- Bind Click ------------------------ */
    let buttons = document.getElementsByClassName('character-button');
    for (var i = 0; i < buttons.length; i++) {
        let windowId = buttons[i].getAttribute('data-window-id');
        buttons[i].addEventListener('click', (event) => {
            character_button_clicked(event.target.closest('.character-button'),windowId);
        });
    }
});


