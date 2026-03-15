// ── utils.js ───────────────────────────────────────────────────────
'use strict';

function formatMoney(amount, currency) {
  currency = currency || 'THB';
  var info = CURRENCIES[currency] || CURRENCIES.THB;
  var converted = amount * info.rate;
  var digits = currency === 'THB' ? 0 : 2;
  var formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(converted);
  return info.sym + formatted;
}

function formatDate(dateStr) {
  var dt = new Date(dateStr);
  return dt.getDate() + ' ' + MONTHS[dt.getMonth()] + ' ' + dt.getFullYear();
}

function genId() {
  return Date.now() + '_' + Math.random().toString(36).slice(2);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function downloadBlob(blob, filename) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function buildCSV(transactions, currency) {
  var rate = CURRENCIES[currency].rate;
  var header = 'id,type,amount_thb,amount_' + currency + ',category,description,date\n';
  var rows = transactions.map(function (t) {
    return [
      t.id, t.type, t.amount,
      (t.amount * rate).toFixed(2),
      '"' + t.category + '"',
      '"' + (t.description || '') + '"',
      t.date,
    ].join(',');
  }).join('\n');
  return '\uFEFF' + header + rows;
}

function buildXML(transactions, currency, userName) {
  var rate = CURRENCIES[currency].rate;
  var items = transactions.map(function (t) {
    return [
      '  <transaction>',
      '    <id>' + t.id + '</id>',
      '    <type>' + t.type + '</type>',
      '    <amount_thb>' + t.amount + '</amount_thb>',
      '    <amount_' + currency + '>' + (t.amount * rate).toFixed(2) + '</amount_' + currency + '>',
      '    <category>' + t.category + '</category>',
      '    <description>' + (t.description || '') + '</description>',
      '    <date>' + t.date + '</date>',
      '  </transaction>',
    ].join('\n');
  }).join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<transactions user="' + userName + '" currency="' + currency + '" exported="' + new Date().toISOString() + '">\n' +
    items + '\n</transactions>';
}

function buildBackupJSON(transactions) {
  return JSON.stringify({ version: APP_VERSION, exported: new Date().toISOString(), transactions: transactions }, null, 2);
}

function calcCatMap(transactions, filterType) {
  var map = {};
  transactions.forEach(function (t) {
    if (!filterType || t.type === filterType) {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });
  return map;
}

function checkBudgetAlerts(budgets, catMap) {
  var alerts = [];
  Object.entries(budgets).forEach(function (entry) {
    var cat = entry[0], limit = entry[1];
    var spent = catMap[cat] || 0;
    if (limit > 0 && spent >= limit) {
      alerts.push('หมวด "' + cat + '" ใช้จ่ายเกิน budget แล้ว!');
    } else if (limit > 0 && spent / limit >= 0.8) {
      alerts.push('หมวด "' + cat + '" ใกล้ถึง budget แล้ว (' + Math.round(spent / limit * 100) + '%)');
    }
  });
  return alerts;
}
