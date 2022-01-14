var ffi = require('ffi-napi');
var ref = require('ref-napi');

var voidPtr = ref.refType(ref.types.void);
var stringPtr = ref.refType(ref.types.CString);

//importation de la librairie user32
var user32 = ffi.Library('user32.dll', {
    EnumWindows: ['bool', [voidPtr, 'int32']],
    GetWindowTextA : ['long', ['long', stringPtr, 'long']]
});

//Stockage des résultats de fenêtre Dofus
var succesMatches = [];

/* ------------- CALLBACKS ------------- */

//Définition du callback EnumWindows pour énumérer toutes les fenêtres dofus ouvertes. 
windowProc = ffi.Callback('bool', ['long', 'int32'], function(hwnd, lParam) {
  const regex = /.*- Dofus [0-9].*/gi;

  var buf, name, ret;
  buf = new Buffer.alloc(255);
  ret = user32.GetWindowTextA(hwnd, buf, 255);
  name = ref.readCString(buf, 0);
  if (name.match(regex)){
    succesMatches.push(hwnd);
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

exports.enumDofusWindows = enumDofusWindows;