import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Settings, 
  ShieldCheck,
  Menu, 
  X, 
  Wallet,
  AlertTriangle,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AdminWidgets } from './components/AdminWidgets';
import { ContractPlayground } from './components/ContractPlayground';
import { TransactionHistory } from './components/TransactionHistory';
import { KycFileUpload } from './components/KycFileUpload';

// Dashboard Overview with Liquidation Monitor integrated
const DashboardOverview = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Total Volume', value: '$128,430.00', change: '+12.5%' },
        { label: 'Active Deposits', value: '42', change: '+3' },
        { label: 'Pending Withdrawals', value: '18', change: '-2' },
      ].map((stat, i) => (
        <div key={i} className="glass-card p-6">
          <p className="text-slate-400 text-sm">{stat.label}</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold font-display">{stat.value}</h3>
            <span className={`text-xs ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Real-time Liquidation Monitor Panel */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-400" />
            Liquidation Vaults & Health Factor Monitoring
          </h3>
          <p className="text-xs text-slate-400">
            Real-time pool solvency tracking. Vaults with Health Factor &lt; 1.1 are highlighted in red for liquidators.
          </p>
        </div>
      </div>
      <AdminWidgets />
    </div>
  </div>
);

const SEP24Flow = ({ type }: { type: 'deposit' | 'withdraw' }) => {
  const [step, setStep] = useState(1);
  const [uploadedKyc, setUploadedKyc] = useState(false);
  
  return (
    <div className="max-w-2xl mx-auto glass-card p-8">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-slate-800 text-slate-500'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-20 h-1 bg-slate-800 mx-2 ${step > s ? 'bg-primary' : ''}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold font-display">{type === 'deposit' ? 'Deposit' : 'Withdraw'} Assets</h2>
            <p className="text-slate-400">Select the asset you want to {type === 'deposit' ? 'deposit into' : 'withdraw from'} your Stellar wallet.</p>
            <div className="grid grid-cols-1 gap-3">
              {['USDC', 'EURT', 'ARST'].map((asset) => (
                <button 
                  key={asset}
                  onClick={() => setStep(2)}
                  className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                      {asset[0]}
                    </div>
                    <span>{asset}</span>
                  </div>
                  <ArrowUpRight size={18} className="text-slate-500" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold font-display">SEP-12 Identity Verification</h2>
              <p className="text-slate-400 text-sm mt-1">
                Please upload required KYC identification to satisfy compliance rules before initiating your {type}.
              </p>
            </div>

            <KycFileUpload 
              documentTypeLabel="Government Photo ID (Passport or Driver's License)"
              onUploadComplete={() => setUploadedKyc(true)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="btn-primary"
              >
                {uploadedKyc ? 'Continue to Confirmation' : 'Skip & Continue'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-bold font-display mb-2">Transaction Initiated</h2>
            <p className="text-slate-400 mb-8">Your {type} request has been submitted. You will be notified once the anchor processes your status.</p>
            <button 
              onClick={() => setStep(1)}
              className="text-primary hover:underline font-medium"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'liquidation', icon: AlertTriangle, label: 'Liquidation Vaults' },
    { id: 'playground', icon: Terminal, label: 'Contract Caller' },
    { id: 'deposit', icon: ArrowDownLeft, label: 'Deposit' },
    { id: 'withdraw', icon: ArrowUpRight, label: 'Withdraw' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'kyc', icon: ShieldCheck, label: 'KYC Documents' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-slate-800 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-primary rounded-lg">
              <ArrowUpRight size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight">AnchorPoint</h1>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Institutional Admin</p>
              <p className="text-xs text-slate-500">v0.1.0-alpha</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">Mainnet Connected</span>
            </div>
            <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
              <Wallet size={18} />
              <span className="text-sm font-medium">Connect Wallet</span>
            </button>
          </div>
        </header>

        <section className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-display">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="text-slate-400 mt-1">
              {activeTab === 'dashboard' && 'Manage your anchor operations, volume, and monitor vault health factors.'}
              {activeTab === 'liquidation' && 'Real-time vault risk factor monitoring and 1-click liquidator triggers.'}
              {activeTab === 'playground' && 'Directly invoke and test Soroban smart contract methods.'}
              {activeTab === 'deposit' && 'Initiate a new on-ramp transaction via SEP-24.'}
              {activeTab === 'withdraw' && 'Initiate a new off-ramp transaction via SEP-24.'}
              {activeTab === 'history' && 'Track historical and pending transactions with 60 FPS row virtualization.'}
              {activeTab === 'kyc' && 'SEP-12 Identity and customer verification document upload center.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardOverview />}
              {activeTab === 'liquidation' && <AdminWidgets />}
              {activeTab === 'playground' && <ContractPlayground />}
              {activeTab === 'deposit' && <SEP24Flow type="deposit" />}
              {activeTab === 'withdraw' && <SEP24Flow type="withdraw" />}
              {activeTab === 'history' && <TransactionHistory />}
              {activeTab === 'kyc' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="glass-card p-6 border border-slate-800">
                    <h3 className="text-lg font-bold font-display mb-1 text-slate-100">
                      Customer KYC Verification Documents (SEP-12)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload your identity documentation. Files are verified for format, size, and encrypted client-side.
                    </p>
                  </div>
                  <KycFileUpload documentTypeLabel="Government Photo ID (Passport or Driver's License)" />
                  <KycFileUpload documentTypeLabel="Proof of Residence (Utility Bill, Bank Statement < 3 months)" />
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold mb-4">Branding Customization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        <input type="color" defaultValue="#3b82f6" className="w-10 h-10 border-0 bg-transparent cursor-pointer" />
                        <input type="text" value="#3b82f6" readOnly className="input-field flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Accent Color</label>
                      <div className="flex gap-2">
                        <input type="color" defaultValue="#8b5cf6" className="w-10 h-10 border-0 bg-transparent cursor-pointer" />
                        <input type="text" value="#8b5cf6" readOnly className="input-field flex-1" />
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary mt-8">Apply Changes</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default App;
