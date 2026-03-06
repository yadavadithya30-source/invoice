import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Calendar, 
  Wrench, 
  FileText, 
  MessageSquare, 
  User, 
  BarChart3, 
  LogOut, 
  Search, 
  Bell, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Wallet,
  Car,
  MoreHorizontal,
  X,
  Printer,
  Share2,
  CreditCard,
  Landmark,
  Smartphone
} from 'lucide-react';
import './index.css';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all mb-1 ${active ? 'bg-[#3B82F6] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const StatCard = ({ label, value, icon: Icon, iconColor, iconBg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between flex-1 min-w-[240px]">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
      <Icon size={24} />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Pending: 'bg-amber-50 text-amber-600 border-amber-100',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('Invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Google Pay');
  const [invoices, setInvoices] = useState([
    { 
      id: 'inv-001', 
      date: '2025-12-10', 
      amount: '$50', 
      status: 'Paid',
      items: [
        { description: 'Oil Change', cost: '$40' },
        { description: 'Labor', cost: '$10' }
      ]
    },
    { 
      id: 'inv-002', 
      date: '2026-02-16', 
      amount: '$150', 
      status: 'Pending',
      items: [
        { description: 'Brake Pad Replacement', cost: '$100' },
        { description: 'Brake Fluid Flush', cost: '$30' },
        { description: 'Labor', cost: '$20' }
      ]
    },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Invoice Paid', message: 'Your payment for inv-001 was successful.', time: '2h ago', read: false },
    { id: 2, title: 'Service Reminder', message: 'Toyota Camry is due for service in 5 days.', time: '1d ago', read: true },
    { id: 3, title: 'New Message', message: 'Garage manager sent you a message.', time: '3d ago', read: true },
  ]);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Springfield Ave, Springfield, IL 62704',
    vehicles: [
      { id: 1, name: 'Toyota Camry', year: '2022', primary: true },
      { id: 2, name: 'Honda CR-V', year: '2019', primary: false }
    ]
  });

  const handleVehicleChange = (id, field, value) => {
    setProfileData({
      ...profileData,
      vehicles: profileData.vehicles.map(v => v.id === id ? { ...v, [field]: value } : v)
    });
  };

  const addVehicle = () => {
    const newId = profileData.vehicles.length > 0 ? Math.max(...profileData.vehicles.map(v => v.id)) + 1 : 1;
    setProfileData({
      ...profileData,
      vehicles: [...profileData.vehicles, { id: newId, name: '', year: '', primary: false }]
    });
  };

  const removeVehicle = (id) => {
    setProfileData({
      ...profileData,
      vehicles: profileData.vehicles.filter(v => v.id !== id)
    });
  };

  const handlePrint = () => {
    if (!selectedInvoice) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the invoice.');
      return;
    }

    const itemsHtml = selectedInvoice.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.description}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${item.cost}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${selectedInvoice.id}</title>
          <style>
            body { font-family: sans-serif; color: #333; padding: 40px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .title { font-size: 24px; font-weight: bold; color: #1e293b; }
            .meta { text-align: right; }
            .label { font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .value { font-weight: bold; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #f8fafc; border-radius: 8px; overflow: hidden; }
            th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }
            .total-row { background: #f1f5f9; font-weight: bold; }
            .total-value { color: #3b82f6; font-size: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Invoice Details</div>
          </div>
          <div class="header">
            <div>
              <div class="label">Invoice To</div>
              <div class="value">${profileData.name}</div>
              <div style="font-size: 12px; color: #64748b; max-width: 200px;">${profileData.address}</div>
            </div>
            <div class="meta">
              <div class="label">Invoice #</div>
              <div class="value">${selectedInvoice.id}</div>
              <div class="label">Date</div>
              <div class="value">${selectedInvoice.date}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Cost</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td style="padding: 16px; font-weight: bold;">Total</td>
                <td style="padding: 16px; text-align: right; font-size: 20px; color: #3b82f6;">${selectedInvoice.amount}</td>
              </tr>
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async (invoice) => {
    const shareData = {
      title: `Invoice ${invoice.id}`,
      text: `Invoice for ${profileData.name} - Total: ${invoice.amount}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Invoice details copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.date.includes(searchQuery) ||
    invoice.amount.includes(searchQuery) ||
    invoice.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = () => {
    const headers = ['Invoice #', 'Date', 'Amount', 'Status'];
    const rows = invoices.map(inv => [inv.id, inv.date, inv.amount, inv.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "statement.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white">
            <Car size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#3B82F6]">AutoFix</span>
        </div>

        <nav className="flex-1">
          <SidebarItem 
            icon={FileText} 
            label="Invoices" 
            active={activeTab === 'Invoices'} 
            onClick={() => setActiveTab('Invoices')}
          />
        </nav>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium">Sign Out</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search job cards, invoices..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-blue-50/30' : ''}`}
                          onClick={() => {
                            setNotifications(notifications.map(notif => notif.id === n.id ? {...notif, read: true} : notif));
                          }}
                        >
                          {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={32} className="mx-auto mb-2 text-slate-200" />
                        <p className="text-sm text-slate-400">No new notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                    <button 
                      onClick={() => {
                        setActiveTab('Notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all"
              onClick={() => {
                setActiveTab('Profile');
                setShowNotifications(false);
              }}
            >
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{profileData.name}</p>
                <p className="text-xs text-slate-500">Customer - Springfield</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#E11D48] flex items-center justify-center text-white font-bold text-sm">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'Invoices' ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Invoices & Payments</h1>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B82F6] text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm"
                >
                  Download Statement
                </button>
              </div>

              {/* Stat Cards */}
              <div className="flex flex-wrap gap-6 mb-10">
                <StatCard 
                  label="Total Due" 
                  value="$150" 
                  icon={AlertCircle} 
                  iconColor="text-rose-500" 
                  iconBg="bg-rose-50" 
                />
                <StatCard 
                  label="Total Paid" 
                  value="$50" 
                  icon={CheckCircle2} 
                  iconColor="text-emerald-500" 
                  iconBg="bg-emerald-50" 
                />
                <StatCard 
                  label="Credits" 
                  value="$0" 
                  icon={Wallet} 
                  iconColor="text-blue-500" 
                  iconBg="bg-blue-50" 
                />
              </div>

              {/* Invoices Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-8 py-4">Invoice #</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-5 text-sm font-medium text-slate-600">{invoice.id}</td>
                          <td className="px-8 py-5 text-sm text-slate-500">{invoice.date}</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-900">{invoice.amount}</td>
                          <td className="px-8 py-5">
                            <StatusBadge status={invoice.status} />
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {invoice.status === 'Pending' ? (
                                <button 
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowPaymentModal(true);
                                  }}
                                  className="px-4 py-1.5 bg-[#3B82F6] text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-all"
                                >
                                  Pay Now
                                </button>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowInvoiceModal(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <FileText size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-10 text-center text-slate-400 text-sm italic">
                          No invoices found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : activeTab === 'Profile' ? (
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold text-slate-800 mb-8">My Profile</h1>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-full bg-[#E11D48] flex items-center justify-center text-white font-bold text-3xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="text-xl font-bold text-slate-900 border-b border-blue-500 focus:outline-none bg-slate-50 px-2 py-1 rounded"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-slate-900">{profileData.name}</h2>
                    )}
                    <p className="text-slate-500">Customer ID: CUST-8821</p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">Premium Member</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Email Address</p>
                        {isEditing ? (
                          <input 
                            type="email" 
                            className="w-full text-sm font-medium border-b border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 px-2 py-1 rounded"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-medium">{profileData.email}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="w-full text-sm font-medium border-b border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 px-2 py-1 rounded"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-medium">{profileData.phone}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Address</p>
                        {isEditing ? (
                          <textarea 
                            className="w-full text-sm font-medium border-b border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 px-2 py-1 rounded resize-none"
                            rows="2"
                            value={profileData.address}
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm font-medium">{profileData.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Details</h3>
                      {isEditing && (
                        <button 
                          onClick={addVehicle}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                        >
                          + Add Vehicle
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {profileData.vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="group relative flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Car size={20} className={vehicle.primary ? "text-blue-500" : "text-slate-400"} />
                          </div>
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Model Name"
                                  className="flex-1 text-sm font-bold border-b border-slate-200 focus:border-blue-500 focus:outline-none bg-transparent"
                                  value={vehicle.name}
                                  onChange={(e) => handleVehicleChange(vehicle.id, 'name', e.target.value)}
                                />
                                <input 
                                  type="text" 
                                  placeholder="Year"
                                  className="w-16 text-sm font-bold border-b border-slate-200 focus:border-blue-500 focus:outline-none bg-transparent"
                                  value={vehicle.year}
                                  onChange={(e) => handleVehicleChange(vehicle.id, 'year', e.target.value)}
                                />
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-slate-500">{vehicle.primary ? 'Primary Vehicle' : 'Secondary Vehicle'}</p>
                                <p className="text-sm font-bold">{vehicle.name} ({vehicle.year})</p>
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button 
                              onClick={() => removeVehicle(vehicle.id)}
                              className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <AlertCircle size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      {profileData.vehicles.length === 0 && (
                        <p className="text-sm text-slate-400 italic text-center py-4">No vehicles registered.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-3">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-[#3B82F6] text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'Notifications' ? (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800">All Notifications</h1>
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 ${!n.read ? 'bg-blue-50/20' : ''}`}
                        onClick={() => {
                          setNotifications(notifications.map(notif => notif.id === n.id ? {...notif, read: true} : notif));
                        }}
                      >
                        <div className={`p-3 rounded-xl ${!n.read ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Bell size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</h3>
                            <span className="text-xs text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-sm text-slate-500 mb-3">{n.message}</p>
                          {!n.read && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 uppercase tracking-wider">New</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bell size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No notifications yet</h3>
                    <p className="text-slate-500 text-sm">We'll notify you when something important happens.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
              <FileText size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-slate-600">Select an Option</h2>
              <p className="text-sm">Please select a category from the sidebar.</p>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {!paymentSuccess ? (
              <>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">Make Payment</h2>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8">
                  <p className="text-sm text-slate-500 mb-6">
                    Select a payment method for <span className="font-bold text-slate-900">{selectedInvoice.amount}</span>
                  </p>

                  <div className="space-y-3">
                    {[
                      { id: 'Credit Card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { id: 'Google Pay', icon: Wallet, color: 'text-slate-900', bg: 'bg-slate-100' },
                      { id: 'Apple Pay', icon: Smartphone, color: 'text-slate-900', bg: 'bg-slate-100' },
                      { id: 'Net Banking', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                    ].map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id 
                            ? 'border-blue-500 bg-blue-50/30' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${method.bg} ${method.color}`}>
                            <method.icon size={20} />
                          </div>
                          <span className="font-bold text-slate-700">{method.id}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === method.id ? 'border-blue-500' : 'border-slate-200'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      setInvoices(prev => prev.map(inv => 
                        inv.id === selectedInvoice.id ? { ...inv, status: 'Paid' } : inv
                      ));
                      setPaymentSuccess(true);
                    }}
                    className="w-full mt-8 py-4 bg-[#3B82F6] text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                  >
                    Pay {selectedInvoice.amount}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">Payment Successful</h2>
                  <button 
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentSuccess(false);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Confirmed!</h3>
                  <p className="text-slate-500 font-medium mb-1">Transaction ID: #TXN-476786</p>
                  <p className="text-sm text-slate-400 mb-8">A receipt has been sent to your email.</p>
                  
                  <button 
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentSuccess(false);
                    }}
                    className="w-full py-4 bg-[#1E293B] text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Invoice Details</h2>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between mb-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Invoice To</p>
                  <p className="font-bold text-slate-900">{profileData.name}</p>
                  <p className="text-xs text-slate-500 max-w-[180px] leading-relaxed mt-1">{profileData.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Invoice #</p>
                  <p className="font-bold text-slate-900">{selectedInvoice.id}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedInvoice.date}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60">
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.description}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{item.cost}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100/50">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">Total</td>
                      <td className="px-6 py-4 text-lg font-black text-[#3B82F6] text-right">{selectedInvoice.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-10 flex gap-3">
                <button 
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <Printer size={18} />
                  Print
                </button>
                <button 
                  onClick={() => handleShare(selectedInvoice)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
