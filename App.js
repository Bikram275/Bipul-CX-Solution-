
import React, { useState, useEffect } from 'react';
import htm from 'htm';
import * as Lucide from 'lucide-react';
import Layout from './components/Layout.js';
import AgentDashboard from './components/AgentDashboard.js';
import AdminDashboard from './components/AdminDashboard.js';
import SOPEditor from './components/SOPEditor.js';
import { getSOPs, saveSOP, deleteSOP, importSOPs } from './services/storageService.js';

const html = htm.bind(React.createElement);

export default function App() {
  const [currentView, setCurrentView] = useState('AGENT_HOME');
  const [isAdmin, setIsAdmin] = useState(false);
  const [sops, setSops] = useState([]);
  const [editingSOP, setEditingSOP] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    const fetchedSOPs = await getSOPs();
    setSops(fetchedSOPs);
    setIsLoading(false);
  };

  const handleRoleToggle = () => {
    if (isAdmin) {
        setIsAdmin(false);
        setCurrentView('AGENT_HOME');
    } else {
        setShowLoginModal(true);
        setLoginError(false);
        setPasswordInput('');
    }
  };

  const handleLoginSubmit = (e) => {
      e.preventDefault();
      if (passwordInput === "admin123") {
          setIsAdmin(true);
          setCurrentView('ADMIN_DASHBOARD');
          setSelectedSOP(null);
          setShowLoginModal(false);
          setPasswordInput('');
      } else {
          setLoginError(true);
      }
  };

  const handleSaveSOP = async (sop) => {
    setIsLoading(true);
    await saveSOP(sop);
    await loadData();
    setEditingSOP(null);
    setCurrentView('ADMIN_DASHBOARD');
    setIsLoading(false);
  };

  const handleDeleteSOP = async (id) => {
    if (window.confirm('Are you sure? This action is irreversible.')) {
      setIsLoading(true);
      const success = await deleteSOP(id);
      if (success) {
        // Force state update by filtering local list and then re-loading to be safe
        setSops(prev => prev.filter(s => s.id !== id));
        await loadData(); 
      }
      setIsLoading(false);
    }
  };

  const handleImportData = async (json) => {
      setIsLoading(true);
      if (await importSOPs(json)) {
          alert("Database successfully updated!");
          await loadData();
      } else {
          alert("Failed to update database. Invalid format.");
      }
      setIsLoading(false);
  };

  const handleSelectSop = (sop) => {
      setSelectedSOP(sop);
      setCurrentView('AGENT_CHAT');
  };

  const handleViewChange = (view) => {
      setCurrentView(view);
      if (view === 'AGENT_HOME') {
          setSelectedSOP(null);
      }
  };

  if (isLoading && sops.length === 0) {
      return html`
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-6">
            <${Lucide.Loader2} className="animate-spin text-blue-600" size=${56} />
            <div className="text-center">
                <p className="font-black text-2xl text-slate-800 tracking-tight uppercase">Initializing</p>
                <p className="text-sm font-bold mt-1 text-slate-400 uppercase tracking-widest">Connecting Data Layer</p>
            </div>
        </div>`;
  }

  return html`
    <${Layout} 
        currentView=${currentView} 
        setView=${handleViewChange} 
        isAdmin=${isAdmin}
        toggleRole=${handleRoleToggle}
        sops=${sops}
        onSelectSop=${handleSelectSop}
    >
        ${(currentView === 'AGENT_HOME' || currentView === 'AGENT_CHAT') && html`
            <${AgentDashboard} 
                viewMode=${currentView === 'AGENT_HOME' ? 'HOME' : 'CHAT'}
                sops=${sops} 
                onSelectSOP=${handleSelectSop}
                selectedSOP=${selectedSOP}
                onImportData=${handleImportData}
            />
        `}

        ${currentView === 'ADMIN_DASHBOARD' && html`
            <${AdminDashboard} 
                sops=${sops} 
                onCreateSOP=${() => { setEditingSOP(null); setCurrentView('ADMIN_EDITOR'); }}
                onEditSOP=${(s) => { setEditingSOP(s); setCurrentView('ADMIN_EDITOR'); }}
                onDeleteSOP=${handleDeleteSOP}
                onImportData=${handleImportData}
            />
        `}

        ${currentView === 'ADMIN_EDITOR' && html`
            <${SOPEditor} 
                initialData=${editingSOP} 
                onSave=${handleSaveSOP} 
                onCancel=${() => setCurrentView('ADMIN_DASHBOARD')} 
            />
        `}

        ${showLoginModal && html`
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4">
                <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                        <div className="flex items-center gap-4 font-black text-2xl tracking-tighter uppercase">
                          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <${Lucide.Lock} size=${20} />
                          </div>
                          Console Auth
                        </div>
                        <button onClick=${() => setShowLoginModal(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors"><${Lucide.X} size=${28} /><//>
                    </div>
                    <form onSubmit=${handleLoginSubmit} className="p-10 space-y-8">
                        <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-widest">Master password required for system modifications.</p>
                        <div>
                          <input type="password" autoFocus className="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-mono text-center text-2xl tracking-widest" placeholder="••••••••" value=${passwordInput} onChange=${(e) => setPasswordInput(e.target.value)} />
                          ${loginError && html`<p className="text-red-500 text-xs mt-4 font-black text-center uppercase tracking-widest animate-pulse">Credentials Denied</p>`}
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest active:scale-95">Open Session</button>
                    </form>
                </div>
            </div>
        `}
    <//>`;
}
