var ffi = require('ffi-napi');
var ref = require('ref-napi');

var voidPtr = ref.refType(ref.types.void);
var stringPtr = ref.refType(ref.types.CString);

//importation de la librairie user32
var user32 = ffi.Library('user32.dll', {
  'EnumWindows': ['bool', [voidPtr, 'int32']],
  'GetTopWindow': ['long', ['long']],
  'FindWindowA': ['long', ['string', 'string']],
  'SetActiveWindow': ['long', ['long']],
  'SetForegroundWindow': ['bool', ['long']],
  'BringWindowToTop': ['bool', ['long']],
  'ShowWindow': ['bool', ['long', 'int']],
  'SwitchToThisWindow': ['void', ['long', 'bool']],
  'GetForegroundWindow': ['long', []],
  'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
  'GetWindowThreadProcessId': ['int', ['long', 'int']],
  'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
  'SetFocus': ['long', ['long']],
  'GetWindowTextA': ['long', ['long', stringPtr, 'long']],
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
  //On utilise plusieures fonctions user32 afin d'être sûr que dans 100% des cas la fenêtre soit en haut de la pile
  var foregroundHWnd = user32.GetForegroundWindow()
  var currentThreadId = kernel32.GetCurrentThreadId()
  var windowThreadProcessId = user32.GetWindowThreadProcessId(foregroundHWnd, null)

  user32.ShowWindow(winToSetOnTop, 9)
  user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3)
  user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3)
  user32.SetForegroundWindow(winToSetOnTop)
  user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0)
  user32.SetFocus(winToSetOnTop)

  user32.SetActiveWindow(winToSetOnTop);
}

exports.enumDofusWindows = enumDofusWindows;
exports.selectDofusWindow = selectDofusWindow;