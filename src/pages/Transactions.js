// ── pages/Transactions.js ─────────────────────────────────────────
'use strict';

function Transactions(props) {
  var transactions = props.transactions, setTransactions = props.setTransactions;
  var budgets = props.budgets, currency = props.currency, showToast = props.showToast;

  var typeState  = useState('expense');
  var amtState   = useState('');
  var descState  = useState('');
  var catState   = useState('');
  var dateState  = useState(todayStr());
  var filterState = useState('all');
  var searchState = useState('');
  var editState  = useState(null);

  var type = typeState[0], setType = typeState[1];
  var amount = amtState[0], setAmount = amtState[1];
  var desc = descState[0], setDesc = descState[1];
  var cat = catState[0], setCat = catState[1];
  var date = dateState[0], setDate = dateState[1];
  var filter = filterState[0], setFilter = filterState[1];
  var search = searchState[0], setSearch = searchState[1];
  var editId = editState[0], setEditId = editState[1];

  var cats = type === 'income' ? CATS_INC : CATS_EXP;

  function resetForm() {
    setAmount(''); setDesc(''); setCat(''); setDate(todayStr()); setEditId(null);
  }

  function handleSave() {
    if (!amount || isNaN(+amount) || +amount <= 0) { showToast('กรุณาระบุจำนวนเงินที่ถูกต้อง', 'err'); return; }
    if (!cat) { showToast('กรุณาเลือกหมวดหมู่', 'err'); return; }
    var tx = { id: editId || genId(), type: type, amount: +amount, description: desc, category: cat, date: date };
    var newList = editId ? transactions.map(function (t) { return t.id === editId ? tx : t; }) : [tx].concat(transactions);

    // budget warning
    if (type === 'expense' && budgets[cat] > 0) {
      var spent = newList.filter(function (t) { return t.type === 'expense' && t.category === cat; }).reduce(function (s, t) { return s + t.amount; }, 0);
      if (spent > budgets[cat]) showToast('⚠ หมวด "' + cat + '" เกิน budget แล้ว!', 'warn');
      else if (spent / budgets[cat] >= 0.8) showToast('หมวด "' + cat + '" ใช้ไปแล้ว ' + Math.round(spent / budgets[cat] * 100) + '%', 'warn');
    }
    setTransactions(newList);
    showToast(editId ? 'แก้ไขรายการสำเร็จ' : 'บันทึกรายการสำเร็จ');
    resetForm();
  }

  function handleEdit(t) {
    setType(t.type); setAmount(String(t.amount)); setDesc(t.description); setCat(t.category); setDate(t.date); setEditId(t.id);
  }
  function handleDelete(id) { setTransactions(transactions.filter(function (t) { return t.id !== id; })); showToast('ลบรายการแล้ว'); }

  var filtered = transactions.filter(function (t) {
    return (filter === 'all' || t.type === filter) &&
      (!search || (t.description || '').toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
  }).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

  return createElement('div', null,
    createElement('div', { className: 'page-title' }, 'บันทึกรายการ'),

    // Form
    createElement('div', { className: 'add-form' },
      createElement('div', { className: 'form-title' }, editId ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'),
      createElement('div', { className: 'type-toggle' },
        createElement('button', { className: 'type-btn' + (type === 'income' ? ' active inc' : ''), onClick: function () { setType('income'); setCat(''); } }, '+ รายรับ'),
        createElement('button', { className: 'type-btn' + (type === 'expense' ? ' active exp' : ''), onClick: function () { setType('expense'); setCat(''); } }, '- รายจ่าย')
      ),
      createElement('div', { className: 'form-row' },
        createElement('div', { className: 'field' },
          createElement('label', null, 'จำนวนเงิน (฿ THB)'),
          createElement('input', { type: 'number', placeholder: '0.00', value: amount, onChange: function (e) { setAmount(e.target.value); } })
        ),
        createElement('div', { className: 'field' },
          createElement('label', null, 'หมวดหมู่'),
          createElement('select', { value: cat, onChange: function (e) { setCat(e.target.value); } },
            createElement('option', { value: '' }, 'เลือกหมวดหมู่'),
            cats.map(function (c) { return createElement('option', { key: c, value: c }, c); })
          )
        )
      ),
      createElement('div', { className: 'form-row' },
        createElement('div', { className: 'field' },
          createElement('label', null, 'รายละเอียด'),
          createElement('input', { type: 'text', placeholder: 'อธิบายรายการ...', value: desc, onChange: function (e) { setDesc(e.target.value); } })
        ),
        createElement('div', { className: 'field' },
          createElement('label', null, 'วันที่'),
          createElement('input', { type: 'date', value: date, onChange: function (e) { setDate(e.target.value); } })
        )
      ),
      createElement('div', { style: { display: 'flex', gap: '.6rem' } },
        createElement('button', { className: 'submit-btn', onClick: handleSave, style: { flex: 1 } }, editId ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'),
        editId && createElement('button', {
          onClick: resetForm,
          style: { flex: '0 0 auto', padding: '.7rem 1rem', background: 'var(--bg3)', color: 'var(--text1)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }
        }, 'ยกเลิก')
      )
    ),

    // Filter
    createElement('div', { className: 'filter-row' },
      createElement('input', { type: 'text', placeholder: 'ค้นหา...', value: search, onChange: function (e) { setSearch(e.target.value); }, style: { flex: 1 } }),
      createElement('select', { value: filter, onChange: function (e) { setFilter(e.target.value); } },
        createElement('option', { value: 'all' }, 'ทั้งหมด'),
        createElement('option', { value: 'income' }, 'รายรับ'),
        createElement('option', { value: 'expense' }, 'รายจ่าย')
      )
    ),

    // List
    createElement('div', { className: 'card' },
      createElement('h3', null, 'รายการทั้งหมด (' + filtered.length + ')'),
      createElement('div', { className: 'scrollarea' },
        filtered.length === 0
          ? createElement('div', { className: 'empty' }, 'ไม่พบรายการ')
          : createElement('div', { className: 'tx-list', style: { marginTop: '.5rem' } },
              filtered.map(function (t) {
                return createElement('div', { key: t.id, className: 'tx-item' },
                  createElement('div', { className: 'tx-dot ' + (t.type === 'income' ? 'inc' : 'exp') }),
                  createElement('div', { className: 'tx-info' },
                    createElement('div', { className: 'tx-desc' }, t.description || t.category),
                    createElement('div', { className: 'tx-meta' }, formatDate(t.date) + ' • ',
                      createElement('span', { className: 'badge ' + (t.type === 'income' ? 'inc' : 'exp') }, t.category)
                    )
                  ),
                  createElement('div', { className: 'tx-amount ' + (t.type === 'income' ? 'inc' : 'exp') },
                    (t.type === 'income' ? '+' : '-') + formatMoney(t.amount, currency)
                  ),
                  createElement('div', { className: 'tx-actions' },
                    createElement('button', { className: 'abn', onClick: function () { handleEdit(t); } }, 'แก้ไข'),
                    createElement('button', { className: 'abn del', onClick: function () { handleDelete(t.id); } }, 'ลบ')
                  )
                );
              })
            )
      )
    )
  );
}
