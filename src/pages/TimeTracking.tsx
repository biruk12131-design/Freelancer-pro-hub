import { useState, useEffect } from "react";
import { useDataStore } from "../contexts/DataStoreContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Play, Square, Clock } from "lucide-react";
import { TimeEntry } from "../lib/mockData";

export function TimeTracking() {
  const { timeEntries, setTimeEntries, projects, clients } = useDataStore();
  
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTracking) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isTracking && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, seconds]);

  const handleStartStop = () => {
    if (!selectedProjectId && !isTracking) {
      alert("Please select a project first.");
      return;
    }

    if (isTracking) {
      // Stop and log time
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const minutesLog = Math.ceil(seconds / 60);
        const newEntry: TimeEntry = {
          id: `t${timeEntries.length + 1}`,
          projectId: project.id,
          clientId: project.clientId,
          date: new Date().toISOString().split('T')[0],
          durationMinutes: minutesLog
        };
        setTimeEntries([newEntry, ...timeEntries]);
      }
      setIsTracking(false);
      setSeconds(0);
    } else {
      setIsTracking(true);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Time Tracking</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track hours spent on active projects.</p>
      </div>

      <Card className="max-w-2xl border-indigo-100 dark:border-indigo-900 shadow-sm relative overflow-hidden">
        <div className={`absolute inset-0 bg-indigo-50 dark:bg-indigo-900/10 transition-opacity duration-500 ${isTracking ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Project</label>
                <select 
                  value={selectedProjectId} 
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={isTracking}
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                >
                  <option value="">Choose a project...</option>
                  {projects.filter(p => p.status !== 'Completed').map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-5xl font-mono font-light tracking-tighter text-indigo-900 dark:text-indigo-100 mb-4">
                {formatTime(seconds)}
              </div>
              <Button 
                size="lg"
                variant={isTracking ? "destructive" : "default"} 
                className={`w-32 transition-all shadow-md ${isTracking ? 'animate-pulse' : ''}`}
                onClick={handleStartStop}
              >
                {isTracking ? (
                  <><Square className="w-4 h-4 mr-2 fill-current" /> Stop</>
                ) : (
                  <><Play className="w-4 h-4 mr-2 fill-current" /> Start</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {timeEntries.map(entry => {
               const project = projects.find(p => p.id === entry.projectId);
               const client = clients.find(c => c.id === entry.clientId);
               
               return (
                 <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-sm text-indigo-500">
                       <Clock className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="font-medium text-gray-900 dark:text-white">{project?.title || 'Unknown Project'}</p>
                       <p className="text-sm text-gray-500 dark:text-gray-400">{client?.company || 'Unknown Client'}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-mono text-lg font-medium text-gray-900 dark:text-white">
                        {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                     </p>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                       {new Date(entry.date).toLocaleDateString()}
                     </p>
                   </div>
                 </div>
               )
             })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
