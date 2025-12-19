
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
        setSops(prev => prev.filter(s => s.id !== id));
        await loadData(); 
      }
      setIsLoading(false);
    }
  };

  const handleImportData = async (json) => {
      setIsLoading(true);
      if (await importSOPs(json)) {
          alert("Knowledge base successfully synchronized!");
          await loadData();
      } else {
          alert("Synchronization failed. Invalid data structure.");
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
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-500 gap-10">
            <div className="relative">
               <${Lucide.Loader2} className="animate-spin text-indigo-500" size=${80} />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
               </div>
            </div>
            <div className="text-center space-y-4">
                <p className="font-black text-4xl text-white tracking-tighter uppercase brand-gradient">Cx Solution By Bipul</p>
                <div className="flex items-center justify-center gap-3">
                   <span className="w-12 h-0.5 bg-indigo-500"></span>
                   <p className="text-sm font-black text-slate-500 uppercase tracking-[0.5em]">Secure Authentication</p>
                   <span className="w-12 h-0.5 bg-indigo-500"></span>
                </div>
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4">
                <div className="bg-white rounded-[3.5rem] shadow-[0_0_100px_rgba(99,102,241,0.2)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="bg-slate-900 p-12 flex flex-col items-center text-white relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-rose-500"></div>
                        <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8 transform -rotate-6">
                            <${Lucide.ShieldEllipsis} size=${40} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase brand-gradient">Security Gate</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Cx Solution By Bipul</p>
                    </div>
                    <form onSubmit=${handleLoginSubmit} className="p-12 space-y-10">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Console Key</label>
                          <input type="password" autoFocus className="w-full px-10 py-6 bg-slate-50 border-4 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-500 transition-all font-mono text-center text-3xl tracking-[0.5em] shadow-inner" placeholder="••••" value=${passwordInput} onChange=${(e) => setPasswordInput(e.target.value)} />
                          ${loginError && html`<p className="text-rose-500 text-[10px] font-black text-center uppercase tracking-widest animate-shake">Identity Verification Failed</p>`}
                        </div>
                        <div className="flex flex-col gap-4">
                          <button type="submit" className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest active:scale-95 text-lg">Initialize Session</button>
                          <button type="button" onClick=${() => setShowLoginModal(false)} className="w-full text-slate-400 font-bold py-2 text-xs uppercase tracking-widest hover:text-slate-600">Cancel Access Request</button>
                        </div>
                    </form>
                </div>
            </div>
        `}
    <//>`;
}
