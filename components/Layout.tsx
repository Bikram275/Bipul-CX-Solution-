import React, { useState } from 'react';
import { Home, Menu, X, Search, ShieldCheck, Filter } from 'lucide-react';
import { AppView, SOP, CATEGORIES } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  isAdmin: boolean;
  toggleRole: () => void;
  sops: SOP[];
  onSelectSop: (sop: SOP) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setView, 
  isAdmin, 
  toggleRole,
  sops,
  onSelectSop
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategory, setMenuCategory] = useState('All');

  const filteredSops = sops
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(menuSearch.toLowerCase());
        const matchesCategory = menuCategory === 'All' || s.category === menuCategory;
        return matchesSearch && matchesCategory;
    });

  const handleHomeClick = () => {
    setView(AppView.AGENT_HOME);
    setIsMenuOpen(false);
  };

  const handleSopClick = (sop: SOP) => {
    onSelectSop(sop);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-40 h-16 flex items-center justify-between px-4">
        {/* Left: Home + Admin */}
        <div className="flex items-center gap-3">
            <button 
                onClick={handleHomeClick}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium border border-transparent hover:border-blue-100"
            >
                <Home size={20} />
                <span className="hidden sm:inline">Home</span>
            </button>

            {/* Admin Button moved here */}
            <button 
                onClick={toggleRole}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium border ${isAdmin ? 'bg-red-50 text-red-600 border-red-100' : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}
                title={isAdmin ? "Exit Admin Panel" : "Enter Admin Panel"}
            >
                <ShieldCheck size={20} />
                <span className="hidden sm:inline">{isAdmin ? 'Exit Admin' : 'Admin Panel'}</span>
            </button>
        </div>

        {/* Right: Translate, Menu */}
        <div className="flex items-center gap-4">
            {/* Google Translate Widget Placeholder */}
            <div id="google_translate_element" className="mr-2 min-w-[100px] text-right"></div>

            <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
                <Menu size={20} />
                <span>All Disposition</span>
            </button>
        </div>
      </header>

      {/* Slide-Out Menu */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <h2 className="font-bold text-lg">All Dispositions</h2>
            <button onClick={() => setIsMenuOpen(false)} className="hover:bg-slate-700 p-1 rounded">
                <X size={24} />
            </button>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-200 shrink-0 space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search query..." 
                    className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
                <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <select
                    className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 appearance-none"
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
                {filteredSops.map((sop, index) => (
                    <button
                        key={sop.id}
                        onClick={() => handleSopClick(sop)}
                        className="w-full text-left px-3 py-2.5 hover:bg-blue-50 rounded-md text-sm text-gray-700 hover:text-blue-700 transition-colors flex gap-3 border-b border-gray-100 last:border-0"
                    >
                        <span className="text-gray-400 font-mono w-8 text-right shrink-0">{index + 1}.</span>
                        <span className="break-words font-medium">{sop.title}</span>
                    </button>
                ))}
                {filteredSops.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                        No queries found
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Overlay for Menu */}
      {isMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="pt-20 px-4 md:px-8 pb-8 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;