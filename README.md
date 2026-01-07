# 📚 CPE5010 - ระบบส่งงานและเก็บคะแนน

ระบบจัดการส่งงานและเก็บคะแนนสำหรับรายวิชา **CPE5010 (001) 47/4734 การออกแบบและพัฒนาเกม**

**อาจารย์ผู้สอน:** ผศ.ดร. รวิ อุตตมธนินทร์

## 🌐 Demo

🔗 **[เปิดใช้งาน Dashboard](https://kchayta32.github.io/Dashboard_for_CPE5010/)**

## ✨ Features

- **📊 Dashboard** - แสดงสถิติการส่งงานแบบ Real-time
- **👥 12 กลุ่ม** - จัดการงานของนักศึกษาทั้ง 12 กลุ่ม (กลุ่มละ 3-6 คน)
- **📝 ระบบงาน** - เพิ่ม/แก้ไข/ลบงานได้หลายชิ้น
- **🔥 Firebase Sync** - ข้อมูลซิงค์แบบ Real-time ผ่าน Firestore
- **💾 LocalStorage Fallback** - สำรองข้อมูลใน Browser
- **📥 Export** - ส่งออกข้อมูลเป็น JSON หรือ CSV

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** Firebase Firestore
- **Hosting:** GitHub Pages
- **Design:** Light Theme (Blue-Pink Gradient)

## 📁 File Structure

```
program/
├── index.html      # หน้าหลัก
├── styles.css      # ธีมและ UI Components
├── app.js          # Logic และ Firebase Integration
└── README.md       # เอกสารนี้
```

## 🚀 การใช้งาน

### สำหรับผู้ใช้ทั่วไป
1. เปิด https://kchayta32.github.io/Dashboard_for_CPE5010/
2. รอสถานะ "🔥 เชื่อมต่อ Firebase แล้ว"
3. เริ่มใช้งานได้เลย!

### สำหรับ Local Development
1. Clone repository
2. เปิดด้วย Live Server (VS Code Extension)
   ```bash
   # หรือใช้ npx serve
   npx serve .
   ```
3. เปิด http://localhost:5000

> ⚠️ **หมายเหตุ:** Firebase ต้องเปิดผ่าน HTTP/HTTPS ไม่สามารถใช้ `file://` protocol ได้

## 📋 ฟังก์ชันหลัก

| ฟังก์ชัน | คำอธิบาย |
|---------|----------|
| 📤 ส่งงาน | บันทึกการส่งงานพร้อมวันเวลา |
| ✏️ แก้ไข | แก้ไขวันเวลาที่ส่ง |
| ❌ ยกเลิก | ยกเลิกการส่งงาน |
| 💯 ให้คะแนน | กรอกคะแนนให้กลุ่มที่ส่งแล้ว |
| ✅ ส่งทั้งหมด | ทำเครื่องหมายส่งทุกกลุ่ม |
| 🗑️ ล้างข้อมูล | ล้างสถานะการส่งงานทั้งหมด |

## 🔧 Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB0msL_J9X9NXMyIrUdQY_59gedMfvpoEE",
  authDomain: "dashboardforstudent.firebaseapp.com",
  projectId: "dashboardforstudent",
  storageBucket: "dashboardforstudent.firebasestorage.app",
  messagingSenderId: "542979977304",
  appId: "1:542979977304:web:59948bec8d82c29b861a2d"
};
```

**Firestore Path:** `submissions/cpe5010_submissions`

## 👨‍🎓 รายชื่อกลุ่ม

| กลุ่ม | สมาชิก |
|:----:|--------|
| 1 | แนน, นก, เฟรช, มา, มี่, ไอซ์ |
| 2 | ตัน, โรบอท, พี, ปาร์ม, ดล |
| 3 | ต้า, เขต, เนย, น้ำ, หญิง, โอ๊ค |
| 4 | ม่อน, ปลื้ม, บิ๊ก, สตางค์ |
| 5 | ซี, กิด, มอส |
| 6 | เอฟขนอม, เน๊ะบางบ่อ, ทิมนคร, เกมส์สุราษฎร์, เพลงสุพรรณ |
| 7 | เจ๋งซอยมังกร, ปั๊บโป๊เตโต้, แฟ้มลาซาล, บูมบางแค, แคร์บางคน, อลัม |
| 8 | เซน, บอส, ปอย, ปาย, โบ้ |
| 9 | โอ๊ต, เต้, โฟน, เขต, อาท, ฟลุ๊ค |
| 10 | มิ้น, กาญ, เนย |
| 11 | บอส, โต้, น้อยหน่า, จู้, กี้, พี่อาม |
| 12 | กิจ, โอม |

## 📝 License

MIT License - Free to use and modify

---

Made with ❤️ for CPE5010 Game Design & Development Course
