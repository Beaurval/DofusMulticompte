var ffi = require('ffi-napi');
var ref = require('ref-napi');

var voidPtr = ref.refType(ref.types.void);
var stringPtr = ref.refType(ref.types.CString);

//importation de la librairie user32
var user32 = ffi.Library('user32.dll', {
  'EnumWindows': ['bool', [voidPtr, 'int32']],
  'ShowWindow': ['bool', ['long', 'int']],

  'GetWindowTextA': ['long', ['long', stringPtr, 'long']],
  'IsIconic': ['bool', ['long']],
  'SetForegroundWindow': ['bool',['long']]
});

var kernel32 = new ffi.Library('Kernel32.dll', {
  'GetCurrentThreadId': ['int', []]
});

//Stockage des résultats de fenêtre Dofus
var succesMatches = [];

/* ------------- CALLBACKS ------------- */

//Définition du callback EnumWindows pour énumérer toutes les fenêtres dofus ouvertes. 
windowProc = ffi.Callback('bool', ['long', 'int32'], function (hwnd, lParam) {
  const regex = /.*- Dofus [0-9].*/gi;

  var buf, name, ret;
  buf = new Buffer.alloc(255);
  ret = user32.GetWindowTextA(hwnd, buf, 255);
  name = ref.readCString(buf, 0);
  if (name.match(regex)) {
    var title = name.replace(/ - Dofus [0-9].*/gi, '');
    succesMatches.push({title,hwnd});
  }
  return true;
});


/* ------------- FONCTIONS ------------- */
function enumDofusWindows() {
  //On vide le talbeau de résultat
  succesMatches = [];
  //On cherche toutes les fenêtres Dofus ouvertes et on les stockes dans succesMatches
  let success = user32.EnumWindows(windowProc, 1);

  return succesMatches;
}

//Place la fenêtre souhaitée (selon l'id de fenêtre renseigné) au plus haut de la pile
function selectDofusWindow(winToSetOnTop) {
  if(user32.IsIconic(winToSetOnTop))
  {
    user32.ShowWindow(winToSetOnTop,3);
  }
  var truc = user32.SetForegroundWindow(winToSetOnTop);
}

exports.enumDofusWindows = enumDofusWindows;
exports.selectDofusWindow = selectDofusWindow;