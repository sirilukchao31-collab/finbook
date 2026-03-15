// ── pages/Login.js ────────────────────────────────────────────────
'use strict';

function LoginScreen(props) {
  var onLogin = props.onLogin, isDark = props.isDark, toggleTheme = props.toggleTheme;

  function handleFB() {
    onLogin({ name: 'Somchai Jaidee', email: 'somchai@email.com', avatar: 'SJ', provider: 'facebook' });
  }
  function handleGuest() {
    onLogin({ name: 'Guest User', email: 'guest', avatar: 'G', provider: 'guest' });
  }

  return createElement('div', { className: 'login-screen' },
    // theme toggle
    createElement('button', {
      onClick: toggleTheme,
      style: {
        position: 'absolute', top: 16, right: 16,
        background: 'none', border: '1px solid var(--border)',
        borderRadius: 8, padding: '6px 10px',
        cursor: 'pointer', color: 'var(--text2)', fontSize: 18,
      }
    }, isDark ? '☀' : '🌙'),

    // logo
    createElement('div', { className: 'logo-area' },
      createElement('div', { className: 'logo-icon' }, '฿'),
      createElement('div', { className: 'logo-title' }, 'FinanceBook'),
      createElement('div', { className: 'logo-sub' }, 'บัญชีส่วนตัว ครบ จบ ในที่เดียว v' + APP_VERSION)
    ),

    // card
    createElement('div', { className: 'login-card' },
      createElement('h2', null, 'ยินดีต้อนรับ'),
      createElement('p', null, 'เข้าสู่ระบบเพื่อจัดการรายรับ-รายจ่ายส่วนตัวของคุณ ข้อมูลเก็บไว้บนอุปกรณ์ของคุณ ไม่ส่งไปที่ server ใดๆ'),

      // Facebook button
      createElement('button', { className: 'fb-btn', onClick: handleFB },
        createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'white' },
          createElement('path', { d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' })
        ),
        'เข้าสู่ระบบด้วย Facebook'
      ),

      createElement('div', { className: 'divider' }, createElement('span', null, 'หรือ')),
      createElement('button', { className: 'guest-btn', onClick: handleGuest }, 'ทดลองใช้งาน (Guest)')
    )
  );
}
