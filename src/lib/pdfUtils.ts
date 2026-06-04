import jsPDF from "jspdf";
import { Invoice, Client } from "./mockData";

export const generateInvoicePDF = (invoice: Invoice, client: Client | undefined) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(`INVOICE: ${invoice.invoiceNumber}`, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 30);
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 38);
  doc.text(`Status: ${invoice.status}`, 20, 46);
  
  doc.setFontSize(14);
  doc.text("Billed To:", 20, 60);
  doc.setFontSize(12);
  if (client) {
    doc.text(`${client.firstName} ${client.lastName}`, 20, 68);
    doc.text(client.company, 20, 76);
    doc.text(client.email, 20, 84);
  } else {
    doc.text("Unknown Client", 20, 68);
  }

  doc.setFontSize(14);
  doc.text("Summary:", 20, 100);
  
  doc.setFontSize(12);
  doc.text(`Amount: $${invoice.amount.toLocaleString()}`, 20, 110);
  
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
