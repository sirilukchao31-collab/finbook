// ── pages/Dashboard.js ───────────────────────────────────────────
'use strict';

var BarChart = Recharts.BarChart, Bar = Recharts.Bar;
var PieChart = Recharts.PieChart, Pie = Recharts.Pie, Cell = Recharts.Cell;
var XAxis = Recharts.XAxis, YAxis = Recharts.YAxis;
var Tooltip = Recharts.Tooltip;
var ResponsiveContainer = Recharts.ResponsiveContainer;

function ChartTooltip(props) {
  var active = props.active, payload = props.payload, label = props.label, currency = props.currency;
  if (!active || !payload || !payload.length) return null;
  return createElement('div', {
    style: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 11 }
  },
    createElement('p', { style: { color: 'var(--text2)', marginBottom: 4 } }, label),
    payload.map(function (p, i) {
      return createElement('p', { key: i, style: { color: p.color } }, p.name + ': ' + formatMoney(p.value, currency));
    })
  );
}

function Dashboard(props) {
  var transactions = props.transactions, budgets = props.budgets, currency = props.currency;

  var inc = transactions.filter(function (t) { return t.type === 'income'; }).reduce(function (s, t) { return s + t.amount; }, 0);
  var exp = transactions.filter(function (t) { return t.type === 'expense'; }).reduce(function (s, t) { return s + t.amount; }, 0);
  var bal = inc - exp;

  // 6-month bar chart data
  var now = new Date();
  var monthly = {};
  for (var i = 5; i >= 0; i--) {
    var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    var k = d.getFullYear() + '-' + d.getMonth();
    monthly[k] = { month: MONTHS[d.getMonth()], income: 0, expense: 0 };
  }
  transactions.forEach(function (t) {
    var dt = new Date(t.date);
    var key = dt.getFullYear() + '-' + dt.getMonth();
    if (monthly[key]) { monthly[key][t.type === 'income' ? 'income' : 'expense'] += t.amount; }
  });
  var chartData = Object.values(monthly);

  // Pie chart
  var catMap = calcCatMap(transactions, 'expense');
  var pieData = Object.entries(catMap).map(function (e) { return { name: e[0], value: e[1] }; });

  // Budget alerts
  var alerts = checkBudgetAlerts(budgets, catMap);

  // Recent 5
  var recent = transactions.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); }).slice(0, 5);

  var tooltipStyle = { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 };

  return createElement('div', null,
    createElement('div', { className: 'page-title' }, 'Dashboard'),
    createElement(AlertBanner, { alerts: alerts }),

    // Stats
    createElement('div', { className: 'stats-grid' },
      createElement('div', { className: 'stat-card' },
        createElement('div', { className: 'lbl' }, 'รายรับทั้งหมด'),
        createElement('div', { className: 'val inc' }, formatMoney(inc, currency)),
        createElement('div', { className: 'delta' }, transactions.filter(function (t) { return t.type === 'income'; }).length + ' รายการ')
      ),
      createElement('div', { className: 'stat-card' },
        createElement('div', { className: 'lbl' }, 'รายจ่ายทั้งหมด'),
        createElement('div', { className: 'val exp' }, formatMoney(exp, currency)),
        createElement('div', { className: 'delta' }, transactions.filter(function (t) { return t.type === 'expense'; }).length + ' รายการ')
      ),
      createElement('div', { className: 'stat-card' },
        createElement('div', { className: 'lbl' }, 'ยอดคงเหลือ'),
        createElement('div', { className: 'val bal' }, formatMoney(bal, currency)),
        createElement('div', { className: 'delta', style: { color: bal >= 0 ? '#00c9a7' : '#ff5e7a' } }, bal >= 0 ? 'กำไร' : 'ขาดทุน')
      )
    ),

    // Charts row
    createElement('div', { className: 'chart-row' },
      createElement('div', { className: 'card' },
        createElement('h3', null, 'รายรับ-รายจ่าย 6 เดือนล่าสุด'),
        createElement(ResponsiveContainer, { width: '100%', height: 170 },
          createElement(BarChart, { data: chartData, margin: { top: 5, right: 5, bottom: 0, left: -15 } },
            createElement(XAxis, { dataKey: 'month', tick: { fill: 'var(--text2)', fontSize: 10 }, axisLine: false, tickLine: false }),
            createElement(YAxis, { tick: { fill: 'var(--text2)', fontSize: 10 }, axisLine: false, tickLine: false }),
            createElement(Tooltip, { content: createElement(ChartTooltip, { currency: currency }) }),
            createElement(Bar, { dataKey: 'income', name: 'รายรับ', fill: '#00c9a7', radius: [4, 4, 0, 0] }),
            createElement(Bar, { dataKey: 'expense', name: 'รายจ่าย', fill: '#ff5e7a', radius: [4, 4, 0, 0] })
          )
        )
      ),
      createElement('div', { className: 'card' },
        createElement('h3', null, 'สัดส่วนรายจ่าย'),
        pieData.length > 0
          ? createElement(React.Fragment, null,
              createElement(ResponsiveContainer, { width: '100%', height: 130 },
                createElement(PieChart, null,
                  createElement(Pie, { data: pieData, cx: '50%', cy: '50%', innerRadius: 30, outerRadius: 55, dataKey: 'value' },
                    pieData.map(function (_, i) { return createElement(Cell, { key: i, fill: CHART_COLORS[i % CHART_COLORS.length] }); })
                  ),
                  createElement(Tooltip, { formatter: function (v) { return formatMoney(v, currency); }, contentStyle: tooltipStyle })
                )
              ),
              createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px 8px' } },
                pieData.slice(0, 5).map(function (d, i) {
                  return createElement('span', { key: i, style: { fontSize: 10, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 3 } },
                    createElement('span', { style: { width: 6, height: 6, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], display: 'inline-block' } }),
                    d.name
                  );
                })
              )
            )
          : createElement('div', { className: 'empty' }, 'ยังไม่มีรายจ่าย')
      )
    ),

    // Recent transactions
    createElement('div', { className: 'card' },
      createElement('h3', null, 'รายการล่าสุด'),
      recent.length === 0
        ? createElement('div', { className: 'empty' }, 'ยังไม่มีรายการ เพิ่มรายการแรกได้เลย!')
        : createElement('div', { className: 'tx-list' },
            recent.map(function (t) {
              return createElement('div', { key: t.id, className: 'tx-item' },
                createElement('div', { className: 'tx-dot ' + (t.type === 'income' ? 'inc' : 'exp') }),
                createElement('div', { className: 'tx-info' },
                  createElement('div', { className: 'tx-desc' }, t.description || t.category),
                  createElement('div', { className: 'tx-meta' }, formatDate(t.date) + ' • ' + t.category)
                ),
                createElement('div', { className: 'tx-amount ' + (t.type === 'income' ? 'inc' : 'exp') },
                  (t.type === 'income' ? '+' : '-') + formatMoney(t.amount, currency)
                )
              );
            })
          )
    )
  );
}
