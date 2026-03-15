// ── components/AlertBanner.js ─────────────────────────────────────
'use strict';

function AlertBanner(props) {
  var alerts = props.alerts;
  if (!alerts || alerts.length === 0) return null;
  return createElement('div', { style: { marginBottom: '1rem' } },
    alerts.map(function (a, i) {
      return createElement('div', { key: i, className: 'alert-banner' },
        createElement('span', { className: 'ab-icon' }, '⚠'),
        createElement('div', { className: 'ab-msg' }, a)
      );
    })
  );
}
