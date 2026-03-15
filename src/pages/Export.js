// ── pages/Export.js ───────────────────────────────────────────────
'use strict';

function ExportPage(props) {
  var transactions = props.transactions, user = props.user, currency = props.currency, showToast = props.showToast;

  function doCSV() {
    var csv = buildCSV(transactions, currency);
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'finbook_' + new Date().toISOString().slice(0, 10) + '.csv');
    showToast('Export CSV สำเร็จ!');
  }

  function doXML() {
    var xml = buildXML(transactions, currency, user.name);
    var blob = new Blob([xml], { type: 'application/xml' });
    downloadBlob(blob, 'finbook_' + new Date().toISOString().slice(0, 10) + '.xml');
    showToast('Export XML สำเร็จ!');
  }

  var inc = transactions.filter(function (t) { return t.type === 'income'; }).reduce(function (s, t) { return s + t.amount; }, 0);
  var exp = transactions.filter(function (t) { return t.type === 'expense'; }).reduce(function (s, t) { return s + t.amount; }, 0);

  return createElement('div', null,
    createElement('div', { className: 'page-title' }, 'Export รายงาน'),

    createElement('div', { className: 'card', style: { marginBottom: '1.25rem' } },
      createElement('h3', null, 'สรุปข้อมูล'),
      createElement('div', { style: { display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' } },
        createElement('div', null, createElement('div', { style: { fontSize: '.75rem', color: 'var(--text2)' } }, 'รายการทั้งหมด'), createElement('div', { style: { fontFamily: "'DM Mono',monospace", fontSize: '1.3rem', color: 'var(--text1)' } }, transactions.length + ' รายการ')),
        createElement('div', null, createElement('div', { style: { fontSize: '.75rem', color: 'var(--text2)' } }, 'รายรับ'), createElement('div', { style: { fontFamily: "'DM Mono',monospace", fontSize: '1.3rem', color: '#00c9a7' } }, formatMoney(inc, currency))),
        createElement('div', null, createElement('div', { style: { fontSize: '.75rem', color: 'var(--text2)' } }, 'รายจ่าย'), createElement('div', { style: { fontFamily: "'DM Mono',monospace", fontSize: '1.3rem', color: '#ff5e7a' } }, formatMoney(exp, currency))),
        createElement('div', null, createElement('div', { style: { fontSize: '.75rem', color: 'var(--text2)' } }, 'สกุลเงิน'), createElement('span', { className: 'curr-badge', style: { marginTop: 6, display: 'inline-flex' } }, currency))
      )
    ),

    createElement('div', { className: 'export-grid' },
      createElement('div', { className: 'export-card' },
        createElement('div', { className: 'ex-icon' }, '📊'),
        createElement('h3', null, 'CSV Format'),
        createElement('p', null, 'เหมาะสำหรับ Excel, Google Sheets รองรับหลายสกุลเงิน'),
        createElement('button', { className: 'export-btn csv', onClick: doCSV }, 'Download .csv')
      ),
      createElement('div', { className: 'export-card' },
        createElement('div', { className: 'ex-icon' }, '📄'),
        createElement('h3', null, 'XML Format'),
        createElement('p', null, 'เหมาะสำหรับ integrate กับระบบอื่น หรือ import ข้อมูลภายหลัง'),
        createElement('button', { className: 'export-btn xml', onClick: doXML }, 'Download .xml')
      )
    ),

    transactions.length === 0 && createElement('div', { className: 'card', style: { textAlign: 'center', padding: '2rem', color: 'var(--text3)' } }, 'ยังไม่มีข้อมูล ลองเพิ่มรายการก่อนนะ!')
  );
}
