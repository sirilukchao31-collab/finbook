// ── App.js ────────────────────────────────────────────────────────
'use strict';

function App() {
  var userState    = useLocalStorage('finbook_user', null);
  var txState      = useLocalStorage('finbook_tx', []);
  var budgetState  = useLocalStorage('finbook_budgets', {});
  var currState    = useLocalStorage('finbook_currency', 'THB');
  var darkState    = useLocalStorage('finbook_dark', true);
  var alertState   = useLocalStorage('finbook_budget_alert', true);
  var autoState    = useLocalStorage('finbook_auto_backup', true);

  var user = userState[0], setUser = userState[1];
  var transactions = txState[0], setTransactions = txState[1];
  var budgets = budgetState[0], setBudgets = budgetState[1];
  var currency = currState[0], setCurrency = currState[1];
  var isDark = darkState[0], setIsDark = darkState[1];
  var budgetAlert = alertState[0], setBudgetAlert = alertState[1];
  var autoBackup = autoState[0], setAutoBackup = autoState[1];

  var pageState = useState('dashboard');
  var page = pageState[0], setPage = pageState[1];
  var toastState = useState(null);
  var toast = toastState[0], setToast = toastState[1];

  useEffect(function () { document.body.className = isDark ? 'dark' : 'light'; }, [isDark]);

  function toggleTheme() { setIsDark(function (p) { return !p; }); }
  function showToast(msg, type) { setToast({ msg: msg, type: type || 'ok', key: Date.now() }); }

  var catMap = calcCatMap(transactions, 'expense');
  var alertCount = Object.entries(budgets).filter(function (e) { return e[1] > 0 && (catMap[e[0]] || 0) >= e[1] * 0.8; }).length;

  function handleLogin(u) { setUser(u); setPage('dashboard'); }

  function handleLogout() {
    if (autoBackup && transactions.length > 0) {
      var json = buildBackupJSON(transactions);
      var blob = new Blob([json], { type: 'application/json' });
      downloadBlob(blob, 'finbook_auto_backup_' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.json');
      showToast('Auto-backup สำเร็จ กำลัง logout...');
      setTimeout(function () { setUser(null); setPage('dashboard'); }, 1500);
    } else {
      setUser(null); setPage('dashboard');
    }
  }

  if (!user) {
    return createElement(React.Fragment, null,
      createElement(LoginScreen, { onLogin: handleLogin, isDark: isDark, toggleTheme: toggleTheme }),
      toast && createElement(Toast, Object.assign({}, toast, { onDone: function () { setToast(null); } }))
    );
  }

  var navItems = [
    { id: 'dashboard',    label: 'Dashboard', icon: '◈' },
    { id: 'transactions', label: 'รายการ',    icon: '≡' },
    { id: 'budget',       label: 'Budget',    icon: '◎', alert: alertCount },
    { id: 'report',       label: 'รายงาน',    icon: '▦' },
    { id: 'export',       label: 'Export',    icon: '⬇' },
    { id: 'backup',       label: 'Backup',    icon: '☁' },
    { id: 'settings',     label: 'ตั้งค่า',    icon: '⚙' },
  ];

  var commonProps = { transactions: transactions, currency: currency, showToast: showToast };

  return createElement('div', { className: 'layout' },
    // Sidebar
    createElement('aside', { className: 'sidebar' },
      createElement('div', { className: 'sidebar-logo' },
        createElement('div', { className: 'avatar' }, user.avatar || user.name[0]),
        createElement('div', { className: 'brand' }, 'FinanceBook'),
        createElement('div', { className: 'uname' }, user.name),
        createElement('span', { className: 'curr-badge', style: { marginTop: 6 } }, currency)
      ),
      navItems.map(function (n) {
        return createElement('div', { key: n.id, className: 'nav-item' + (page === n.id ? ' active' : ''), onClick: function () { setPage(n.id); } },
          createElement('span', { style: { fontSize: 13 } }, n.icon), ' ', n.label,
          n.alert > 0 && createElement('span', { className: 'notification-dot' })
        );
      }),
      createElement('div', { className: 'sidebar-bottom' },
        createElement('button', { className: 'theme-btn', onClick: toggleTheme }, isDark ? '☀  Light mode' : '🌙  Dark mode'),
        createElement('button', { className: 'logout-btn', onClick: handleLogout }, '⏻  Logout')
      )
    ),

    // Main
    createElement('main', { className: 'main' },
      page === 'dashboard'    && createElement(Dashboard,    Object.assign({}, commonProps, { budgets: budgets })),
      page === 'transactions' && createElement(Transactions,  Object.assign({}, commonProps, { setTransactions: setTransactions, budgets: budgets })),
      page === 'budget'       && createElement(BudgetPage,   Object.assign({}, commonProps, { budgets: budgets, setBudgets: setBudgets })),
      page === 'report'       && createElement(ReportPage,   commonProps),
      page === 'export'       && createElement(ExportPage,   Object.assign({}, commonProps, { user: user })),
      page === 'backup'       && createElement(BackupPage,   { transactions: transactions, setTransactions: setTransactions, showToast: showToast }),
      page === 'settings'     && createElement(SettingsPage, { currency: currency, setCurrency: setCurrency, isDark: isDark, toggleTheme: toggleTheme, budgetAlert: budgetAlert, setBudgetAlert: setBudgetAlert, autoBackup: autoBackup, setAutoBackup: setAutoBackup })
    ),

    toast && createElement(Toast, Object.assign({}, toast, { onDone: function () { setToast(null); } }))
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('app')).render(createElement(App));
