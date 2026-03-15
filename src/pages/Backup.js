// ── pages/Backup.js ───────────────────────────────────────────────
'use strict';

function BackupPage(props) {
  var transactions = props.transactions, setTransactions = props.setTransactions, showToast = props.showToast;
  var fileRef = useRef(null);

  function doBackup() {
    var json = buildBackupJSON(transactions);
    var blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, 'finbook_backup_' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.json');
    showToast('Backup สำเร็จ! ไฟล์ถูกดาวน์โหลดแล้ว');
  }

  function doClear() {
    if (confirm('ยืนยันการลบข้อมูลทั้งหมด? ไม่สามารถกู้คืนได้')) {
      setTransactions([]);
      showToast('ลบข้อมูลทั้งหมดแล้ว');
    }
  }

  function doRestore(e) {
    var file = e.target.files[0]; if (!file) return;
    var r = new FileReader();
    r.onload = function (ev) {
      try {
        var data = JSON.parse(ev.target.result);
        if (data.transactions && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
          showToast('Restore สำเร็จ! ' + data.transactions.length + ' รายการ');
        } else { showToast('ไฟล์ไม่ถูกต้อง', 'err'); }
      } catch (_) { showToast('อ่านไฟล์ไม่ได้', 'err'); }
    };
    r.readAsText(file); e.target.value = '';
  }

  return createElement('div', null,
    createElement('div', { className: 'page-title' }, 'Backup & Restore'),

    createElement('div', { className: 'backup-card' },
      createElement('h3', null, 'Backup ข้อมูล'),
      createElement('p', null, 'บันทึก ' + transactions.length + ' รายการเป็นไฟล์ JSON สำรองไว้ในเครื่อง'),
      createElement('button', { className: 'bk-btn primary', onClick: doBackup }, '⬇  Download Backup')
    ),

    createElement('div', { className: 'backup-card' },
      createElement('h3', null, 'Restore ข้อมูล'),
      createElement('p', null, 'นำเข้าข้อมูลจากไฟล์ backup ข้อมูลปัจจุบันจะถูกแทนที่ด้วยไฟล์ที่เลือก'),
      createElement('button', { className: 'bk-btn secondary', onClick: function () { fileRef.current.click(); } }, '⬆  เลือกไฟล์ Backup'),
      createElement('input', { type: 'file', accept: '.json', ref: fileRef, style: { display: 'none' }, onChange: doRestore }),
      createElement('div', { className: 'restore-area', onClick: function () { fileRef.current.click(); } },
        createElement('p', null, 'คลิกหรือลากไฟล์ .json มาวางที่นี่')
      )
    ),

    createElement('div', { className: 'backup-card' },
      createElement('h3', { style: { color: '#ff5e7a' } }, 'ล้างข้อมูลทั้งหมด'),
      createElement('p', null, 'ลบข้อมูลรายการทั้งหมดออกจากอุปกรณ์ ไม่สามารถกู้คืนได้ กรุณาทำ backup ก่อน'),
      createElement('button', { className: 'bk-btn danger', onClick: doClear }, '🗑  ลบข้อมูลทั้งหมด')
    )
  );
}
