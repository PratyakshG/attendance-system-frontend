# Attendance System — Frontend

A web-based RFID attendance management system built with **Next.js 15** (App Router). It provides separate dashboards for **Admins** and **Employees** to track attendance, manage leave requests, raise/resolve complaints, and broadcast notices — with attendance data driven by RFID card scans on the backend.

Live demo: [att-system-frontend.vercel.app](https://att-system-frontend.vercel.app)

## Features

### Admin
- **Dashboard** — live stats on total/present/absent employees, employees on leave, pending leave requests, and complaint counters
- **Attendance List** — view check-in/check-out logs and scan status for all employees
- **Employee List & Records** — manage employee profiles, view individual employee attendance history
- **UID Master** — map RFID card UIDs to employees (create/update/deactivate)
- **Leave Applications** — review and approve/reject employee leave requests
- **Complaints** — track and resolve employee complaints (new / in-process / resolved)
- **Notice Board** — publish and manage notices with priority levels (High/Medium/Low)

### Employee
- Personal dashboard
- View own attendance history
- Submit and track leave applications
- Raise and track complaints
- View notice board

### Auth & Access Control
- JWT-based session cookies (via `jose`), set as `httpOnly`, `secure` cookies
- Route protection via Next.js **middleware** — redirects unauthenticated users to `/sign-in`, and enforces role-based access so Employees can't reach `/admin` routes and vice versa

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router, Turbopack)
- **UI**: React 19, [shadcn/ui](https://ui.shadcn.com) (New York style) on top of Radix UI primitives, Tailwind CSS v4, `lucide-react` icons
- **Forms & Validation**: `react-hook-form` + `zod`
- **Auth**: `jose` (JWT sign/verify), cookie-based sessions
- **Dates**: `date-fns`, `react-day-picker`
- **Media**: `next-cloudinary` for image uploads (e.g. employee profile photos)
- **Notifications**: `sonner` (toasts)
- **Linting**: ESLint 9 (flat config) with `eslint-config-next`

## Project Structure

```
app/
├── (auth)/sign-in/          # Login page
├── admin/                   # Admin-only routes (protected by middleware)
│   ├── attendance-list/
│   ├── complaints/
│   ├── employee-list/
│   ├── employee-record/[id]/
│   ├── leave-applications/
│   ├── notice-board/
│   ├── uid-master/
│   └── page.tsx              # Admin dashboard
├── employee/                 # Employee-only routes (protected by middleware)
│   ├── attendance/
│   ├── complaints/
│   ├── leave-applications/
│   ├── notice-board/
│   └── page.tsx               # Employee dashboard
└── api/auth/                 # Sign-in / logout route handlers

components/
├── modals/                   # Create/update dialogs (employee, UID, notice, admin, confirmation)
├── ui/                        # shadcn/ui primitives (button, dialog, form, sidebar, etc.)
└── *.tsx                      # Dashboards, sidebars, header, loading skeletons

contexts/       # React context (current user)
hooks/          # Custom hooks (fetch employees, fetch UID, date/time, notices, mobile check)
lib/            # Session (JWT) handling, fetch helpers, form schemas, utils
middleware.ts   # Auth + role-based route protection
types.d.ts      # Shared TypeScript types (User, Employee, Attendance, Leave, Complaint, Notice…)
```

## Backend

This is the **frontend only**. It communicates with a separate RFID attendance backend API (hosted at `rfidattendance-mu.vercel.app`) for authentication, employee data, attendance records, leaves, complaints, and notices.

## Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
git clone https://github.com/PratyakshG/attendance-system-frontend.git
cd attendance-system-frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
JWT_SECRET=your_jwt_secret_here
```

Additional variables may be required for Cloudinary image uploads (e.g. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, upload preset) depending on your `next-cloudinary` setup.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. You'll be redirected to `/sign-in` if you don't have an active session.

### Build for production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Deployment

The app is set up for deployment on [Vercel](https://vercel.com), the platform from the creators of Next.js. See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.

## License

No license specified.
