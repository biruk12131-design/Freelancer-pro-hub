import { useState, useEffect } from "react";
import { useDataStore } from "../contexts/DataStoreContext";
import { useToast } from "../contexts/ToastContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Clock, Calendar, CheckSquare, AlertCircle, Plus, Check } from "lucide-react";
import { Project, ProjectStatus } from "../lib/mockData";

export function Projects() {
  const { projects, setProjects, clients, timeEntries } = useDataStore();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [hoursBudget, setHoursBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("projectForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTitle(parsed.title || "");
        setClientId(parsed.clientId || "");
        setDescription(parsed.description || "");
        setDueDate(parsed.dueDate || "");
        setHoursBudget(parsed.hoursBudget || "");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (title || clientId || description || dueDate || hoursBudget) {
      sessionStorage.setItem("projectForm", JSON.stringify({ title, clientId, description, dueDate, hoursBudget }));
    }
  }, [title, clientId, description, dueDate, hoursBudget]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title) newErrors.title = "Title is required";
    if (!clientId) newErrors.clientId = "Client is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (!hoursBudget || isNaN(Number(hoursBudget))) newErrors.hoursBudget = "Valid hours budget is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newProject: Project = {
      id: `p${projects.length + 1}`,
      title,
      clientId,
      description,
      dueDate,
      hoursBudget: Number(hoursBudget),
      hoursLogged: 0,
      status: "Planning",
      progress: 0,
      milestones: []
    };

    setProjects([...projects, newProject]);
    setIsModalOpen(false);
    sessionStorage.removeItem("projectForm");
    setTitle(""); setClientId(""); setDescription(""); setDueDate(""); setHoursBudget(""); setErrors({});
    addToast("Project added successfully", "success");
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = (p.milestones || []).map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        return { ...p, milestones: updatedMilestones };
      }
      return p;
    }));
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, milestones: (prev.milestones || []).map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m) } : null);
    }
  };

  const handleAddMilestone = (projectId: string) => {
    if (!newMilestone.trim()) return;
    const newMstone = { id: `m${Date.now()}`, title: newMilestone.trim(), completed: false };
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = [...(p.milestones || []), newMstone];
        return { ...p, milestones: updatedMilestones };
      }
      return p;
    }));
    if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, milestones: [...(prev.milestones || []), newMstone] } : null);
    }
    setNewMilestone("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your active projects.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Project</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const client = clients.find(c => c.id === project.clientId);
          
          return (
            <Card 
              key={project.id} 
              className="flex flex-col cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-md group"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.title}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{client?.company || 'Unknown Client'}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        project.status === 'Completed' ? 'bg-green-500' : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 rounded-b-xl py-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                 <div className="flex items-center gap-1">
                   <Calendar className="w-3.5 h-3.5" />
                   {new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                 </div>
                 <div className="flex items-center gap-1">
                   <Clock className="w-3.5 h-3.5" />
                   {project.hoursLogged} / {project.hoursBudget}h
                 </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Project">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} error={!!errors.title} />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Client</label>
            <div className="relative w-full">
              <select 
                value={clientId} 
                onChange={(e) => setClientId(e.target.value)}
                className={`flex h-10 w-full rounded-md border ${errors.clientId ? 'border-red-500 pr-10 focus-visible:ring-red-500' : 'border-gray-300 dark:border-gray-800'} bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 appearance-none`}
              >
                <option value="">Select a client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
              </select>
              {errors.clientId && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors.clientId && <p className="text-xs text-red-500">{errors.clientId}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="flex w-full rounded-md border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-sm font-medium">Due Date</label>
               <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} error={!!errors.dueDate} />
               {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Hours Budget</label>
               <Input type="number" min="1" value={hoursBudget} onChange={(e) => setHoursBudget(e.target.value)} error={!!errors.hoursBudget} />
               {errors.hoursBudget && <p className="text-xs text-red-500">{errors.hoursBudget}</p>}
             </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Project</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title || "Project Specs"}>
        {selectedProject && (
          <div className="space-y-6">
             <p className="text-sm text-gray-500">{selectedProject.description}</p>

             <div className="space-y-2">
               <div className="flex justify-between text-sm font-medium">
                 <span>Timeline Progress</span>
                 <span>{selectedProject.progress}%</span>
               </div>
               <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                   style={{ width: `${selectedProject.progress}%` }}
                 />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex items-center justify-between">
                   <div>
                     <p className="text-xs text-gray-500">Logged</p>
                     <p className="font-semibold">{selectedProject.hoursLogged} <span className="text-sm font-normal text-gray-500">hrs</span></p>
                   </div>
                   <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex items-center justify-between">
                   <div>
                     <p className="text-xs text-gray-500">Budget</p>
                     <p className="font-semibold">{selectedProject.hoursBudget} <span className="text-sm font-normal text-gray-500">hrs</span></p>
                   </div>
                   <CheckSquare className="w-5 h-5 text-gray-400" />
                </div>
             </div>

             <div>
                <h4 className="font-medium text-sm mb-3">Milestones</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mb-3">
                   {(selectedProject.milestones || []).length === 0 ? (
                      <p className="text-xs text-gray-500">No milestones yet.</p>
                   ) : (selectedProject.milestones || []).map(milestone => (
                     <div key={milestone.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md text-sm">
                       <button
                         onClick={() => handleToggleMilestone(selectedProject.id, milestone.id)}
                         className={`w-5 h-5 flex items-center justify-center rounded border ${milestone.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 dark:border-gray-600'}`}
                       >
                         {milestone.completed && <Check className="w-3.5 h-3.5" />}
                       </button>
                       <span className={`flex-1 ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                         {milestone.title}
                       </span>
                     </div>
                   ))}
                </div>
                <div className="flex items-center gap-2">
                   <Input value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)} placeholder="Add new milestone..." className="h-8" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMilestone(selectedProject.id); } }} />
                   <Button size="sm" onClick={() => handleAddMilestone(selectedProject.id)} className="shrink-0 h-8 px-2"><Plus className="w-4 h-4" /></Button>
                </div>
             </div>
             
             <div>
                <h4 className="font-medium text-sm mb-3">Recent Time Entries</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                   {timeEntries.filter(t => t.projectId === selectedProject.id).length === 0 ? (
                      <p className="text-xs text-gray-500">No time logged for this project yet.</p>
                   ) : timeEntries.filter(t => t.projectId === selectedProject.id).map(entry => (
                     <div key={entry.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md text-sm">
                       <span className="text-gray-600 dark:text-gray-300">{new Date(entry.date).toLocaleDateString()}</span>
                       <span className="font-medium">{Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
