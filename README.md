<div align="center">

<h1 style="font-size: 3rem; font-weight: 800;">
	<img src="./public/brand-icon.png" width="48" height="48" alt="EverAfter icon" style="vertical-align: middle; margin-right: 0.3em;" /> EverAfter / <font color="#B8784E">A wedding services marketplace</font>
</h1>

<h3 style="font-size: 1.1rem; font-weight: 700;"><font color="#B8784E">B14-A9 · Category 004 · WedPlan</font></h3>

<h2 style="font-size: 1.8rem; font-weight: 800;">Your day. Your dream. Your Ever After.</h2>

Discover trusted venues, photographers, florists, caterers, and stylists — then request your date in one calm place.

**Live Site:** <a href="https://b14-a9-everafter-client-svk.vercel.app/" target="_blank" rel="noopener noreferrer">Open EverAfter</a>

[![Live Site](https://img.shields.io/badge/Live%20Site-EverAfter-2E2A3A?style=for-the-badge)](https://b14-a9-everafter-client-svk.vercel.app/)
[![Server API](https://img.shields.io/badge/Server%20API-Visit%20API-B8784E?style=for-the-badge)](https://b14-a9-everafter-server-svk.vercel.app/)

</div>

---

## 🔗 Project Links

| Resource | Link |
| --- | --- |
| 🌐 **Live website** | [b14-a9-everafter-client-svk.vercel.app](https://b14-a9-everafter-client-svk.vercel.app/) |
| ⚙️ **Live API** | [b14-a9-everafter-server-svk.vercel.app](https://b14-a9-everafter-server-svk.vercel.app/) |
| 💻 **Client repository** | [SVKSharma/B14-A9-EverAfter-Client](https://github.com/SVKSharma/B14-A9-EverAfter-Client) |
| 🗄️ **Server repository** | [SVKSharma/B14-A9-EverAfter-Server](https://github.com/SVKSharma/B14-A9-EverAfter-Server) |

> **This is the frontend repository.** The Express + MongoDB API, Stripe webhook, and ImgBB upload pipeline that power EverAfter live in the [server repository](https://github.com/SVKSharma/B14-A9-EverAfter-Server). You will need both projects running locally for the full experience.

---

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">About EverAfter</font></h2>

EverAfter is a wedding services marketplace built for the **WedPlan** brief. Customers browse wedding venues, photographers, florists, caterers, makeup artists, and fashion studios; vendors publish their services and answer booking requests; admins keep the marketplace honest.

The app is built with the Next.js App Router, TypeScript, Better Auth, MongoDB, Tailwind CSS, and Stripe, and it is shaped around three roles with entirely different jobs:

- **Customers** discover services, compare prices and locations, and request a date.
- **Vendors** publish up to three services on the free plan (unlimited on Premium), manage availability, and accept or decline requests.
- **Admins** review listings, block accounts, and watch every Premium transaction.

The interface pairs an editorial, frosted-glass look with practical tooling: URL-synced search and filters, per-role dashboards, a booking request trail, image uploads, and calm success and error feedback. Every page is responsive, destructive actions ask for confirmation, and Premium is activated only by a verified Stripe webhook.

> **Find a service, request a date, get an answer.**

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🌟 Key Features</font></h2>

- **Editorial home page:** A full-bleed hero, category showcase, featured services, a "why EverAfter" panel, a three-step planning guide, couple stories, and a closing call to action — all built from local imagery.
- **Live service discovery:** Debounced search across service names and descriptions, with category chips, a location field, price sorting, and pagination. Every filter is written to the URL, so a filtered view can be shared or refreshed without losing state.
- **Rich service pages:** A four-image gallery, category and location details, vendor card with Premium badge, price, availability, related services, and a sticky booking panel.
- **Booking requests:** Customers choose an event date, location, and message. Requests start as **pending**; vendors can accept or reject them; customers can cancel while a request is still pending.
- **Duplicate protection:** The API refuses a second active request for the same service on the same date, and only approved, currently available services can be booked.
- **Role-aware dashboards:** Separate overviews for customers, vendors, and admins, each with its own stat strip, recent activity, and next actions. `/dashboard` redirects to the correct dashboard for the signed-in role.
- **Vendor service management:** Create, edit, delete, and toggle availability for wedding services. Listings require a name, category, price, location, description, and at least one photo (up to four).
- **Free plan quota:** The free plan allows three services. The limit is enforced on the server, counts listings still in review, and lifts automatically when a Premium pass is active.
- **Admin moderation:** Admins approve listings, reject them with a short reason, delete violating listings, and can tell vendors exactly what to fix. Rejected services can be corrected and resubmitted.
- **User management:** Admins search and filter accounts, open a full user profile, and block or unblock accounts. Blocked users cannot create a session.
- **Transaction ledger:** Every Premium checkout appears in the admin transaction table with plan, amount, currency, Stripe session, status, and vendor details.
- **Premium subscriptions:** A vendor upgrades through hosted Stripe Checkout, lands on a success or cancel page, and sees the plan change once Stripe confirms the payment. Premium adds unlimited services, a badge on listings, and priority placement in featured services.
- **Webhook-only activation:** Premium is granted only after a verified `checkout.session.completed` event. Expired and failed checkouts are recorded without granting access, and a pending checkout blocks a second one so nobody is charged twice.
- **Google and email/password auth:** Better Auth handles both flows. Sign-up asks for a role — vendor or customer — and Google sign-up carries that choice through signed OAuth state.
- **Secure profile editing:** Signed-in users can change their name, business name, and avatar. Email and role are read-only, and the API accepts only whitelisted fields.
- **Image uploads:** Service photos and avatars are validated in the browser (JPEG, PNG, or WebP, up to 5 MB) and uploaded to ImgBB through a protected server route.
- **Frosted-glass design system:** Deep aubergine, copper, sage, and warm ivory; Bodoni Moda display type with Inter body copy; translucent panels, soft mesh gradients, hairline rules, and pill-shaped controls.
- **Motion with restraint:** Scroll reveals and hover transitions use Motion and respect `prefers-reduced-motion`.
- **Responsive everywhere:** Navigation, galleries, forms, tables, and dashboards adapt from 375 px to wide desktop with no horizontal scrolling.
- **Page-matched loading states:** Every route has a skeleton that mirrors the real page layout, so content does not jump when data arrives.
- **Friendly error states:** A public 404, a dashboard-scoped 404, an app error boundary, and a last-resort global error boundary, each with a clear way back.
- **Toast feedback:** Success and error messages use Sonner toasts instead of browser alerts, with a custom frosted style.
- **Dynamic tab titles and app icons:** Route titles, record names on detail pages, live pending counts, a multi-size favicon, Apple touch icon, PWA manifest, and a generated Open Graph card.
- **Accessible details:** Semantic landmarks, labelled inputs, keyboard-friendly dialogs, visible focus rings, reduced-motion-aware animation, and contrast-checked status colors.
- **Production-safe auth redirects:** Signed-out visitors are sent to sign in with a `?redirect=` target and returned to the page they wanted after authentication.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🔐 Authentication & Security</font></h2>

EverAfter uses **Better Auth** with the **MongoDB adapter** on the client app, then bridges sessions into the Express API with signed JWTs.

1. A visitor registers with name, email, password, and a role (**customer** or **vendor**), or continues with Google. Role can never be `admin` at sign-up.
2. Better Auth stores users, sessions, and accounts in MongoDB, reusing the API's database.
3. The Better Auth **JWT plugin** publishes signing keys at `/api/auth/jwks` and exposes short-lived tokens at `/api/auth/token`.
4. `src/lib/auth-client.ts` caches the token in memory and refreshes it shortly before expiry, then sends it as `Authorization: Bearer <token>`.
5. The Express API verifies each token against the JWKS endpoint with `jose` and derives the user id and role from the verified claims.
6. Every protected route also checks the role server-side: customers cannot publish services, vendors cannot read another vendor's listings, and admins are the only role allowed inside `/admin` APIs.
7. Ownership is enforced for edits, deletes, booking cancellation, and vendor replies — a valid token is not enough on its own.
8. `role` cannot be changed through the profile update endpoint, and the session hook refuses to create sessions for blocked accounts.
9. On the client, `middleware.ts` performs an early cookie check for `/dashboard/*` and service details, while dashboard layouts re-check the real session and `ROUTE_ACCESS` server-side.
10. All secrets — MongoDB, Better Auth, Google OAuth, Stripe, and ImgBB — are read from environment variables. `.env` files are never committed.

Account notes:

- Admin accounts are provisioned manually in the database; there is no admin option in the UI.
- Password rules: at least 6 characters, one uppercase letter, and one lowercase letter.
- Blocking an account takes effect immediately on the next session attempt.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">💳 Premium Subscription</font></h2>

Vendors start on the **Free** plan and can publish up to **three** services. **Premium** removes the limit, adds a badge to every listing, and gives those listings priority in featured sections.

How the upgrade works:

1. The vendor opens `/dashboard/vendor/subscription` and chooses Premium.
2. The client calls `POST /api/subscriptions/checkout`; the server creates a Stripe Checkout Session for the configured price and returns its hosted URL.
3. Stripe handles card entry. The vendor returns to `/dashboard/vendor/subscription/success` or `/cancel`.
4. Stripe sends `checkout.session.completed` to `POST /api/webhooks/stripe`. The server verifies the raw-body signature, then activates Premium for the purchased duration.
5. The subscription screen polls `/api/subscriptions/status` while a checkout is pending, so the plan flips to Premium without a manual refresh.
6. If Stripe has the payment but the webhook has not arrived yet, the transaction stays `pending` with `awaitingActivation: true`, and a new checkout is blocked with `409` so the vendor is never charged twice.
7. `checkout.session.expired` and `checkout.session.async_payment_failed` are recorded as non-granting outcomes; the next checkout is allowed only after the pending window clears.

Default plan configuration (all overridable by environment variables): **$49 USD for 30 days**.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🛠️ Technologies Used</font></h2>

- **Framework:** Next.js 16 App Router, React 19, React DOM
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui (`base-nova`), Base UI, tw-animate-css
- **UI Components:** shadcn/ui, Base UI, Lucide React
- **Typography:** `next/font` with Bodoni Moda (display) and Inter (body/UI)
- **Animation:** Motion (`motion/react`) with reduced-motion guards
- **Authentication:** Better Auth, `@better-auth/mongo-adapter`, Better Auth JWT plugin
- **Database:** MongoDB (official driver)
- **Forms & Validation:** React Hook Form, Zod, `@hookform/resolvers`
- **Data Fetching:** Next.js Server Components, native `fetch`, typed API helpers
- **Payments:** Stripe Checkout (hosted redirect), verified webhooks on the server
- **Image Hosting:** ImgBB through a protected API route
- **Notifications:** Sonner
- **Image handling:** Next Image, browser-side file validation
- **Icons & Metadata:** Lucide, file-based favicons, PWA manifest, generated Open Graph image
- **Linting:** ESLint, `eslint-config-next`
- **Deployment:** Vercel (client and API)

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🧭 Routes</font></h2>

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero, categories, featured services, how it works, stories, closing CTA |
| `/services` | Public | Searchable, filterable, sortable marketplace catalogue |
| `/services/[id]` | Signed in | Service gallery, details, vendor card, booking panel, related services |
| `/sign-in` | Public | Email/password and Google sign-in |
| `/sign-up` | Public | Registration with role choice and optional avatar |
| `/dashboard` | Signed in | Redirects to the dashboard for the current role |
| `/dashboard/customer` | Customer | Customer overview and recent booking requests |
| `/dashboard/customer/bookings` | Customer | Every request with status filters |
| `/dashboard/customer/bookings/[id]` | Customer | Request details and cancel action |
| `/dashboard/vendor` | Vendor | Vendor overview, quota, pending replies |
| `/dashboard/vendor/services` | Vendor | All services with approval status and availability |
| `/dashboard/vendor/services/new` | Vendor | Add a service with photos |
| `/dashboard/vendor/services/[id]/edit` | Vendor | Edit an existing service |
| `/dashboard/vendor/bookings` | Vendor | Customer requests with accept/decline actions |
| `/dashboard/vendor/subscription` | Vendor | Plan comparison, checkout, and status |
| `/dashboard/vendor/subscription/success` | Vendor | Payment confirmation and Premium polling |
| `/dashboard/vendor/subscription/cancel` | Vendor | Cancelled checkout with a safe retry path |
| `/dashboard/admin` | Admin | Platform stats and moderation shortcuts |
| `/dashboard/admin/users` | Admin | User search, filters, block/unblock |
| `/dashboard/admin/users/[id]` | Admin | Full account profile and activity |
| `/dashboard/admin/services` | Admin | Approve, reject with a reason, or delete listings |
| `/dashboard/admin/transactions` | Admin | Premium transaction ledger |
| `/dashboard/profile` | Signed in | Editable profile, avatar, and account summary |

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🔌 API Integration</font></h2>

The client talks to the EverAfter Express API through `src/lib/api.ts` (browser) and `src/lib/server-api.ts` (server components). All business endpoints are prefixed with `/api` and return `{ success, data, meta? }`.

| Method | Endpoint | Access | Used for |
| --- | --- | --- | --- |
| `GET` | `/services` | Public | Browse, search, filter, sort, paginate |
| `GET` | `/services/:id` | Signed in | Service details and related work |
| `GET` | `/users/me` | Bearer JWT | Profile and role state |
| `PATCH` | `/users/me` | Bearer JWT | Name, business name, avatar |
| `POST` | `/uploads/image` | Bearer JWT | Service photos and avatars via ImgBB |
| `GET` | `/vendor/services` | Vendor | The vendor's own listings and quota |
| `POST` | `/vendor/services` | Vendor | Create a service |
| `GET` | `/vendor/services/:id` | Vendor + owner | Load a service for editing |
| `PATCH` | `/vendor/services/:id` | Vendor + owner | Update a service |
| `PATCH` | `/vendor/services/:id/availability` | Vendor + owner | Toggle availability |
| `DELETE` | `/vendor/services/:id` | Vendor + owner | Delete a service |
| `GET` | `/vendor/bookings` | Vendor | Incoming booking requests |
| `PATCH` | `/bookings/:id/status` | Vendor + owner | Accept or reject a request |
| `GET` | `/bookings/mine` | Customer | The customer's requests |
| `POST` | `/bookings` | Customer | Create a booking request |
| `GET` | `/bookings/:id` | Participant | Request details |
| `PATCH` | `/bookings/:id/cancel` | Customer + owner | Cancel a pending request |
| `GET` | `/stats/vendor` | Vendor | Vendor dashboard figures |
| `GET` | `/stats/customer` | Customer | Customer dashboard figures |
| `GET` | `/subscriptions/status` | Vendor | Plan, expiry, pending checkout state |
| `POST` | `/subscriptions/checkout` | Vendor | Create a Stripe Checkout Session |
| `GET` | `/subscriptions/session` | Vendor | Reconcile a returned checkout session |
| `GET` | `/admin/stats` | Admin | Platform totals |
| `GET` | `/admin/users` | Admin | Search and paginate users |
| `GET` | `/admin/users/:id` | Admin | User detail with counts |
| `PATCH` | `/admin/users/:id/block` | Admin | Block or unblock an account |
| `GET` | `/admin/services` | Admin | Moderation queue and filters |
| `PATCH` | `/admin/services/:id/status` | Admin | Approve or reject with a reason |
| `DELETE` | `/admin/services/:id` | Admin | Remove a listing |
| `GET` | `/admin/transactions` | Admin | Premium transaction history |
| `POST` | `/api/webhooks/stripe` | Stripe signature | Verify and apply checkout events |

Authentication endpoints are provided by Better Auth under `/api/auth/*`, including `/api/auth/jwks` and `/api/auth/token`.

Full API documentation, data models, and server setup are available in the [server repository](https://github.com/SVKSharma/B14-A9-EverAfter-Server).

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">📂 Project Structure</font></h2>

```text
ever-after-client/
├── public/
│   ├── brand-icon.png
│   └── images/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       ├── admin/
│   │   │       │   ├── services/
│   │   │       │   ├── transactions/
│   │   │       │   └── users/[id]/
│   │   │       ├── customer/
│   │   │       │   └── bookings/[id]/
│   │   │       ├── profile/
│   │   │       ├── vendor/
│   │   │       │   ├── bookings/
│   │   │       │   ├── services/
│   │   │       │   │   ├── [id]/edit/
│   │   │       │   │   └── new/
│   │   │       │   └── subscription/
│   │   │       │       ├── cancel/
│   │   │       │       └── success/
│   │   │       ├── error.tsx
│   │   │       ├── loading.tsx
│   │   │       └── not-found.tsx
│   │   ├── (root)/
│   │   │   ├── services/
│   │   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── api/auth/[...all]/route.ts
│   │   ├── apple-icon.png
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── icon.png
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   ├── not-found.tsx
│   │   └── opengraph-image.png
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── bookings/
│   │   ├── dashboard/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── profile/
│   │   ├── services/
│   │   ├── shared/
│   │   ├── subscriptions/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── auth-guard.ts
│   │   ├── constants.ts
│   │   ├── route-access.ts
│   │   ├── server-api.ts
│   │   ├── site.ts
│   │   ├── upload.ts
│   │   └── schemas/
│   ├── types/
│   └── middleware.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🚀 Installation & Local Development</font></h2>

Follow these steps to run the EverAfter client locally. The API is a separate project, so clone both repositories side by side.

### 1. Clone the repositories

Using HTTPS:

```bash
git clone https://github.com/SVKSharma/B14-A9-EverAfter-Client.git
git clone https://github.com/SVKSharma/B14-A9-EverAfter-Server.git
```

Using SSH:

```bash
git clone git@github.com:SVKSharma/B14-A9-EverAfter-Client.git
git clone git@github.com:SVKSharma/B14-A9-EverAfter-Server.git
```

### 2. Install dependencies

```bash
cd B14-A9-EverAfter-Client
npm install

cd ../B14-A9-EverAfter-Server
npm install
```

### 3. Create the client environment file

Create `.env.local` (or `.env`) in the client root:

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=everafter
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string. Better Auth writes users and sessions to this database |
| `MONGODB_DB` | No | Database name, defaults to `everafter` |
| `BETTER_AUTH_SECRET` | Yes | Signing secret for Better Auth sessions and OAuth state |
| `BETTER_AUTH_URL` | Yes | Public origin of this app; also used for OAuth callbacks, metadata, and JWT issuer/audience |
| `GOOGLE_CLIENT_ID` | Yes for Google sign-in | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes for Google sign-in | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Express API, including `/api` |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site origin for metadata and Open Graph images; defaults to `http://localhost:3000` |

### 4. Create the server environment file

Create `.env` in the server root (the repository includes `.env.example`):

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=everafter
CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
IMGBB_API_KEY=your_imgbb_api_key
```

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | `development` locally, `production` on the server |
| `PORT` | No | API port, defaults to `5000` |
| `MONGODB_URI` | Yes | Same database as the client so auth and business data stay in sync |
| `MONGODB_DB` | No | Database name, defaults to `everafter` |
| `CLIENT_URL` | Yes | Client origin(s) allowed by CORS and used for Stripe return URLs; comma-separate extra origins |
| `BETTER_AUTH_URL` | Yes in production | Better Auth origin used to verify JWTs against `/api/auth/jwks` |
| `BETTER_AUTH_JWT_ISSUER` | No | Optional expected JWT issuer |
| `BETTER_AUTH_JWT_AUDIENCE` | No | Optional expected JWT audience |
| `STRIPE_SECRET_KEY` | Yes for Premium | Stripe secret key (test mode locally) |
| `STRIPE_WEBHOOK_SECRET` | Yes for Premium | Signing secret for the webhook endpoint |
| `PREMIUM_PRICE_CENTS` | No | Premium price in cents, defaults to `4900` |
| `PREMIUM_CURRENCY` | No | Currency code, defaults to `usd` |
| `PREMIUM_DURATION_DAYS` | No | Premium duration, defaults to `30` |
| `IMGBB_API_KEY` | Yes for uploads | ImgBB key used by the protected upload route |

### 5. Configure Google OAuth

Add this authorized redirect URI in the Google Cloud console:

```text
http://localhost:3000/api/auth/callback/google
```

For production, add the equivalent URL using the deployed client origin.

### 6. Configure Stripe (Premium)

Use Stripe **test mode** keys and forward webhook events locally with the Stripe CLI:

```bash
stripe listen --forward-to http://localhost:5000/api/webhooks/stripe
```

Copy the `whsec_…` secret the CLI prints into `STRIPE_WEBHOOK_SECRET`, then restart the API. Forward these events:

```text
checkout.session.completed
checkout.session.expired
checkout.session.async_payment_failed
```

Premium is granted only after a correctly signed `checkout.session.completed` event.

### 7. Start the API, then the client

In one terminal:

```bash
cd B14-A9-EverAfter-Server
npm run dev
```

In a second terminal:

```bash
cd B14-A9-EverAfter-Client
npm run dev
```

The API starts on `http://localhost:5000` and the client on `http://localhost:3000`.

### 8. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000). Make sure the API is reachable at the URL in `NEXT_PUBLIC_API_URL`, or update that variable to point at the live API.

Optional: seed demo vendors from the server repository with `npm run seed`.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🧪 Available Scripts</font></h2>

Client:

```bash
npm run dev      # Start the Next.js development server
npm run build    # Create a production build
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

Server:

```bash
npm run dev      # Start the API with nodemon
npm run start    # Start the API with Node
npm run seed     # Seed demo vendors and services
```

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">🌐 Deployment</font></h2>

Both projects are deployed separately on **Vercel**.

1. Import the [client repository](https://github.com/SVKSharma/B14-A9-EverAfter-Client) into Vercel.
2. Add every client variable from the table above to the Vercel project settings.
3. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to `https://b14-a9-everafter-client-svk.vercel.app`.
4. Set `NEXT_PUBLIC_API_URL` to `https://b14-a9-everafter-server-svk.vercel.app/api`.
5. Import the [server repository](https://github.com/SVKSharma/B14-A9-EverAfter-Server) and add its variables.
6. Set the server's `CLIENT_URL` and `BETTER_AUTH_URL` to `https://b14-a9-everafter-client-svk.vercel.app`.
7. Add the production Google callback: `https://b14-a9-everafter-client-svk.vercel.app/api/auth/callback/google`.
8. Register the Stripe webhook endpoint in the Stripe dashboard: `https://b14-a9-everafter-server-svk.vercel.app/api/webhooks/stripe`, subscribe it to the three checkout events, and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
9. Deploy both projects and sign in once on the live site to confirm the API, JWT bridge, and image uploads work in production.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#B8784E">✅ Project Notes</font></h2>

- Admin accounts are created manually; the sign-up form only offers customer and vendor, and the API rejects any other role.
- A free vendor can publish up to three services. Listings awaiting review count toward the limit so the quota cannot be dodged.
- A customer cannot have two active requests for the same service on the same date.
- Only approved and available services can be booked. Past event dates are rejected in the form and on the server.
- Booking messages must be at least 10 characters so vendors have enough context to reply.
- Service photos and avatars must be JPEG, PNG, or WebP and no larger than 5 MB. A service can have up to four photos.
- Premium is never granted by the client. It is applied only by a verified Stripe webhook, and a pending checkout blocks a duplicate charge.
- Blocked accounts cannot sign in; existing sessions are rejected on the next session check.
- The app never uses browser `alert()` or `confirm()`. Destructive actions use in-app dialogs and feedback uses toasts.
- Route protection is layered: middleware for an early redirect, dashboard layouts for role checks, and API middleware for the final authority.
- Every route has a dedicated loading skeleton, and the app ships custom 404 and error boundaries.
- Tab titles update per route and per record, and the app includes a multi-size favicon, Apple touch icon, PWA manifest, and an Open Graph card.
- No `.env` file or secret is committed to either repository.

Thank you for exploring EverAfter. The project was built for the **B14-A9 · Category 004** assignment while extending the baseline with a real booking workflow, role-based dashboards, admin moderation, a webhook-verified Premium tier, and a calm, responsive frosted-glass interface.

---

<div align="center">

Built with 💚 by <a href="https://github.com/SVKSharma">Showvik</a>

</div>
