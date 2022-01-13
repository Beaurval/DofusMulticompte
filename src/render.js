function test(){
    document.getElementsByTagName('button')[0].remove();
}

/* Gestion des événements */
document.getElementById('toto').addEventListener('click',test);