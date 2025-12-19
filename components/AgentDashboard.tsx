import React, { useState, useEffect, useRef } from 'react';
import { SOP, FlowStep, FlowOption } from '../types';
import { Zap, RotateCcw, CheckCircle2 } from 'lucide-react';
import { incrementView } from '../services/storageService';

interface AgentDashboardProps {
  viewMode: 'HOME' | 'CHAT';
  selectedSOP: SOP | null;
  onSelectSOP: (sop: SOP) => void;
  sops: SOP[];
}

// Interface to track the state of a step in the active session
interface ActiveStep extends FlowStep {
  selectedOptionLabel?: string; // Which option did the user click?
}

const QUICK_ACCESS_IDS = [
    "Forward_fake_and_wrong_update_by_courier",
    "Delay_delivery_After_TAT",
    "Counterfeit_Fake_Duplicate_Product_Received"
];

const AgentDashboard: React.FC<AgentDashboardProps> = ({ viewMode, selectedSOP, onSelectSOP, sops }) => {
  // Instead of a flat text history, we store the full step objects to allow re-rendering and editing
  const [sessionSteps, setSessionSteps] = useState<ActiveStep[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Find Quick Access SOPs
  // Ensure we get the latest version from the sops prop
  const quickAccessSOPs = QUICK_ACCESS_IDS.map(id => sops.find(s => s.id === id)).filter(Boolean) as SOP[];

  useEffect(() => {
    if (viewMode === 'CHAT' && selectedSOP) {
      incrementView(selectedSOP.id);
      initializeSession(selectedSOP);
    }
  }, [selectedSOP, viewMode]);

  // Scroll to bottom when steps change, but only if it's adding a new step (length increased)
  useEffect(() => {
      if (sessionSteps.length > 0) {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [sessionSteps.length]);

  const generateId = () => Math.floor(100000 + Math.random() * 900000).toString();

  const processText = (text: string) => {
      // We generate ID once per session usually, but here dynamic is fine for the demo
      return text.replace(/{{UNIQUE_ID}}/g, generateId());
  };

  const initializeSession = (sop: SOP) => {
    if (sop.flowSteps && sop.flowSteps.length > 0) {
        // Interactive Flow
        const startStep = sop.flowSteps.find(step => step.id === 'START') || sop.flowSteps[0];
        setSessionSteps([{ ...startStep, message: processText(startStep.message) }]);
    } else {
        // Standard SOP (Text Content)
        let solution = '';
        
        // CHECK: If the Admin has saved content, USE IT.
        if (sop.content && sop.content.trim().length > 0) {
            // Replace newlines with <br /> for basic display if it's plain text
            solution = sop.content.replace(/\n/g, '<br />');
        } else {
            // Only use fallback if content is strictly empty
            solution = `আপনার ${sop.title} সংক্রান্ত সমস্যার জন্য আমরা দুঃখিত। আমরা আপনার অভিযোগটি সিস্টেমে নথিভুক্ত করেছি। সমাধানের জন্য দয়া করে পরবর্তী ২৪ থেকে ৪৮ ঘণ্টা অপেক্ষা করুন। আমাদের দল এই বিষয়ে আপনার সঙ্গে যোগাযোগ করবে। (<span class="bold">Unique ID: {{UNIQUE_ID}}</span>)`;
        }
        
        // Process Placeholders
        solution = processText(solution);
        
        const genericStep: ActiveStep = {
            id: 'GENERIC_SOLUTION',
            message: solution,
            options: [],
            isFinal: true
        };
        setSessionSteps([genericStep]);
    }
  };

  const handleOptionClick = (stepIndex: number, option: FlowOption) => {
    if (!selectedSOP?.flowSteps) return;

    // 1. Create a copy of the history up to the step where the click happened
    // This effectively "Rewinds" if the user clicks a previous step
    const newHistory = sessionSteps.slice(0, stepIndex + 1);

    // 2. Update the selected option for the current step
    newHistory[stepIndex] = {
        ...newHistory[stepIndex],
        selectedOptionLabel: option.label
    };

    // 3. Determine Next Step
    if (option.nextStepId === 'ENDED') {
        // Just end here
        setSessionSteps(newHistory);
        return;
    }

    const nextStepDef = selectedSOP.flowSteps.find(s => s.id === option.nextStepId);
    if (nextStepDef) {
        // Add the next step to the history
        newHistory.push({ 
            ...nextStepDef, 
            message: processText(nextStepDef.message) // Process ID only when step is added
        });
    }

    setSessionSteps(newHistory);
  };

  if (viewMode === 'HOME') {
    return (
      <div className="max-w-4xl mx-auto pt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Agent,</h1>
        <p className="text-gray-500 mb-10">Select a query from the menu or use Quick Access below.</p>

        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Zap className="text-yellow-500 fill-yellow-500" />
            Quick Access Queries
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessSOPs.map(sop => (
                <button 
                    key={sop.id}
                    onClick={() => onSelectSOP(sop)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all text-left group"
                >
                    <div className="font-bold text-gray-800 group-hover:text-blue-600 mb-2 break-words">
                        {sop.title.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-gray-400 font-mono bg-gray-50 inline-block px-2 py-1 rounded">
                        {sop.id}
                    </div>
                </button>
            ))}
        </div>
      </div>
    );
  }

  // Interactive Flow / Standard SOP View
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px] flex flex-col">
       {/* Header */}
       <div className="p-4 border-b border-gray-100 bg-slate-50 rounded-t-xl flex justify-between items-center sticky top-16 z-10">
            <div>
                <h2 className="font-bold text-gray-800 break-words max-w-lg">{selectedSOP?.title}</h2>
                <span className="text-xs text-blue-600 font-mono">{selectedSOP?.id} {selectedSOP?.flowSteps ? '(Interactive)' : '(Standard)'}</span>
            </div>
            <button 
                onClick={() => selectedSOP && initializeSession(selectedSOP)}
                className="p-2 hover:bg-slate-200 rounded-full text-gray-500 transition-colors"
                title="Restart Process"
            >
                <RotateCcw size={18} />
            </button>
       </div>

       {/* Steps Container */}
       <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/30">
            {sessionSteps.map((step, index) => (
                <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Bot Message Bubble */}
                    <div className={`rounded-xl p-5 shadow-sm mb-4 border ${step.isFinal ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'}`}>
                        {step.isFinal && (
                             <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-200 text-green-700 font-bold uppercase text-xs tracking-wider">
                                <CheckCircle2 size={16} />
                                <span>FINAL SOLUTION FOR AGENT</span>
                             </div>
                        )}
                        <div 
                            className="text-gray-800 text-sm leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: step.message }} 
                        />
                    </div>

                    {/* Options Grid (Rendered for EVERY step to allow changing history) */}
                    {!step.isFinal && step.options.length > 0 && (
                        <div className="pl-4 border-l-2 border-gray-200 ml-4 space-y-2">
                             <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
                                {step.selectedOptionLabel ? `Step ${index + 1}: Select Option to Change` : `Step ${index + 1}: Choose Option`}
                             </p>
                             <div className="flex flex-wrap gap-3">
                                {step.options.map((option, optIdx) => {
                                    const isSelected = step.selectedOptionLabel === option.label;
                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleOptionClick(index, option)}
                                            className={`
                                                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                                                ${isSelected 
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-400'
                                                }
                                            `}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                             </div>
                        </div>
                    )}
                </div>
            ))}
            
            <div ref={bottomRef} />
       </div>
    </div>
  );
};

export default AgentDashboard;