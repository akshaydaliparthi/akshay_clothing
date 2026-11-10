# AKSHAY — Online Clothing Store (React 18 + Vite + Tailwind CSS)

A complete, production-grade urban streetwear e-commerce storefront built for **AKSHAY** (`₹` INR), featuring dual WCAG-AA themes, 24 realistic streetwear products across 6 categories, live debounced search, interactive SVG studio garment visualization with 1.65x zoom, multi-step checkout, customer account portal, and a protected Admin Dashboard with Recharts analytics.

This frontend project showcases the brand's clothing, bags, and watches.

---

## 1. Project Folder Tree

```text
akshay-clothing-store/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── StoreContext.jsx
    ├── hooks/
    │   ├── useCart.js
    │   ├── useDebounce.js
    │   ├── useLocalStorage.js
    │   └── useTheme.js
    ├── data/
    │   └── products.json
    ├── utils/
    │   └── currency.js
    └── routes/
        └── ProtectedRoute.jsx
```

---

## 2. Setup & Run Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Create production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 3. Brand Theme Tokens (WCAG AA Checked)

- **Theme 1 – LIGHT (Default)**:
  - Primary Text / Navbar / Buttons: Charcoal Grey `#36454F`
  - Secondary Backgrounds / Cards / Borders: Moonlit Silver `#C9CED6`
  - Accent CTAs / Sale Badges / Highlights: Signal Red `#E63946`
- **Theme 2 – DARK (Toggle)**:
  - Primary Background: Jet Black `#0A0A0B`
  - Secondary Cards / Sections / Gradients: Royal Amethyst `#6B3FA0`
  - Accent CTAs / Hover Glows / Highlights: Electric Cyan `#00E5FF`

---

## 4. Swapping Mock Data for a Real Backend

1. **Node.js + Express + PostgreSQL/MongoDB**:
   - Replace `INITIAL_PRODUCTS` hydration in `StoreContext` with `fetch('/api/v1/products')`.
   - Connect `PLACE_ORDER` to `POST /api/v1/orders` and verify Razorpay signature (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`) on the server.
2. **Supabase**:
   - Initialize `@supabase/supabase-js` in `src/utils/supabaseClient.js`.
   - Query products via `supabase.from('products').select('*')` and use Supabase Auth (`supabase.auth.signInWithPassword`) for `SET_USER`.
3. **Firebase**:
   - Connect Firestore collection `products` and `orders` with `onSnapshot` for real-time Admin stock updates.

---

## 5. Deployment Guide (Vercel / Netlify)

- **Vercel**: Run `npx vercel` from the project root (Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`).
- **Netlify**: Run `npx netlify-cli deploy --prod --dir=dist` after running `npm run build`, and include `_redirects` (`/* /index.html 200`) for SPA routing.

## 6. Deploying with GitHub Pages

The included `.github/workflows/deploy.yml` builds and deploys the site whenever changes are pushed to `main` or `master`, or when the workflow is started manually. Vite automatically uses the repository name as the Pages base path during the GitHub Actions build.

1. Push this project to a GitHub repository.
2. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main` or `master`, or run **Deploy to GitHub Pages** from the **Actions** tab.

The published URL will appear in the workflow run and in **Settings → Pages**.
