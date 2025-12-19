import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AgentDashboard from './components/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import SOPEditor from './components/SOPEditor';
import { getSOPs, saveSOP, deleteSOP, getLogs, importSOPs } from './services/storageService';
import { SOP, AppView, SearchLog } from './types';
import { X, Lock, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AGENT_HOME);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sops, setSops] = useState<SOP[]>([]);
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
        const fetchedSOPs = await getSOPs();
        const fetchedLogs = await getLogs();
        setSops(fetchedSOPs);
        setLogs(fetchedLogs);
    } catch (e) {
        console.error("Failed to load data", e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleRoleToggle = () => {
    if (isAdmin) {
        setIsAdmin(false);
        setCurrentView(AppView.AGENT_HOME);
    } else {
        setShowLoginModal(true);
        setLoginError(false);
        setPasswordInput('');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput === "admin123") {
          setIsAdmin(true);
          setCurrentView(AppView.ADMIN_DASHBOARD);
          setSelectedSOP(null);
          setShowLoginModal(false);
          setPasswordInput('');
      } else {
          setLoginError(true);
      }
  };

  const handleSaveSOP = async (sop: SOP) => {
    setIsLoading(true);
    await saveSOP(sop);
    await loadData();
    setEditingSOP(null);
    setCurrentView(AppView.ADMIN_DASHBOARD);
    setIsLoading(false);
  };

  const handleDeleteSOP = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this SOP?')) {
      setIsLoading(true);
      await deleteSOP(id);
      await loadData();
      setIsLoading(false);
    }
  };
  
  const handleImportData = async (jsonContent: string) => {
      setIsLoading(true);
      const success = await importSOPs(jsonContent);
      if (success) {
          alert("Configuration imported to database successfully!");
          await loadData();
      } else {
          alert("Failed to import configuration.");
      }
      setIsLoading(false);
  };

  const handleStartCreate = () => {
    setEditingSOP(null);
    setCurrentView(AppView.ADMIN_EDITOR);
  };

  const handleStartEdit = (sop: SOP) => {
    setEditingSOP(sop);
    setCurrentView(AppView.ADMIN_EDITOR);
  };

  const handleSelectSOP = (sop: SOP) => {
    setSelectedSOP(sop);
    setCurrentView(AppView.AGENT_CHAT);
  };

  const handleViewChange = (view: AppView) => {
      setCurrentView(view);
      if (view === AppView.AGENT_HOME) {
          setSelectedSOP(null);
      }
  }

  // Loading Screen
  if (isLoading && sops.length === 0) {
      return (
          <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-gray-500 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={48} />
              <div className="text-center">
                  <p className="font-medium text-lg text-gray-800">Connecting to Database...</p>
                  <p className="text-sm">Please ensure your Firebase Config is set in services/firebase.ts</p>
              </div>
          </div>
      );
  }

  return (
    <>
        <Layout 
        currentView={currentView} 
        setView={handleViewChange} 
        isAdmin={isAdmin}
        toggleRole={handleRoleToggle}
        sops={sops}
        onSelectSop={handleSelectSOP}
        >
        {(currentView === AppView.AGENT_HOME || currentView === AppView.AGENT_CHAT) && (
            <AgentDashboard 
            viewMode={currentView === AppView.AGENT_HOME ? 'HOME' : 'CHAT'}
            sops={sops} 
            onSelectSOP={handleSelectSOP}
            selectedSOP={selectedSOP}
            />
        )}

        {currentView === AppView.ADMIN_DASHBOARD && (
            <AdminDashboard 
            sops={sops} 
            logs={logs}
            onCreateSOP={handleStartCreate}
            onEditSOP={handleStartEdit}
            onDeleteSOP={handleDeleteSOP}
            onImportData={handleImportData}
            />
        )}

        {currentView === AppView.ADMIN_EDITOR && (
            <SOPEditor 
            initialData={editingSOP} 
            onSave={handleSaveSOP} 
            onCancel={() => setCurrentView(AppView.ADMIN_DASHBOARD)} 
            />
        )}

        {showLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-bold">
                            <Lock size={18} /> Admin Access
                        </div>
                        <button onClick={() => setShowLoginModal(false)} className="hover:text-red-400 transition-colors"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleLoginSubmit} className="p-6">
                        <p className="text-gray-600 text-sm mb-4">Enter the administrator password to manage SOPs and view analytics.</p>
                        <div className="mb-4">
                            <input type="password" autoFocus className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${loginError ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:ring-blue-500'}`} placeholder="Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
                            {loginError && <p className="text-red-500 text-xs mt-1 font-medium">Incorrect password. Please try again.</p>}
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Login</button>
                        <p className="text-center mt-3 text-xs text-gray-400">Hint: admin123</p>
                    </form>
                </div>
            </div>
        )}
        </Layout>
        
        {isLoading && sops.length > 0 && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3 border border-gray-100">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <span className="font-medium text-gray-700">Syncing with database...</span>
                </div>
            </div>
        )}
    </>
  );
};

export default App;