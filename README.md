# 🦷 Dental Center Management Dashboard

A modern React + TypeScript dashboard built for ENTNT, helping dental practices manage patients, appointments, treatments, and analytics — all with a clean, mobile-first design. For demo purposes, it runs entirely in the browser with localStorage.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Role-based access: Admin (Dentist) & Patient
* Protected routes & persistent login
* Seamless session management

### 🩺 Admin Panel

* Add, edit, and manage patient records
* Schedule and track appointments (with statuses)
* Monthly calendar view for quick overview
* Upload & manage treatment documents, invoices, images
* Dashboard analytics: KPIs, revenue, patient trends

### 👤 Patient Portal

* View upcoming & past appointments
* Access and download files & invoices
* Track personal treatment history

### ⚙️ Technical Highlights

* Fully responsive (Tailwind CSS)
* State managed via React Context API
* Client-side form validation
* File uploads stored as base64/blob URLs

---

## 🛠️ Tech Stack

* React 19 + TypeScript
* React Router DOM v7
* Tailwind CSS
* React Context API
* date-fns
* Headless UI & Heroicons

---

## 📦 Getting Started

```bash
git clone <repository-url>
cd dental-center-dashboard
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login

| Role    | Email                                   |   Password |
| ------- | --------------------------------------- | ---------: |
| Admin   | [admin@entnt.in](mailto:admin@entnt.in) |   admin123 |
| Patient | [john@entnt.in](mailto:john@entnt.in)   | patient123 |

---

## 🏗️ Project Structure

```
src/
├── components/         
│   ├── PatientForm.tsx
│   └── IncidentForm.tsx
├── pages/              
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── AdminPanel.tsx
│   ├── IncidentManagement.tsx
│   ├── CalendarView.tsx
│   └── PatientView.tsx
├── contexts/           
│   ├── AuthContext.tsx
│   ├── PatientContext.tsx
│   └── IncidentContext.tsx
├── App.tsx             
└── index.tsx           
```

---

## 📊 Data Models

### User

```typescript
interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
}
```

### Patient

```typescript
interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  healthInfo: string;
}
```

### Incident (Appointment)

```typescript
interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  treatment?: string;
  nextDate?: string;
  files: IncidentFile[];
}
```

---

## 🌍 Deployment Options

### ✅ Vercel

```bash
npm run build
vercel
```

### ✅ Netlify

* Build: `npm run build`
* Drag & drop `build/` into Netlify dashboard

### ✅ GitHub Pages

```bash
npm install --save-dev gh-pages
# Add "homepage": "https://<username>.github.io/<repo>" in package.json
npm run build
npm run deploy
```

---

## 📱 Responsive Design

Works smoothly on:

* Desktop: sidebar dashboards & analytics
* Tablet: touch-friendly layout
* Mobile: stacked cards & simple nav

---

## ⚙️ Dev Scripts

* `npm start` – start dev server
* `npm run build` – build for production
* `npm test` – run tests
* `npm run eject` – eject config

---

## 📈 Extra Highlights

* Multiple file uploads per appointment
* File previews & downloads
* Color-coded monthly calendar view
* Live KPIs & revenue charts
* Top patients & treatment stats

---

## ⚠️ Notes

* No backend: browser localStorage only
* Data persists only in your browser
* Demo build, no external APIs

---

## 📄 License

Built as part of ENTNT technical assignment.

**Deployed App:** \[Your Live Link]
**GitHub:** \[Your Repository Link]

---

## 🙌 Questions?

For queries, contact: [hr@entnt.in](mailto:hr@entnt.in)
