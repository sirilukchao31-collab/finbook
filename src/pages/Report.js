// ── pages/Report.js ───────────────────────────────────────────────
'use strict';

var AreaChart = Recharts.AreaChart, Area = Recharts.Area;
var _PieChart = Recharts.PieChart, _Pie = Recharts.Pie, _Cell = Recharts.Cell;
var _XAxis = Recharts.XAxis, _YAxis = Recharts.YAxis, _Tooltip = Recharts.Tooltip;
var _ResponsiveContainer = Recharts.ResponsiveContainer;

function ReportPage(props) {
  var transactions = props.transactions, currency = props.currency;

  var viewState  = useState('monthly');
  var yearState  = useState(new Date().getFullYear());
  var monthState = useState(new Date().getMonth());
  var view = viewState[0], setView = viewState[1];
  var selYear = yearState[0], setSelYear = yearState[1];
  var selMonth = monthState[0], setSelMonth = monthState[1];

  var years = [];
  transactions.forEach(function (t) {
    var y = new Date(t.date).getFullYear();
    if (years.indexOf(y) === -1) years.push(y);
  });
  years.sort(function (a, b) { return b - a; });
  if (years.indexOf(new Date().getFullYear()) === -1) years.unshift(new Date().getFullYear());

  var monthlyData = MONTHS.map(function (m, i) {
    var txs = transactions.filter(function (t) { var d = new Date(t.date); return d.getFullYear() === selYear && d.getMonth() === i; });
    return { month: m, income: txs.filter(function (t) { return t.type === 'income'; }).reduce(function (s, t) { return s + t.amount; }, 0), expense: txs.filter(function (t) { return t.type === 'expense'; }).reduce(function (s, t) { return s + t.amount; }, 0) };
  });

  var daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
  var dailyData = [];
  for (var d = 1; d <= daysInMonth; d++) {
    var day = d;
    var txs = transactions.filter(function (t) { var dt = new Date(t.date); return dt.getFullYear() === selYear && dt.getMonth() === selMonth && dt.getDate() === day; });
    dailyData.push({ day: day, income: txs.filter(function (t) { return t.type === 'income'; }).reduce(function (s, t) { return s + t.amount; }, 0), expense: txs.filter(function (t) { return t.type === 'expense'; }).reduce(function (s, t) { return s + t.amount; }, 0) });
  }

  var catMap = {};
  transactions.filter(function (t) {
    return t.type === 'expense' && new Date(t.date).getFullYear() === selYear &&
      (view === 'monthly' || new Date(t.date).getMonth() === selMonth);
  }).forEach(function (t) { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });

  var pieData = Object.entries(catMap).map(function (e) { return { name: e[0], value: e[1] }; });
  var chartData = view === 'monthly' ? monthlyData : dailyData;
  var totalInc = chartData.reduce(function (s, d) { return s + d.income; }, 0);
  var totalExp = chartData.reduce(function (s, d) { return s + d.expense; }, 0);

  var tooltipStyle = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 };

  function CT(p) {
    if (!p.active || !p.payload || !p.payload.length) return null;
    return createElement('div', { style: tooltipStyle },
      createElement('p', { style: { color: 'var(--text2)', marginBottom: 4 } }, p.label),
      p.payload.map(function (x, i) { return createElement('p', { key: i, style: { color: x.color } }, x.name + ': ' + formatMoney(x.value, currency)); })
    );
  }

  return createElement('div', null,
    createElement('div', { className: 'page-title' }, 'รายงาน'),

    createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' } },
      createElement('div', { style: { display: 'flex', gap: '.4rem' } },
        createElement('button', { className: 'tab' + (view === 'monthly' ? ' active' : ''), onClick: function () { setView('monthly'); } }, 'รายปี'),
        createElement('button', { className: 'tab' + (view === 'daily' ? ' active' : ''), onClick: function () { setView('daily'); } }, 'รายเดือน')
      ),
      createElement('select', { value: selYear, onChange: function (e) { setSelYear(+e.target.value); }, className: 'currency-select' },
        years.map(function (y) { return createElement('option', { key: y, value: y }, y); })
      ),
      view === 'daily' && createElement('select', { value: selMonth, onChange: function (e) { setSelMonth(+e.target.value); }, className: 'currency-select' },
        MONTHS.map(function (m, i) { return createElement('option', { key: i, value: i }, m); })
      )
    ),

    createElement('div', { className: 'stats-grid', style: { marginBottom: '1rem' } },
      createElement('div', { className: 'stat-card' }, createElement('div', { className: 'lbl' }, 'รายรับ'), createElement('div', { className: 'val inc' }, formatMoney(totalInc, currency))),
      createElement('div', { className: 'stat-card' }, createElement('div', { className: 'lbl' }, 'รายจ่าย'), createElement('div', { className: 'val exp' }, formatMoney(totalExp, currency))),
      createElement('div', { className: 'stat-card' }, createElement('div', { className: 'lbl' }, 'ยอดสุทธิ'), createElement('div', { className: 'val ' + (totalInc - totalExp >= 0 ? 'inc' : 'exp') }, formatMoney(totalInc - totalExp, currency)))
    ),

    createElement('div', { className: 'report-grid' },
      createElement('div', { className: 'card' },
        createElement('h3', null, view === 'monthly' ? 'รายรับ-จ่าย รายเดือน' : 'รายรับ-จ่าย รายวัน'),
        createElement(_ResponsiveContainer, { width: '100%', height: 180 },
          createElement(AreaChart, { data: chartData, margin: { top: 5, right: 5, bottom: 0, left: -15 } },
            createElement(_XAxis, { dataKey: view === 'monthly' ? 'month' : 'day', tick: { fill: 'var(--text2)', fontSize: 10 }, axisLine: false, tickLine: false }),
            createElement(_YAxis, { tick: { fill: 'var(--text2)', fontSize: 10 }, axisLine: false, tickLine: false }),
            createElement(_Tooltip, { content: createElement(CT) }),
            createElement(Area, { type: 'monotone', dataKey: 'income', name: 'รายรับ', stroke: '#00c9a7', fill: 'rgba(0,201,167,.15)', strokeWidth: 2 }),
            createElement(Area, { type: 'monotone', dataKey: 'expense', name: 'รายจ่าย', stroke: '#ff5e7a', fill: 'rgba(255,94,122,.15)', strokeWidth: 2 })
          )
        )
      ),
      createElement('div', { className: 'card' },
        createElement('h3', null, 'หมวดหมู่รายจ่าย'),
        pieData.length > 0
          ? createElement(React.Fragment, null,
              createElement(_ResponsiveContainer, { width: '100%', height: 180 },
                createElement(_PieChart, null,
                  createElement(_Pie, { data: pieData, cx: '50%', cy: '50%', outerRadius: 70, dataKey: 'value' },
                    pieData.map(function (_, i) { return createElement(_Cell, { key: i, fill: CHART_COLORS[i % CHART_COLORS.length] }); })
                  ),
                  createElement(_Tooltip, { formatter: function (v) { return formatMoney(v, currency); }, contentStyle: tooltipStyle })
                )
              ),
              createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px 8px', marginTop: 6 } },
                Object.keys(catMap).slice(0, 6).map(function (c, i) {
                  return createElement('span', { key: i, style: { fontSize: 10, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 3 } },
                    createElement('span', { style: { width: 6, height: 6, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], display: 'inline-block' } }), c
                  );
                })
              )
            )
          : createElement('div', { className: 'empty' }, 'ไม่มีรายจ่าย')
      )
    ),

    createElement('div', { className: 'card' },
      createElement('h3', null, 'สรุปตามหมวดหมู่'),
      Object.entries(catMap).length === 0
        ? createElement('div', { className: 'empty' }, 'ไม่มีข้อมูล')
        : createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '.4rem' } },
            Object.entries(catMap).sort(function (a, b) { return b[1] - a[1]; }).map(function (entry, i) {
              return createElement('div', { key: entry[0], style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '.5rem', background: 'var(--bg3)', borderRadius: 8 } },
                createElement('span', { style: { width: 8, height: 8, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 } }),
                createElement('span', { style: { flex: 1, fontSize: '.83rem', color: 'var(--text1)' } }, entry[0]),
                createElement('span', { style: { fontFamily: "'DM Mono',monospace", fontSize: '.82rem', color: '#ff5e7a' } }, formatMoney(entry[1], currency))
              );
            })
          )
    )
  );
}
