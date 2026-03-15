// ── pages/Settings.js ────────────────────────────────────────────
'use strict';

function SettingsPage(props) {
  var currency = props.currency, setCurrency = props.setCurrency;
  var isDark = props.isDark, toggleTheme = props.toggleTheme;
  var budgetAlert = props.budgetAlert, setBudgetAlert = props.setBudgetAlert;
  var autoBackup = props.autoBackup, setAutoBackup = props.setAutoBackup;

  function row(label, sub, control) {
    return createElement('div', { className: 'setting-row' },
      createElement('div', null,
        createElement('div', { className: 'setting-label' }, label),
        sub && createElement('div', { className: 'setting-sub' }, sub)
      ),
      control
    );
  }

  function toggle(checked, onChange) {
    return createElement('label', { className: 'toggle' },
      createElement('input', { type: 'checkbox', checked: checked, onChange: onChange }),
      createElement('span', { className: 'toggle-slider' })
    );
  }

  return createElement('div', null,
    createElement('div', { className: 'page-title' }, 'ตั้งค่า'),

    createElement('div', { className: 'settings-section' },
      createElement('h3', null, 'การแสดงผล'),
      row('โหมดสี (Dark / Light)', isDark ? 'Dark mode เปิดอยู่' : 'Light mode เปิดอยู่',
        toggle(isDark, toggleTheme)
      ),
      row('สกุลเงินที่แสดง', 'ข้อมูลเก็บเป็น THB แปลงค่าเพื่อแสดงผลเท่านั้น',
        createElement('select', { value: currency, onChange: function (e) { setCurrency(e.target.value); }, className: 'currency-select' },
          Object.entries(CURRENCIES).map(function (e) { return createElement('option', { key: e[0], value: e[0] }, e[1].name); })
        )
      )
    ),

    createElement('div', { className: 'settings-section' },
      createElement('h3', null, 'การแจ้งเตือน'),
      row('แจ้งเตือนเมื่อใกล้เกิน Budget', 'แจ้งเตือนเมื่อใช้เกิน 80% ของ budget ที่ตั้งไว้',
        toggle(budgetAlert, function (e) { setBudgetAlert(e.target.checked); })
      ),
      row('Auto Backup เมื่อ Logout', 'ดาวน์โหลด backup อัตโนมัติก่อนออกจากระบบ',
        toggle(autoBackup, function (e) { setAutoBackup(e.target.checked); })
      )
    ),

    createElement('div', { className: 'settings-section' },
      createElement('h3', null, 'อัตราแลกเปลี่ยน (ประมาณการ)'),
      createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.5rem', marginTop: '.5rem' } },
        Object.entries(CURRENCIES).map(function (entry) {
          return createElement('div', { key: entry[0], style: { background: 'var(--bg3)', borderRadius: 8, padding: '.6rem .8rem' } },
            createElement('div', { className: 'curr-badge', style: { marginBottom: 4 } }, entry[0]),
            createElement('div', { style: { fontSize: '.82rem', color: 'var(--text2)', fontFamily: "'DM Mono',monospace" } }, '1 ฿ = ' + entry[1].sym + entry[1].rate)
          );
        })
      )
    ),

    createElement('div', { className: 'settings-section' },
      createElement('h3', null, 'เกี่ยวกับแอป'),
      createElement('div', { style: { fontSize: '.85rem', color: 'var(--text2)', lineHeight: 1.8 } },
        createElement('p', null, 'FinanceBook v' + APP_VERSION),
        createElement('p', null, 'ข้อมูลทั้งหมดเก็บไว้ใน localStorage บนเบราว์เซอร์ของคุณ'),
        createElement('p', null, 'ไม่มีการส่งข้อมูลไปยัง server ภายนอก')
      )
    )
  );
}
