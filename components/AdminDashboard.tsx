import React, { useState, useRef, useEffect } from 'react';
import { SearchLog, SOP, CATEGORIES } from '../types';
import { Edit2, Trash2, Plus, Filter, Download, Upload, Settings, Save, X } from 'lucide-react';

interface AdminDashboardProps {
  sops: SOP[];
  logs: SearchLog[];
  onEditSOP: (sop: SOP) => void;
  onCreateSOP: () => void;
  onDeleteSOP: (id: string) => void;
  onImportData: (fileContent: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ sops, logs, onEditSOP, onCreateSOP, onDeleteSOP, onImportData }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [scriptUrl, setScriptUrl] = useState('');

  useEffect(() => {
      // Load saved script URL from local storage on mount
      const savedUrl = localStorage.getItem('GOOGLE_SCRIPT_URL');
      if (savedUrl) setScriptUrl(savedUrl);
  }, []);

  const saveSettings = () => {
      localStorage.setItem('GOOGLE_SCRIPT_URL', scriptUrl);
      setShowSettings(false);
      alert('Integration settings saved!');
  };

  // Analytics Data Preparation
  const viewsData = sops
    .filter(s => s.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(s => ({
        name: s.id.length > 25 ? s.id.substring(0, 25) + '...' : s.id,
        views: s.views,
    }));

  const maxViews = Math.max(...viewsData.map(v => v.views), 1);

  const filteredSops = sops.filter(sop => {
      if (filterCategory !== 'All' && sop.category !== filterCategory) return false;
      return true;
  });

  const handleExport = () => {
    // Create a Blob from the data
    const dataStr = JSON.stringify(sops, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to download
    const link = document.createElement('a');
    link.href = url;
    link.download = `SOP_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
          if(window.confirm("This will overwrite all current SOP data with the imported file. Are you sure?")) {
            onImportData(content);
          }
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pt-4 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
           <p className="text-gray-500">Total Queries: {sops.length}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 self-end md:self-auto">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
            />

            <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                title="Google Sheet Integration Settings"
            >
                <Settings size={18} />
            </button>

            <button 
                onClick={handleImportClick}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                title="Upload JSON file to update database"
            >
                <Upload size={18} />
                <span className="hidden sm:inline">Import</span>
            </button>

            <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                title="Download JSON file to share"
            >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
            </button>

            <button 
                onClick={onCreateSOP}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
                <Plus size={18} />
                Add Query
            </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Top Viewed Queries</h3>
            <div className="space-y-4">
                {viewsData.map((item, idx) => (
                    <div key={idx} className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                                {item.name}
                            </span>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-blue-600">
                                    {item.views} Views
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-50">
                            <div 
                                style={{ width: `${(item.views / maxViews) * 100}%` }} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                            ></div>
                        </div>
                    </div>
                ))}
                {viewsData.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No data available yet. Start clicking queries!</p>}
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Query List</h3>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-sm border-gray-300 border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 shadow-sm z-10">
                    <tr>
                        <th className="px-6 py-3">Query ID / Title</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3 text-center">Views</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSops.map((sop) => (
                        <tr key={sop.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-3 font-medium text-gray-900 break-all">{sop.title}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                    ${sop.category === 'Return' ? 'bg-red-100 text-red-800' : 
                                      sop.category === 'Delivered' ? 'bg-green-100 text-green-800' :
                                      sop.category === 'Exchange' ? 'bg-orange-100 text-orange-800' :
                                      'bg-gray-100 text-gray-800'}`}>
                                    {sop.category}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-center text-gray-500">{sop.views}</td>
                            <td className="px-6 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => onEditSOP(sop)}
                                        className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                                        title="Edit Content"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteSOP(sop.id)}
                                        className="p-1.5 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredSops.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                No queries found in this category.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Integration Modal */}
        {showSettings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 font-bold">
                            <Settings size={18} />
                            Integration Settings
                        </div>
                        <button onClick={() => setShowSettings(false)} className="hover:text-red-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 mb-2">Google Sheet Integration</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Paste the <strong>Web App URL</strong> of your deployed Google Apps Script here. 
                                When you save a query, the text will be automatically sent to your Google Sheet.
                            </p>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Web App URL</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                                placeholder="https://script.google.com/macros/s/..."
                                value={scriptUrl}
                                onChange={(e) => setScriptUrl(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={saveSettings}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                            >
                                <Save size={16} />
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;