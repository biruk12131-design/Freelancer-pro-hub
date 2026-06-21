# FreelancePro Hub

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chart.js)
![Lighthouse](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)

A comprehensive business management dashboard for freelancers. Manage clients, projects, invoices, time tracking, and settings – all with static mock data and a beautiful, responsive UI.

## ✨ Features

- **Dashboard** – KPI cards, earnings chart, activity feed
- **Client Management** – Searchable table, add/edit/delete clients, detail panel
- **Project Tracking** – Card grid with progress bars, task checklists, time entries
- **Invoicing** – Create invoices, status badges, summary
- **Time Tracking** – Start/stop timer, logged entries
- **Settings** – Profile form, notification toggles, dark/light mode
- **Collapsible Sidebar** – Icon-based navigation
- **Fully Responsive** – Mobile, tablet, desktop
- **Accessible** – Skip to content, semantic HTML, ARIA labels

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Charts**: react-chartjs-2 & Chart.js 4
- **Icons**: lucide-react
- **Data Visualization**: Chart.js Line & Bar charts

## 📁 Project Structure

```
Freelancer-pro-hub/
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── button.tsx        # Styled button component
│   │   │   ├── card.tsx          # Card container component
│   │   │   ├── input.tsx         # Form input component
│   │   │   ├── modal.tsx         # Modal dialog component
│   │   │   └── skeleton.tsx      # Loading skeleton component
│   │   ├── charts/               # Chart components
│   │   │   ├── MonthlyEarningsChart.tsx  # Line chart for earnings
│   │   │   └── WeeklyHoursChart.tsx      # Bar chart for hours
│   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── StatsDisplay.tsx  # KPI cards display
│   │   │   └── RecentActivity.tsx # Activity feed
│   │   ├── Header.tsx            # Top navigation header
│   │   ├── Layout.tsx            # Main layout wrapper
│   │   └── Sidebar.tsx           # Navigation sidebar
│   ├── pages/                    # Page components
│   │   ├── Dashboard.tsx         # Main dashboard view
│   │   ├── Clients.tsx           # Client management page
│   │   ├── Projects.tsx          # Project tracking page
│   │   ├── Invoices.tsx          # Invoice management page
│   │   ├── TimeTracking.tsx      # Time tracking page
│   │   └── Settings.tsx          # Settings/profile page
│   ├── contexts/                 # React Context providers
│   │   ├── ThemeContext.tsx      # Dark/light mode context
│   │   ├── ToastContext.tsx      # Toast notification context
│   │   └── DataStoreContext.tsx  # Global data management context
│   ├── lib/                      # Utility functions & helpers
│   │   ├── mockData.ts           # Static mock data for all features
│   │   ├── csvUtils.ts           # CSV export utilities
│   │   ├── pdfUtils.ts           # PDF export utilities
│   │   └── utils.ts              # General utility functions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
└── metadata.json                 # Project metadata
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/biruk12131-design/Freelancer-pro-hub.git
cd Freelancer-pro-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` – Start Vite development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint checks

## 🎨 Key Components

### UI Components (`src/components/ui/`)
Reusable base components built with Tailwind CSS for consistent styling across the application.

### Dashboard Components (`src/components/dashboard/`)
- **StatsDisplay**: Shows KPI metrics (clients, projects, earnings, hours)
- **RecentActivity**: Displays recent client activity feed

### Chart Components (`src/components/charts/`)
- **MonthlyEarningsChart**: Line chart visualizing monthly earnings trends
- **WeeklyHoursChart**: Bar chart showing weekly working hours

### Page Components (`src/pages/`)
Each page manages its own state and data interactions:
- **Dashboard.tsx**: Overview with stats, charts, and recent activity
- **Clients.tsx**: CRUD operations for client management
- **Projects.tsx**: Project cards with progress tracking and task lists
- **Invoices.tsx**: Invoice creation and management with PDF export
- **TimeTracking.tsx**: Timer functionality and logged time entries
- **Settings.tsx**: User profile and application preferences

## 🎯 Core Features Implementation

### Data Management
Mock data stored in `src/lib/mockData.ts` includes:
- Sample clients with contact information
- Active projects with tasks and progress
- Invoice records with various statuses
- Time tracking entries

### Theme Support
- Dark/light mode toggle via ThemeContext
- Persisted theme preference
- Tailwind CSS dark mode classes

### Export Functionality
- **CSV Export**: Client and project data export
- **PDF Export**: Professional invoice generation

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for small screens
- Flexible grid layouts
- Touch-friendly UI elements

## 🔐 Authentication & Data
Currently uses **static mock data** for demonstration. Ready for backend integration:
- DataStoreContext can be connected to API endpoints
- Update mockData.ts to fetch from server
- Implement proper authentication flow

## 📈 Performance
- Lighthouse score: 95+
- Code-splitting with Vite
- Optimized images and assets
- Efficient CSS with Tailwind

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and ensure TypeScript types are properly defined.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.
