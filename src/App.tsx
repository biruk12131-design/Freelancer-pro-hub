/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataStoreProvider } from "./contexts/DataStoreContext";
import { ToastProvider } from "./contexts/ToastContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { Projects } from "./pages/Projects";
import { Invoices } from "./pages/Invoices";
import { TimeTracking } from "./pages/TimeTracking";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="freelancepro-theme">
      <DataStoreProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="projects" element={<Projects />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="time" element={<TimeTracking />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </DataStoreProvider>
    </ThemeProvider>
  );
}
