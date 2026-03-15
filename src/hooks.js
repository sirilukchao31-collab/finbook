// ── hooks.js ───────────────────────────────────────────────────────
'use strict';

var useState  = React.useState;
var useEffect = React.useEffect;
var useRef    = React.useRef;
var useCallback = React.useCallback;
var useMemo   = React.useMemo;
var createElement = React.createElement;

/**
 * useState synced to localStorage.
 * @param {string} key
 * @param {*} init
 */
function useLocalStorage(key, init) {
  var pair = useState(function () {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : init;
    } catch (_) { return init; }
  });
  var val = pair[0];
  var setVal = pair[1];

  var set = useCallback(function (newVal) {
    var v = typeof newVal === 'function' ? newVal(val) : newVal;
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (_) {}
  }, [key, val]);

  return [val, set];
}
