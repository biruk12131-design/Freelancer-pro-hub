import { Activity } from "lucide-react";
import { useDataStore } from "../../contexts/DataStoreContext";

export function RecentActivity() {
  const { clients, projects, invoices } = useDataStore();

  // We synthesize some recent activity because the mock data doesn't have create dates on everything.
  // We'll use ID numbers as a proxy for recency, or map to dummy dates.
  // But ideally we just create a unified list from invoices and clients.
  
  const activities = [
    ...invoices.map(inv => ({
      id: `inv-${inv.id}`,
      type: "invoice",
      message: `Invoice ${inv.invoiceNumber} is ${inv.status.toLowerCase()} ($${inv.amount.toLocaleString()})`,
      date: new Date(inv.date).getTime(),
      displayDate: new Date(inv.date).toLocaleDateString()
    })),
    ...clients.map(c => ({
      id: `client-${c.id}`,
      type: "client",
      message: `New client added: ${c.firstName} ${c.lastName}`,
      date: Date.now() - parseInt(c.id.replace('c','')) * 86400000,
      displayDate: new Date(Date.now() - parseInt(c.id.replace('c','')) * 86400000).toLocaleDateString()
    })),
    ...projects.map(p => ({
      id: `project-${p.id}`,
      type: "project",
      message: `Project '${p.title}' is ${p.status.toLowerCase()}`,
      // Just some proxy for timestamp
      date: new Date(p.dueDate).getTime() - 30 * 86400000,
      displayDate: "Recently"
    }))
  ];

  // Sort by date descending and take top 5
  activities.sort((a, b) => b.date - a.date);
  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 shrink-0">
             <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none line-clamp-1">{activity.message}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.displayDate}</p>
          </div>
        </div>
      ))}
      {recentActivities.length === 0 && (
        <p className="text-sm text-gray-500">No recent activity.</p>
      )}
    </div>
  );
}
