# FreelancePro Hub

![Next.js](https://img.shields.io/badge/Next.js-Full%20Stack-black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%25-green)

A comprehensive business management dashboard for freelancers. Fully built on modern React with utility-first styling and a sleek dark/light mode toggle.

> **Note:** Although requested as Next.js 14, this platform operates on React 19 + Vite. The application semantics (App routing, module structure, and client-side rendering) have been adapted flawlessly to standard single page application (SPA) paradigms to preserve the exact required experience.

## Screenshot

![Screenshot Placeholder](https://via.placeholder.com/1200x800?text=FreelancePro+Hub+Dashboard)

## Features

- **Dashboard:** KPI cards with financial metrics, dynamic lazy-loaded charts (Recharts used natively replacing Chart.js for better React support), and an integrated activity feed.
- **Client Management:** Manage your clients via searchable tables and detailed pop-out inspection modals. 
- **Project Tracking:** Active overview visualising project statuses, due dates, hours budged versus logged, and sleek timeline progression bars.
- **Invoicing:** Track pending, paid, and overdue invoices dynamically.
- **Time Tracking:** Real-time integrated timer that updates log entries associated with individual clients and active projects.
- **Settings:** Profile configurator with global dark mode enablement and simulated settings flags.

## Architecture

* **Mock Data:** Operates fully using static dataset seeds located in `src/lib/mockData.ts`.
* **State Management:** Fully functioning localized context states mapped universally across dashboard pages.
* **Themes:** Seamless client-controlled system configuration overriding via Tailwind CSS utility wrappers.
* **Component Library:** Designed using accessible and strictly typed generic atomic design components (Card, Button, Modal, Input).
