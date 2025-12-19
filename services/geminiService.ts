import { GoogleGenAI } from "@google/genai";
import { SOP } from '../types';

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const askAiAssistant = async (query: string, contextSOPs: SOP[]): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Create a context string from the available SOPs
    // In a real app with many SOPs, we would use vector search to find relevant chunks first.
    // Here we dump the context since it's a demo with small data.
    const contextText = contextSOPs.map(sop => `
      ID: ${sop.id}
      Title: ${sop.title}
      Category: ${sop.category}
      Content: ${sop.content}
      ---
    `).join('\n');

    const prompt = `
      You are an expert Customer Support Assistant for a company. 
      Answer the agent's question based strictly on the provided Standard Operating Procedures (SOPs) context below.
      
      Rules:
      1. If the answer is found in the SOPs, provide a concise, step-by-step instruction.
      2. If the answer is NOT in the SOPs, state clearly: "Information not available in current SOPs."
      3. You can answer in Bengali or English based on the language the user asked in.
      4. Cite the SOP Title if relevant.
      
      Question: ${query}

      Context SOPs:
      ${contextText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Assistant. Please check your API key or internet connection.";
  }
};