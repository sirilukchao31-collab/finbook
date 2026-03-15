// ── components/Toast.js ───────────────────────────────────────────
'use strict';

function Toast(props) {
  var msg = props.msg, type = props.type, onDone = props.onDone;
  useEffect(function () {
    var t = setTimeout(onDone, 3000);
    return function () { clearTimeout(t); };
  }, []);
  var cls = 'toast' + (type === 'err' ? ' err' : type === 'warn' ? ' warn' : '');
  return createElement('div', { className: cls }, msg);
}
