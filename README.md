# Falcon Island Weekly Report
A modern, production-grade weekly dashboard for Community and Property Management stakeholders. Built with React, Vite, Tailwind CSS, Recharts, and designed to interface with Google Firebase.

## Prerequisites
- Node.js (v18+)
- A new or existing Firebase Project

## Initial Setup
1. **Clone & Install**
   ```bash
   npm install
   ```
2. **Environment Variables**
   Duplicate `.env.example` to a new `.env.local` file at the root of the project:
   ```bash
   cp .env.example .env.local
   ```
   *Fill in the values using keys sourced directly from your Firebase Project Settings > General.*

3. **Start Local Development Server**
   ```bash
   npm run dev
   ```

---

## Firebase Configuration Checklist
Before going to production, the Firebase Console MUST be configured precisely to map to the strict rules built into this interface.
*   [ ] **Authentication**: Enable `Email/Password` sign-in methods. Create at least one baseline user account explicitly to act as your Master Admin.
*   [ ] **Firestore Database**: Create the database instance. Update the Rules using the exact permissions coded in `/firestore.rules` (which restrict write access strictly to internal users while allowing read access for published reports).
*   [ ] **Firestore Collections**: Prepare an empty structure for: `users`, `reports`, `report_items`, `report_files`. *Crucial: Add your Master Admin Firebase `UID` as a document into the `users` collection to grant them clearance.*
*   [ ] **Firebase Storage**: Initialize the Storage bucket. Apply the rule set found inside `storage.rules`.
*   [ ] **CORS Settings**: Use `gsutil` to configure CORS on your Storage Bucket if directly linking PDF attachments to avoid security rejections on standard web-facing nodes.

---

## Deployment Instructions

### Option A: Vercel (Recommended)
Vercel's zero-config setup perfectly complements Vite projects out-of-the-box.
1. Connect your Github/Gitlab repository to Vercel.
2. In the Vercel project configuration dashboard, under **Environment Variables**, meticulously map your `VITE_FIREBASE_...` keys exactly as they appear in `.env.local`.
3. Set the **Framework Preset** to `Vite`.
4. Ensure the **Build Command** is `npm run build` and **Output Directory** is `dist`.
5. Deploy. (Because this project relies strictly on React Router Client Routing, Vercel natively handles SPA fallbacks without needing a `vercel.json` file in Vite environments).

### Option B: Netlify
1. Connect your Git repository to Netlify.
2. In the **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Hit **Advanced Build Settings** > **New Variable** and map your `VITE_FIREBASE_...` keys natively.
4. **Crucial Step for React-Router**: Inside your `public/` folder, create a blank file named `_redirects` containing this exact single string: `/* /index.html 200`. This ensures Netlify's CDN proxies deeper routes (like `/admin`) cleanly to React rather than throwing a 404!
5. Deploy Site.

---

## Architecture Breakdown
- **`/public`**: Static assets, brand logos, PDF/Print mapping rules, and SPA fallbacks.
- **`/src/pages/public/SingleReport.jsx`**: A hyper-responsive data-display component mapped onto CSS `A4 Page Bounds` for instantaneous dynamic PDF printing workflows without headless browser backends.
- **`/src/pages/admin/ReportEditor.jsx`**: Massive, abstracted 11-Tab form editor capable of granularly updating deep mock and nosql states in milliseconds.
- **`/src/hooks/useLocalStorage.js`**: Replicating Nosql/Cloud state persistence for mock environments to enable testing data flows without real credentials.
