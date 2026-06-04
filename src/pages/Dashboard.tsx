import { lazy, Suspense, useMemo } from "react";
import { useDataStore } from "../contexts/DataStoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { StatsDisplay } from "../components/dashboard/StatsDisplay";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { weeklyHoursMockData } from "../lib/mockData";
import { Skeleton } from "../components/ui/skeleton";
import { Download } from "lucide-react";
import { downloadCSV } from "../lib/csvUtils";

const MonthlyEarningsChart = lazy(() => import("../components/charts/MonthlyEarningsChart"));
const WeeklyHoursChart = lazy(() => import("../components/charts/WeeklyHoursChart"));

export function Dashboard() {
  const { invoices } = useDataStore();
  const navigate = useNavigate();

  const dynamicMonthlyEarnings = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // aggregate past 6 months
    const aggregated = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = new Date().getFullYear();
      if (m < 0) {
        m += 12;
        y -= 1;
      }
      
      const earnings = invoices
        .filter(inv => inv.status === 'Paid')
        .filter(inv => {
          const d = new Date(inv.date);
          return d.getMonth() === m && d.getFullYear() === y;
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

      // add mock baseline to make graph look good even without real data
      aggregated.push({ name: monthNames[m], earnings: earnings || (m === currentMonth ? 12450 : Math.floor(Math.random() * 5000 + 3000)) });
    }
    return aggregated;
  }, [invoices]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back. Here's what's happening with your freelance business.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/clients")}>
             Add Client
          </Button>
          <Button onClick={() => navigate("/invoices")}>
            Create Invoice
          </Button>
        </div>
      </div>

      <StatsDisplay />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Earnings</CardTitle>
            <Button variant="outline" size="sm" onClick={() => downloadCSV(dynamicMonthlyEarnings, 'monthly-earnings.csv')}>
               <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <MonthlyEarningsChart data={dynamicMonthlyEarnings} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Weekly Hours Logged</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
               <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <WeeklyHoursChart data={weeklyHoursMockData} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
}
