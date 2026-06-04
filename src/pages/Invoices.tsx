import { useState, useEffect } from "react";
import { useDataStore } from "../contexts/DataStoreContext";
import { useToast } from "../contexts/ToastContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DollarSign, Search, Download, FileText, AlertCircle } from "lucide-react";
import { Invoice } from "../lib/mockData";
import { generateInvoicePDF } from "../lib/pdfUtils";

export function Invoices() {
  const { invoices, setInvoices, clients } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem("invoiceForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setClientId(parsed.clientId || "");
        setAmount(parsed.amount || "");
        setDueDate(parsed.dueDate || "");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (clientId || amount || dueDate) {
      sessionStorage.setItem("invoiceForm", JSON.stringify({ clientId, amount, dueDate }));
    }
  }, [clientId, amount, dueDate]);

  const filteredInvoices = invoices.filter(inv => {
    const client = clients.find(c => c.id === inv.clientId);
    const searchString = search.toLowerCase();
    return inv.invoiceNumber.toLowerCase().includes(searchString) || 
           client?.company.toLowerCase().includes(searchString);
  });

  const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPaidThisMonth = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0); // Mock logic just assumes all paid are this month for simplicity

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!clientId) newErrors.clientId = "Client is required";
    if (!amount || isNaN(Number(amount))) newErrors.amount = "Valid amount is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nextNum = invoices.length + 1;
    const newInvoice: Invoice = {
      id: `i${nextNum}`,
      invoiceNumber: `INV-${nextNum.toString().padStart(3, '0')}`,
      clientId,
      amount: Number(amount),
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      dueDate
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    sessionStorage.removeItem("invoiceForm");
    setClientId(""); setAmount(""); setDueDate(""); setErrors({});
    addToast("Invoice created successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage billing and payments.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Create Invoice</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">{invoices.filter(i => i.status !== 'Paid').length} pending invoices</p>
          </CardContent>
        </Card>
        <Card className="bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-indigo-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaidThisMonth.toLocaleString()}</div>
            <p className="text-xs text-indigo-200 mt-1">Historically</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search by invoice # or client..."
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
              <th scope="col" className="px-6 py-3">Invoice #</th>
              <th scope="col" className="px-6 py-3">Client</th>
              <th scope="col" className="px-6 py-3 text-right">Amount</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Date</th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">Due Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => {
               const client = clients.find(c => c.id === invoice.clientId);
               return (
                 <tr 
                   key={invoice.id} 
                   className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                 >
                   <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                     {invoice.invoiceNumber}
                   </td>
                   <td className="px-6 py-4 font-medium">
                     {client?.company || 'Unknown Client'}
                   </td>
                   <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                     ${invoice.amount.toLocaleString()}
                   </td>
                   <td className="px-6 py-4 hidden md:table-cell text-gray-500">
                     {new Date(invoice.date).toLocaleDateString()}
                   </td>
                   <td className="px-6 py-4 hidden sm:table-cell text-gray-500">
                     {new Date(invoice.dueDate).toLocaleDateString()}
                   </td>
                   <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                       invoice.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                       invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                       'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                     }`}>
                       {invoice.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button
                       onClick={() => generateInvoicePDF(invoice, client)}
                       className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                       aria-label="Download PDF"
                     >
                       <Download className="w-4 h-4 ml-auto" />
                     </button>
                   </td>
                 </tr>
               )
            })}
             {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center bg-white dark:bg-gray-900">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No invoices found</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm">Create your first invoice to get paid, or try adjusting your search filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client</label>
            <select 
              value={clientId} 
              onChange={(e) => setClientId(e.target.value)}
              className={`flex h-10 w-full rounded-md border ${errors.clientId ? 'border-red-500' : 'border-gray-300 dark:border-gray-800'} bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
            >
              <option value="">Select a client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
            </select>
            {errors.clientId && <p className="text-xs text-red-500">{errors.clientId}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount ($)</label>
            <Input type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} error={!!errors.amount} />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} error={!!errors.dueDate} />
            {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
