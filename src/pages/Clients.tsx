import { useState, useMemo, useEffect } from "react";
import { useDataStore } from "../contexts/DataStoreContext";
import { useToast } from "../contexts/ToastContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Search, MoreHorizontal, UserX, User } from "lucide-react";
import { Client } from "../lib/mockData";

export function Clients() {
  const { clients, setClients, projects, invoices } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem("clientForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFirstName(parsed.firstName || "");
        setLastName(parsed.lastName || "");
        setEmail(parsed.email || "");
        setPhone(parsed.phone || "");
        setCompany(parsed.company || "");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (firstName || lastName || email || phone || company) {
      sessionStorage.setItem("clientForm", JSON.stringify({ firstName, lastName, email, phone, company }));
    }
  }, [firstName, lastName, email, phone, company]);

  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [clients, search]);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!company) newErrors.company = "Company is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newClient: Client = {
      id: `c${clients.length + 1}`,
      firstName,
      lastName,
      email,
      phone,
      company,
      status: "Active",
    };

    setClients([...clients, newClient]);
    setIsModalOpen(false);
    sessionStorage.removeItem("clientForm");
    setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setCompany(""); setErrors({});
    addToast("Client added successfully", "success");
  };

  const handleDeleteClient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setClients(clients.filter((c) => c.id !== id));
    if (selectedClient?.id === id) {
      setSelectedClient(null);
    }
  };

  // Client Details
  const clientProjects = selectedClient ? projects.filter(p => p.clientId === selectedClient.id) : [];
  const clientInvoices = selectedClient ? invoices.filter(i => i.clientId === selectedClient.id) : [];
  const totalBilled = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your clients and their details.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Client</Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search clients..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">Company</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Contact</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr 
                key={client.id} 
                className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => setSelectedClient(client)}
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {client.firstName} {client.lastName}
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">{client.company}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>{client.email}</span>
                    <span className="text-xs text-gray-400">{client.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                      onClick={(e) => handleDeleteClient(client.id, e)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      aria-label={`Delete ${client.firstName}`}
                    >
                      <UserX className="w-4 h-4 ml-auto" />
                   </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center bg-white dark:bg-gray-900">
                  <div className="flex flex-col items-center justify-center">
                    <UserX className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No clients found</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm">Get started by creating a new client, or try adjusting your search filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
        <form onSubmit={handleAddClient} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} error={!!errors.firstName} />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} error={!!errors.lastName} />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} error={!!errors.company} />
            {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone (optional)</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Client</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} title="Client Details">
        {selectedClient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedClient.firstName} {selectedClient.lastName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedClient.company}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact</p>
                <p className="text-sm mt-1">{selectedClient.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Billed</p>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  ${totalBilled.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
               <h4 className="font-medium mb-3">Active Projects ({clientProjects.filter(p => p.status !== 'Completed').length})</h4>
               <ul className="space-y-2">
                  {clientProjects.length === 0 ? (
                    <p className="text-sm text-gray-500">No projects for this client.</p>
                  ) : clientProjects.map(p => (
                    <li key={p.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                      <span>{p.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                         p.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                         p.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                         'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {p.status}
                      </span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
