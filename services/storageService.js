
import { INITIAL_SOPS } from '../types.js';

const LOCAL_STORAGE_KEY = 'sop_genius_data_v2';

export const getSOPs = async () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SOPS));
    return INITIAL_SOPS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse local storage data", e);
    return INITIAL_SOPS;
  }
};

export const saveSOP = async (sop) => {
  const sops = await getSOPs();
  const index = sops.findIndex(s => s.id === (sop.id || sop.title));
  if (index > -1) {
    sops[index] = { ...sops[index], ...sop, lastUpdated: new Date().toISOString() };
  } else {
    sops.push({ ...sop, views: 0, lastUpdated: new Date().toISOString() });
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sops));
};

export const deleteSOP = async (id) => {
  const sops = await getSOPs();
  const filtered = sops.filter(s => s.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const importSOPs = async (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (e) {
    console.error("Import failed", e);
    return false;
  }
};

export const exportSOPs = async () => {
  const sops = await getSOPs();
  return JSON.stringify(sops, null, 2);
};

export const incrementView = async (id) => {
  const sops = await getSOPs();
  const sop = sops.find(s => s.id === id);
  if (sop) {
    sop.views = (sop.views || 0) + 1;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sops));
  }
};
