# HMI Organics — Full Website & Backend Codebase
## مکمل ویب سائٹ اپنے کمپیوٹر پر چلانے کا طریقہ (How to Run on Your PC / Laptop)

---

### اردو میں ہدایات (Urdu Instructions)

یہ HMI Organics کی مکمل ویب سائٹ کا سورس کوڈ ہے جس میں فرنٹ اینڈ (React + Vite + Tailwind CSS) اور محفوظ ایڈمن پورٹل بیک اینڈ (Node.js + Express) دونوں شامل ہیں۔

#### 1. ضروری سافٹ ویئر (Requirements)
اپنے کمپیوٹر پر صرف ایک چیز انسٹال ہونی چاہیے:
- **Node.js** (ورژن 18 یا اس سے نیا): [https://nodejs.org](https://nodejs.org) سے مفت ڈاؤن لوڈ کر کے انسٹال کریں۔

#### 2. کمپیوٹر پر چلانے کا آسان طریقہ:
1. ڈاؤن لوڈ کی گئی ZIP فائل کو Extract (Unzip) کریں کسی بھی فولڈر میں۔
2. اس فولڈر کے اندر جائیں اور Right Click کر کے **Open in Terminal** یا **Command Prompt (cmd)** کھولیں۔
3. درج ذیل کمانڈ لکھ کر Enter دبائیں تاکہ تمام ضروری لائبریریز انسٹال ہو جائیں:
   ```bash
   npm install
   ```
4. انسٹالیشن مکمل ہونے کے بعد یہ کمانڈ چلائیں:
   ```bash
   npm run dev
   ```
5. آپ کا لوکل سرور فوراً شروع ہو جائے گا! اپنے براؤزر میں یہ ایڈریس کھولیں:
   ```
   http://localhost:3000
   ```
   ویب سائٹ بالکل لائیو کی طرح چلے گی!

#### 3. لائیو ہوسٹنگ یا VPS پر اپلوڈ کرنے کا طریقہ:
- پروڈکشن بلڈ بنانے کے لیے چلائیں:
  ```bash
  npm run build
  npm start
  ```
- ڈیٹا تمام کا تمام `./data/` فولڈر میں محفوظ ہوتا ہے (`products.json`, `pages.json`, `settings.json`, `auth.json`)۔

#### 4. ڈیفالٹ لاگ ان ایڈمن پاسورڈ:
- **Username:** `admin@hmiorganics.com` (یا صرف `admin`)
- **Default Password:** `admin123`

---

### English Instructions

#### 1. Prerequisites
- **Node.js** (v18.0.0 or later): Download from [https://nodejs.org](https://nodejs.org)

#### 2. Local Setup & Execution
1. Extract the downloaded ZIP file to your preferred folder.
2. Open Terminal (macOS/Linux) or Command Prompt / PowerShell (Windows) inside that folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

#### 3. Production Deployment (VPS / Cloud Server / cPanel)
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```
   The backend server runs on `PORT 3000` (or `process.env.PORT`).

#### 4. Architecture & Key Folders
- `/src/`: React 18, Tailwind CSS, TypeScript components & pages
- `/public/`: Public static assets, brand logo, and botanical banners
- `/data/`: File-backed persistent storage for products, pages content, SEO, and cryptographic authentication
- `server.ts`: Express backend handling API routes, security headers, role-based access, and Vite integration

---
© 2026 HMI Organics Pakistan. Pure, Natural & Trusted Organic Care.
