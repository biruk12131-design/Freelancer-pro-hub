import { Users, Briefcase, FileText, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDataStore } from "../../contexts/DataStoreContext";
import { useMemo } from "react";

export function StatsDisplay() {
  const { clients, projects, invoices, timeEntries } = useDataStore();

  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const activeProjects = projects.filter((p) => p.status !== "Completed").length;
    
    // Revenue from paid invoices
    const totalRevenue = invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);

    // Active hours from all time entries
    const activeHours = timeEntries.reduce((sum, t) => sum + (t.durationMinutes / 60), 0);
    
    return {
      totalClients,
      activeProjects,
      totalRevenue,
      activeHours: Math.round(activeHours * 10) / 10
    };
  }, [clients, projects, invoices, timeEntries]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-green-500 mt-1">Historically collected</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Hours</CardTitle>
          <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeHours}h</div>
          <p className="text-xs text-gray-500 mt-1">Total time logged</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalClients}</div>
          <p className="text-xs text-gray-500 mt-1">Across all status</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeProjects}</div>
          <p className="text-xs text-gray-500 mt-1">Currently in progress</p>
        </CardContent>
      </Card>
    </div>
  );
}
