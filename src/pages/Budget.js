// ── pages/Budget.js ───────────────────────────────────────────────
'use strict';

function BudgetPage(props) {
  var transactions = props.transactions, budgets = props.budgets, setBudgets = props.setBudgets;
  var currency = props.currency, showToast = props.showToast;

  var selState = useState(''), amtState = useState('');
  var sel = selState[0], setSel = selState[1];
  var amt = amtState[0], setAmt = amtState[1];

  var catMap = calcCatMap(transactions, 'expense');

  function handleSet() {
    if (!sel) { showToast('เลือกหมวดหมู่', 'err'); return; }
    if (!amt || isNaN(+amt) || +amt <= 0) { showToast('ระบุ budget', 'err'); return; }
    setBudgets(function (p) { var n = Object.assign({}, p); n[sel] = +amt; return n; });
    showToast('ตั้ง budget "' + sel + '" สำเร็จ');
    setSel(''); setAmt('');
  }

  function handleDel(cat) {
    setBudgets(function (p) { var n = Object.assign({}, p); delete n[cat]; return n; });
    showToast('ลบ budget "' + cat + '" แล้ว');
  }

  return createElement('div', null,
    createElement('div', { className: 'page-title' }, 'ตั้งงบประมาณ (Budget)'),

    createElement('div', { className: 'add-form' },
      createElement('div', { className: 'form-title' }, 'เพิ่ม / แก้ไข Budget'),
      createElement('div', { className: 'form-row' },
        createElement('div', { className: 'field' },
          createElement('label', null, 'หมวดหมู่รายจ่าย'),
          createElement('select', { value: sel, onChange: function (e) { setSel(e.target.value); } },
            createElement('option', { value: '' }, 'เลือก...'),
            CATS_EXP.map(function (c) { return createElement('option', { key: c, value: c }, c); })
          )
        ),
        createElement('div', { className: 'field' },
          createElement('label', null, 'งบประมาณ (฿ THB / เดือน)'),
          createElement('input', { type: 'number', placeholder: '0', value: amt, onChange: function (e) { setAmt(e.target.value); } })
        )
      ),
      createElement('button', { className: 'submit-btn', onClick: handleSet }, 'บันทึก Budget')
    ),

    Object.keys(budgets).length > 0
      ? createElement('div', { className: 'card' },
          createElement('h3', null, 'Budget ที่ตั้งไว้'),
          createElement('div', { className: 'budget-grid', style: { marginTop: '.5rem' } },
            Object.entries(budgets).map(function (entry) {
              var cat = entry[0], limit = entry[1];
              var spent = catMap[cat] || 0;
              var pct = Math.min(spent / limit * 100, 100);
              var over = spent > limit, near = !over && pct >= 80;
              var color = over ? '#ff5e7a' : near ? '#f0b429' : '#00c9a7';
              return createElement('div', { key: cat, className: 'bgt-item' },
                createElement('div', { className: 'bgt-label' },
                  createElement('span', null, cat),
                  createElement('button', { onClick: function () { handleDel(cat); }, style: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 12 } }, '✕')
                ),
                createElement('div', { className: 'bgt-bar-wrap' },
                  createElement('div', { className: 'bgt-bar', style: { width: pct + '%', background: color } })
                ),
                createElement('div', { className: 'bgt-nums' },
                  createElement('span', { style: { color: color } }, formatMoney(spent, currency) + ' / ' + formatMoney(limit, currency)),
                  createElement('span', { style: { color: color } }, Math.round(pct) + '%')
                )
              );
            })
          )
        )
      : createElement('div', { className: 'card' }, createElement('div', { className: 'empty' }, 'ยังไม่มี budget ลองตั้งดูนะ!'))
  );
}
