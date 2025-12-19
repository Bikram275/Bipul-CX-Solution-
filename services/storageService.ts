import { SOP, SearchLog, INITIAL_SOPS } from '../types';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, limit, addDoc } from 'firebase/firestore';

// Collection References
const SOPS_COLLECTION = 'sops';
const LOGS_COLLECTION = 'logs';

export const getSOPs = async (): Promise<SOP[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, SOPS_COLLECTION));
    const sops: SOP[] = [];
    
    querySnapshot.forEach((doc) => {
      sops.push(doc.data() as SOP);
    });

    // If database is empty, seed it with INITIAL_SOPS
    if (sops.length === 0) {
      console.log("Database empty, seeding initial data...");
      const batchPromises = INITIAL_SOPS.map(sop => saveSOP(sop));
      await Promise.all(batchPromises);
      return INITIAL_SOPS.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sops.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error getting SOPs from DB:", error);
    // Fallback to local data if DB connection fails (or config is missing)
    return INITIAL_SOPS;
  }
};

// Helper function to sync to Google Sheet
const syncToGoogleSheet = async (sop: SOP) => {
    const scriptUrl = localStorage.getItem('GOOGLE_SCRIPT_URL');
    if (!scriptUrl) return;

    try {
        // We must use no-cors because Google Apps Scripts don't support CORS headers in simple requests
        await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                id: sop.id,
                title: sop.title,
                category: sop.category,
                content: sop.content,
                flowSteps: sop.flowSteps ? JSON.stringify(sop.flowSteps) : '',
                lastUpdated: sop.lastUpdated
            })
        });
        console.log("Synced to Google Sheet");
    } catch (e) {
        console.error("Failed to sync to Google Sheet", e);
    }
};

export const saveSOP = async (sop: SOP): Promise<void> => {
  try {
    // 1. Save to Firebase (The Backend)
    await setDoc(doc(db, SOPS_COLLECTION, sop.id), sop);
    
    // 2. Sync to Google Sheet (Optional Integration)
    syncToGoogleSheet(sop);

  } catch (error) {
    console.error("Error saving SOP:", error);
    throw error;
  }
};

export const deleteSOP = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SOPS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting SOP:", error);
    throw error;
  }
};

export const exportSOPs = async (): Promise<string> => {
    const sops = await getSOPs();
    return JSON.stringify(sops, null, 2);
};

export const importSOPs = async (jsonString: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) return false;
    
    const validData = data.filter(item => item.id && item.title);
    
    const uploadPromises = validData.map(sop => saveSOP(sop as SOP));
    await Promise.all(uploadPromises);
    
    return true;
  } catch (error) {
    console.error("Import failed", error);
    return false;
  }
};

export const incrementView = async (id: string): Promise<void> => {
    // In a real app, use: updateDoc(doc(db, 'sops', id), { views: increment(1) });
    // For this demo, we skip detailed view counting to avoid complexity
};

export const getLogs = async (): Promise<SearchLog[]> => {
  try {
    const q = query(collection(db, LOGS_COLLECTION), orderBy("timestamp", "desc"), limit(100));
    const snapshot = await getDocs(q);
    const logs: SearchLog[] = [];
    snapshot.forEach(doc => logs.push(doc.data() as SearchLog));
    return logs;
  } catch (e) {
      console.warn("Logs fetch failed", e);
      return [];
  }
};

export const addLog = async (queryText: string, foundResults: boolean): Promise<void> => {
  try {
      const newLog: SearchLog = {
        id: Date.now().toString(),
        query: queryText,
        timestamp: new Date().toISOString(),
        foundResults,
      };
      await addDoc(collection(db, LOGS_COLLECTION), newLog);
  } catch (e) {
      console.warn("Could not save log", e);
  }
};