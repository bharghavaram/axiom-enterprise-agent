
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPT = `
You are AXIOM, a multi-agent autonomous intelligence system for enterprise workflow planning. 
You act as a team consisting of:
1. Agent Planner: Identifies goals and structures the analysis.
2. Agent BA (Business Analyst): Extracts detailed functional and non-functional requirements.
3. Agent PM (Project Manager): Breaks down work into tasks, dependencies, and timelines.
4. Agent Strategy: Identifies strategic risks and provides implementation insights.
5. Agent Critic: Evaluates the entire output for consistency and logic.

Your task is to take a business document (provided as text) and produce a high-fidelity JSON analysis.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    summary: { type: Type.STRING },
    requirements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING }
        },
        required: ["id", "title", "description", "priority"]
      }
    },
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          duration: { type: Type.STRING },
          dependencies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "name", "duration"]
      }
    },
    timeline: { type: Type.STRING },
    workflowMermaid: { type: Type.STRING, description: "A Mermaid.js flowchart-v2 syntax string representing the process flow." },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          impact: { type: Type.STRING },
          mitigation: { type: Type.STRING }
        }
      }
    },
    insights: { type: Type.ARRAY, items: { type: Type.STRING } },
    criticFeedback: { type: Type.STRING, description: "Feedback from the Critic agent on gaps or improvements." }
  },
  required: ["projectName", "summary", "requirements", "tasks", "workflowMermaid", "risks", "insights", "criticFeedback"]
};

export async function analyzeBusinessDocument(content: string): Promise<AnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Input Document Content: \n\n ${content}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini analysis failed:", error);
    
    // Categorize errors for better UI feedback
    if (error.message?.includes('429')) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    } else if (error.message?.includes('503') || error.message?.includes('504')) {
      throw new Error('SERVICE_OVERLOADED');
    } else if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
      throw new Error('CONTENT_BLOCKED');
    } else if (error.message?.includes('invalid') || error.message?.includes('400')) {
      throw new Error('INVALID_INPUT');
    }
    
    throw error;
  }
}
