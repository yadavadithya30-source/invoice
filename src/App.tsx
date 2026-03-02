/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Wrench, 
  FileText, 
  BarChart3,
  LogOut, 
  Search, 
  Bell, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Wallet,
  CreditCard
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Types ---

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${active ? 'bg-active-menu text-white rounded-lg' : 'text-sidebar-text hover:bg-blue-100 hover:text-sidebar-text'}`}>
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const SummaryCard = ({ title, amount, icon: Icon, iconColor, statusIcon: StatusIcon, statusColor }: { title: string, amount: string, icon: any, iconColor: string, statusIcon?: any, statusColor?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-card-border shadow-sm flex justify-between items-start flex-1"
  >
    <div>
      <p className="text-muted-text text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-sidebar-text">{amount}</h3>
    </div>
    <div className="flex items-center gap-2">
      {StatusIcon && <StatusIcon size={24} className={statusColor} />}
      <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
        <Icon size={20} className={iconColor.replace('bg-', 'text-')} />
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'inv-001', date: '2025-12-10', amount: 50, status: 'Paid' },
    { id: 'inv-002', date: '2026-02-16', amount: 150, status: 'Pending' },
  ]);

  const handlePayNow = (id: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: 'Paid' } : inv
    ));
  };

  const totalDue = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleDownloadStatement = () => {
    const headers = ['Invoice #', 'Date', 'Amount', 'Status'];
    const rows = invoices.map(inv => [inv.id, inv.date, `$${inv.amount}`, inv.status]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `statement_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-page-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-bg border-r border-card-border flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-active-menu p-2 rounded-lg">
            <Wrench className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-sidebar-text">AutoFix</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={FileText} label="Invoices" active />
          <SidebarItem icon={BarChart3} label="Reports" />
        </nav>

        <div className="mt-auto pt-6 border-t border-card-border">
          <SidebarItem icon={LogOut} label="Sign Out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-card-border flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
            <input 
              type="text" 
              placeholder="Search job cards, invoices..." 
              className="w-full pl-10 pr-4 py-2 bg-page-bg border border-card-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-active-menu/20 transition-all text-sidebar-text"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted-text hover:bg-page-bg rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-card-border">
              <div className="text-right">
                <p className="text-sm font-semibold text-sidebar-text">Adithya</p>
                <p className="text-xs text-muted-text">Customer - Springfield</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-active-menu font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-sidebar-text">Invoices & Payments</h1>
            <button 
              onClick={handleDownloadStatement}
              className="flex items-center gap-2 px-4 py-2 bg-active-menu text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-active-menu/20"
            >
              <Download size={18} />
              Download Statement
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard 
              title="Total Due" 
              amount={`$${totalDue}`} 
              icon={AlertCircle} 
              iconColor="text-red-500" 
              statusIcon={AlertCircle}
              statusColor="text-red-500"
            />
            <SummaryCard 
              title="Total Paid" 
              amount={`$${totalPaid}`} 
              icon={CheckCircle2} 
              iconColor="text-emerald-500" 
              statusIcon={CheckCircle2}
              statusColor="text-emerald-500"
            />
            <SummaryCard 
              title="Credits" 
              amount="$0" 
              icon={Wallet} 
              iconColor="text-blue-500" 
            />
          </div>

          {/* Invoices Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-page-bg border-b border-card-border">
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-sidebar-text">{invoice.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-text">{invoice.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-sidebar-text">${invoice.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {invoice.status === 'Pending' ? (
                        <button 
                          onClick={() => handlePayNow(invoice.id)}
                          className="inline-flex items-center gap-2 px-4 py-1.5 bg-active-menu text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <CreditCard size={14} />
                          Pay Now
                        </button>
                      ) : (
                        <button className="p-2 text-muted-text hover:text-active-menu hover:bg-blue-50 rounded-lg transition-all">
                          <Download size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
