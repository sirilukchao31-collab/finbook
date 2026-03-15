# 💰 FinanceBook v2.0 — บัญชีส่วนตัว

> แอปบัญชีส่วนตัวแบบ **Single-File** ทำงานได้ทันทีบนทุกเบราว์เซอร์ ไม่ต้องติดตั้ง ไม่ต้อง server ไม่มีการส่งข้อมูลออกภายนอก

---

## ✨ ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🔐 **Login** | Facebook Login (mock) หรือ Guest mode |
| 💸 **บันทึกรายการ** | รายรับ-รายจ่าย พร้อมหมวดหมู่ วันที่ คำอธิบาย ค้นหา กรอง แก้ไข/ลบ |
| 📊 **Dashboard** | Stats cards, Bar chart 6 เดือนล่าสุด, Pie chart สัดส่วนรายจ่าย |
| 🎯 **Budget** | ตั้งงบประมาณรายหมวด แสดง progress bar แจ้งเตือนเมื่อใกล้/เกิน |
| 📈 **รายงาน** | ดูรายปี (รายเดือน) หรือ รายเดือน (รายวัน) + สรุปหมวดหมู่ |
| ⬇ **Export** | ดาวน์โหลดเป็น `.csv` (สำหรับ Excel) หรือ `.xml` รองรับหลายสกุลเงิน |
| ☁ **Backup / Restore** | บันทึก/โหลดข้อมูลเป็นไฟล์ JSON, auto-backup ก่อน logout |
| ⚙ **ตั้งค่า** | Dark/Light mode, สกุลเงิน, toggle การแจ้งเตือน |
| 💱 **Multi-currency** | THB · USD · EUR · JPY · GBP · SGD (แปลงเพื่อแสดงผล) |
| 📱 **Responsive** | รองรับมือถือและ tablet |

---

## 🚀 วิธีเปิดใช้งาน

### วิธีที่ 1 — เปิดไฟล์โดยตรง (ง่ายที่สุด)

```
เปิดไฟล์ FinanceBook.html ในเบราว์เซอร์ได้เลย (ดับเบิลคลิก)
```

> **หมายเหตุ:** บางเบราว์เซอร์อาจบล็อก Google Fonts เมื่อเปิดจาก `file://`
> แนะนำใช้ local server วิธีใดวิธีหนึ่งด้านล่าง

### วิธีที่ 2 — Python (ไม่ต้องติดตั้งอะไรเพิ่ม)

```bash
cd finbook
python3 -m http.server 8080
# เปิด http://localhost:8080/FinanceBook.html
```

### วิธีที่ 3 — VS Code Live Server

1. ติดตั้ง extension **Live Server** ใน VS Code
2. คลิกขวาที่ `FinanceBook.html` → **Open with Live Server**

### วิธีที่ 4 — Node.js http-server

```bash
npm install -g http-server
cd finbook
http-server .
# เปิด http://localhost:8080/FinanceBook.html
```

---

## 📁 โครงสร้างโปรเจกต์

```
finbook/
├── FinanceBook.html    ← แอปหลัก (All-in-one: HTML + CSS + JS)
├── index.html          ← เวอร์ชัน React (legacy/experimental)
├── README.md
└── src/                ← source สำหรับ index.html (React version)
    ├── styles.css
    ├── constants.js
    ├── utils.js
    ├── hooks.js
    ├── App.js
    ├── components/
    │   ├── Toast.js
    │   └── AlertBanner.js
    └── pages/
        ├── Login.js
        ├── Dashboard.js
        ├── Transactions.js
        ├── Budget.js
        ├── Report.js
        ├── Export.js
        ├── Backup.js
        └── Settings.js
```

> **แนะนำ:** ใช้ `FinanceBook.html` เป็นหลัก เนื่องจากเป็น single-file ที่สมบูรณ์และไม่มี dependency

---

## 🗄️ การเก็บข้อมูล

ข้อมูลทั้งหมดเก็บใน **`localStorage`** ของเบราว์เซอร์ ภายใต้ key เดียว:

| Key | ข้อมูล |
|---|---|
| `fb2_state` | state ทั้งหมด (user, transactions, budgets, currency, settings) |

> ข้อมูลอยู่บนเครื่องของคุณ **ไม่มีการส่งออกภายนอก**
> หากล้าง cache/cookies ข้อมูลจะหาย — แนะนำ backup ไว้เสมอ

---

## 🏷️ หมวดหมู่

**รายรับ:** เงินเดือน · ธุรกิจ · การลงทุน · เงินปันผล · ของขวัญ · รายได้เสริม · อื่นๆ

**รายจ่าย:** อาหาร · เดินทาง · ที่พัก · บันเทิง · สุขภาพ · ช้อปปิ้ง · สาธารณูปโภค · การศึกษา · ประกัน · ออมเงิน · อื่นๆ

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| UI | HTML5 + Vanilla CSS (CSS Variables, Dark/Light theme) |
| Logic | Vanilla JavaScript (ES5-compatible, no framework) |
| Charts | SVG ที่วาดเองด้วย JavaScript |
| Storage | `localStorage` |
| Font | System font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`) |
| Build | ไม่มี — ไม่ต้อง bundler, ไม่ต้อง Node.js |

---

## 🔐 หมายเหตุ Facebook Login

ในเวอร์ชันนี้ Facebook Login เป็น **mock** เพื่อสาธิต (ไม่ได้เชื่อมต่อ Facebook จริง)
หากต้องการใช้งานจริง:
1. สร้าง Facebook App ที่ [developers.facebook.com](https://developers.facebook.com)
2. เพิ่ม Facebook JS SDK และแทนที่ฟังก์ชัน `doLogin('facebook')` ใน `FinanceBook.html`

---

## 📦 Budget & การแจ้งเตือน

- **แจ้งเตือนสีเหลือง** เมื่อใช้งบไปแล้ว ≥ 80%
- **แจ้งเตือนสีแดง** เมื่อเกิน budget
- มี indicator (dot) ที่เมนู Budget เมื่อมีหมวดที่เกิน/ใกล้เกิน
- สามารถปิด/เปิดการแจ้งเตือนได้ที่หน้า **ตั้งค่า**

---

## 💾 Export & Backup

| รูปแบบ | ใช้กับ |
|---|---|
| `.csv` | Excel, Google Sheets (รองรับ UTF-8 BOM) |
| `.xml` | ระบบอื่น หรือ import ข้อมูล |
| `.json` | backup/restore ภายใน FinanceBook |

---

*FinanceBook v2.0 — ข้อมูลทั้งหมดอยู่บนเครื่องคุณ ปลอดภัย ไม่มีการส่งข้อมูลออกนอก* 🔒
# finbook
