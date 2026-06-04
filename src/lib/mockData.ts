export type ClientStatus = "Active" | "Inactive";
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
}

export type ProjectStatus = "Planning" | "In Progress" | "Completed";
export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  description: string;
  dueDate: string; // ISO date string
  hoursBudget: number;
  hoursLogged: number;
  status: ProjectStatus;
  progress: number; // 0-100
  milestones?: ProjectMilestone[];
}

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  amount: number;
  status: InvoiceStatus;
  date: string; // ISO date string
  dueDate: string; // ISO date string
}

export interface TimeEntry {
  id: string;
  projectId: string;
  clientId: string;
  date: string; // ISO date string
  durationMinutes: number;
}

export interface Settings {
  name: string;
  email: string;
  company: string;
  bio: string;
  emailNotifications: boolean;
}

export const initialClients: Client[] = [
  { id: "c1", firstName: "Acme", lastName: "Corp", email: "contact@acme.com", phone: "555-0100", company: "Acme Corp", status: "Active" },
  { id: "c2", firstName: "Global", lastName: "Tech", email: "info@globaltech.com", phone: "555-0101", company: "Global Tech", status: "Active" },
  { id: "c3", firstName: "Start", lastName: "Up", email: "hello@startup.io", phone: "555-0102", company: "StartUp", status: "Inactive" },
  { id: "c4", firstName: "Mega", lastName: "Systems", email: "admin@megasys.com", phone: "555-0103", company: "Mega Systems", status: "Active" },
  { id: "c5", firstName: "Beta", lastName: "Inc", email: "support@beta.inc", phone: "555-0104", company: "Beta Inc", status: "Active" },
  { id: "c6", firstName: "Jane", lastName: "Doe", email: "jane@example.com", phone: "555-0105", company: "Freelance", status: "Inactive" },
  { id: "c7", firstName: "John", lastName: "Smith", email: "john@example.com", phone: "555-0106", company: "Consulting", status: "Active" },
  { id: "c8", firstName: "Alice", lastName: "Wonder", email: "alice@wonder.land", phone: "555-0107", company: "Wonderland", status: "Active" },
  { id: "c9", firstName: "Bob", lastName: "Builder", email: "bob@builder.com", phone: "555-0108", company: "Builder Co", status: "Active" },
  { id: "c10", firstName: "Charlie", lastName: "Chaplin", email: "charlie@silent.com", phone: "555-0109", company: "Silent Movies", status: "Inactive" },
  { id: "c11", firstName: "David", lastName: "Bowie", email: "david@starman.com", phone: "555-0110", company: "Starman Inc", status: "Active" },
  { id: "c12", firstName: "Eve", lastName: "Adams", email: "eve@eden.com", phone: "555-0111", company: "Eden Project", status: "Active" },
  { id: "c13", firstName: "Frank", lastName: "Sinatra", email: "frank@myway.com", phone: "555-0112", company: "MyWay", status: "Inactive" },
  { id: "c14", firstName: "Grace", lastName: "Hopper", email: "grace@navy.mil", phone: "555-0113", company: "US Navy", status: "Active" },
  { id: "c15", firstName: "Henry", lastName: "Ford", email: "henry@motors.com", phone: "555-0114", company: "Ford Motors", status: "Active" },
];

export const initialProjects: Project[] = [
  { id: "p1", title: "Website Redesign", clientId: "c1", description: "Full redesign of corporate website.", dueDate: "2026-07-01", hoursBudget: 100, hoursLogged: 45, status: "In Progress", progress: 45 },
  { id: "p2", title: "Mobile App MVP", clientId: "c2", description: "React Native prototype.", dueDate: "2026-06-15", hoursBudget: 80, hoursLogged: 80, status: "Completed", progress: 100 },
  { id: "p3", title: "Marketing Site", clientId: "c4", description: "Landing pages for new campaign.", dueDate: "2026-08-01", hoursBudget: 50, hoursLogged: 10, status: "Planning", progress: 20 },
  { id: "p4", title: "E-commerce Migration", clientId: "c5", description: "Migrate to Shopify.", dueDate: "2026-09-10", hoursBudget: 150, hoursLogged: 75, status: "In Progress", progress: 50 },
  { id: "p5", title: "SEO Audit", clientId: "c7", description: "Comprehensive SEO audit.", dueDate: "2026-06-20", hoursBudget: 20, hoursLogged: 5, status: "In Progress", progress: 25 },
  { id: "p6", title: "Brand Identity", clientId: "c8", description: "Logo and brand guidelines.", dueDate: "2026-07-15", hoursBudget: 60, hoursLogged: 0, status: "Planning", progress: 0 },
  { id: "p7", title: "Internal Dashboard", clientId: "c11", description: "Admin dashboard.", dueDate: "2026-10-01", hoursBudget: 200, hoursLogged: 190, status: "In Progress", progress: 95 },
  { id: "p8", title: "Cloud Migration", clientId: "c12", description: "Move infrastructure to AWS.", dueDate: "2026-08-15", hoursBudget: 120, hoursLogged: 120, status: "Completed", progress: 100 },
  { id: "p9", title: "Security Audit", clientId: "c14", description: "Penetration testing.", dueDate: "2026-07-05", hoursBudget: 40, hoursLogged: 10, status: "In Progress", progress: 25 },
  { id: "p10", title: "Process Automation", clientId: "c15", description: "Automate supply chain.", dueDate: "2026-11-20", hoursBudget: 300, hoursLogged: 0, status: "Planning", progress: 0 },
];

export const initialInvoices: Invoice[] = [
  { id: "i1", invoiceNumber: "INV-001", clientId: "c1", amount: 2500, status: "Paid", date: "2026-05-01", dueDate: "2026-05-15" },
  { id: "i2", invoiceNumber: "INV-002", clientId: "c2", amount: 4000, status: "Paid", date: "2026-05-10", dueDate: "2026-05-24" },
  { id: "i3", invoiceNumber: "INV-003", clientId: "c4", amount: 1500, status: "Pending", date: "2026-06-01", dueDate: "2026-06-15" },
  { id: "i4", invoiceNumber: "INV-004", clientId: "c5", amount: 3750, status: "Overdue", date: "2026-04-15", dueDate: "2026-04-29" },
  { id: "i5", invoiceNumber: "INV-005", clientId: "c7", amount: 800, status: "Pending", date: "2026-06-03", dueDate: "2026-06-17" },
  { id: "i6", invoiceNumber: "INV-006", clientId: "c8", amount: 1200, status: "Paid", date: "2026-05-20", dueDate: "2026-06-03" },
  { id: "i7", invoiceNumber: "INV-007", clientId: "c11", amount: 10000, status: "Pending", date: "2026-06-04", dueDate: "2026-06-18" },
  { id: "i8", invoiceNumber: "INV-008", clientId: "c12", amount: 6000, status: "Paid", date: "2026-05-25", dueDate: "2026-06-08" },
  { id: "i9", invoiceNumber: "INV-009", clientId: "c14", amount: 2000, status: "Overdue", date: "2026-04-20", dueDate: "2026-05-04" },
  { id: "i10", invoiceNumber: "INV-010", clientId: "c15", amount: 500, status: "Paid", date: "2026-05-28", dueDate: "2026-06-11" },
  { id: "i11", invoiceNumber: "INV-011", clientId: "c1", amount: 1000, status: "Pending", date: "2026-06-04", dueDate: "2026-06-18" },
  { id: "i12", invoiceNumber: "INV-012", clientId: "c2", amount: 450, status: "Overdue", date: "2026-05-05", dueDate: "2026-05-19" },
];

export const initialTimeEntries: TimeEntry[] = [
  { id: "t1", projectId: "p1", clientId: "c1", date: "2026-06-01", durationMinutes: 120 },
  { id: "t2", projectId: "p1", clientId: "c1", date: "2026-06-02", durationMinutes: 180 },
  { id: "t3", projectId: "p2", clientId: "c2", date: "2026-06-01", durationMinutes: 240 },
  { id: "t4", projectId: "p4", clientId: "c5", date: "2026-06-03", durationMinutes: 60 },
  { id: "t5", projectId: "p5", clientId: "c7", date: "2026-06-04", durationMinutes: 90 },
];

export const initialSettings: Settings = {
  name: "Alex Dev",
  email: "alex@freelancepro.local",
  company: "Alex Web Solutions",
  bio: "Senior Full-Stack Developer specializing in React and Node.js.",
  emailNotifications: true,
};

export const monthlyEarningsMockData = [
  { name: 'Jan', earnings: 4000 },
  { name: 'Feb', earnings: 3000 },
  { name: 'Mar', earnings: 5500 },
  { name: 'Apr', earnings: 4500 },
  { name: 'May', earnings: 8000 },
  { name: 'Jun', earnings: 12450 },
];

export const weeklyHoursMockData = [
  { name: 'Mon', hours: 6 },
  { name: 'Tue', hours: 8 },
  { name: 'Wed', hours: 7 },
  { name: 'Thu', hours: 5 },
  { name: 'Fri', hours: 8 },
  { name: 'Sat', hours: 2 },
  { name: 'Sun', hours: 0 },
];

export const recentActivityMockData = [
  { id: "a1", type: "project", message: "Project 'Mobile App MVP' completed", date: "2 hours ago" },
  { id: "a2", type: "invoice", message: "Invoice INV-008 paid ($6,000)", date: "5 hours ago" },
  { id: "a3", type: "client", message: "New client 'Alice Wonder' added", date: "1 day ago" },
  { id: "a4", type: "time", message: "Logged 3 hours on 'Website Redesign'", date: "1 day ago" },
  { id: "a5", type: "project", message: "Started working on 'Internal Dashboard'", date: "2 days ago" },
];
