



import { GoogleGenAI, Type } from "@google/genai";
import type { ForestDataInput, ForestWatchResponse, WasteDataInput, CircularEconomyResponse, PesProgram, GeneratedPesInsights, KnowledgeQueryResult, PlantAnalysisResult } from "../types";
import { SYSTEM_PROMPT, WASTE_SYSTEM_PROMPT, PES_SYSTEM_PROMPT, KNOWLEDGE_SYSTEM_PROMPT, BOTANIST_SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const forestResponseSchema = {
  type: Type.OBJECT,
  properties: {
    alerts: {
      type: Type.ARRAY,
      description: "A list of detected threats.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "Type of threat." },
          severity: { type: Type.STRING, description: "Severity of the threat." },
          location: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
            },
            required: ["lat", "lng"],
          },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 1." },
          threat_weight_score: { type: Type.NUMBER, description: "Calculated threat weight score from 0 to 1." },
          explanation: { type: Type.STRING, description: "Detailed explanation citing specific data points." },
          recommended_action: { type: Type.STRING, description: "Suggested response action." },
          supporting_evidence: {
            type: Type.OBJECT,
            properties: {
              satellite_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
              sensor_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
              report_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
        required: ["type", "severity", "location", "confidence", "threat_weight_score", "explanation", "recommended_action", "supporting_evidence"],
      },
    },
    summary: {
      type: Type.OBJECT,
      description: "An overall summary of forest health.",
      properties: {
        overall_forest_risk: { type: Type.STRING, description: "Overall risk level." },
        key_hotspots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of high-risk zones." },
        notable_patterns: { type: Type.STRING, description: "Observed trends or patterns." },
        recommended_priority_zones: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Zones needing immediate attention." },
      },
      required: ["overall_forest_risk", "key_hotspots", "notable_patterns", "recommended_priority_zones"],
    },
  },
  required: ["alerts", "summary"],
};

const wasteResponseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.OBJECT,
            properties: {
                efficiency_score: { type: Type.NUMBER },
                fraud_risk_level: { type: Type.STRING },
                suggested_route_optimization: { type: Type.STRING },
                economic_value_generated: { type: Type.NUMBER },
                carbon_offset_tonnes: { type: Type.NUMBER }
            },
            required: ["efficiency_score", "fraud_risk_level", "suggested_route_optimization", "economic_value_generated", "carbon_offset_tonnes"]
        },
        actionable_insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ["summary", "actionable_insights"]
};

const pesResponseSchema = {
    type: Type.OBJECT,
    properties: {
        suggestedPrograms: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    type: { type: Type.STRING }, // "forest" | "waste"
                    locationLabel: { type: Type.STRING },
                    metrics: {
                        type: Type.OBJECT,
                        properties: {
                            forestAlertsAvoided: { type: Type.NUMBER },
                            haMonitored: { type: Type.NUMBER },
                            wasteDiversionKg: { type: Type.NUMBER },
                            co2eAvoidedTons: { type: Type.NUMBER }
                        }
                    },
                    readinessScore: { type: Type.NUMBER },
                    indicativePaymentPerPeriodKes: { type: Type.NUMBER },
                    benefitSharing: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                stakeholder: { type: Type.STRING },
                                percentage: { type: Type.NUMBER }
                            },
                            required: ["stakeholder", "percentage"]
                        }
                    },
                    notes: { type: Type.STRING }
                },
                required: ["id", "name", "type", "locationLabel", "metrics", "readinessScore", "indicativePaymentPerPeriodKes", "benefitSharing", "notes"]
            }
        },
        narrativeSummary: { type: Type.STRING }
    },
    required: ["suggestedPrograms", "narrativeSummary"]
};

const knowledgeResponseSchema = {
    type: Type.OBJECT,
    properties: {
        answer: { type: Type.STRING },
        relatedSpecies: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["answer", "relatedSpecies", "suggestedActions"]
};

const botanistResponseSchema = {
    type: Type.OBJECT,
    properties: {
        commonName: { type: Type.STRING },
        scientificName: { type: Type.STRING },
        status: { type: Type.STRING },
        healthAssessment: { type: Type.STRING },
        preservationActions: { type: Type.ARRAY, items: { type: Type.STRING } },
        funFact: { type: Type.STRING }
    },
    required: ["commonName", "scientificName", "status", "healthAssessment", "preservationActions", "funFact"]
};


export const analyzeForestData = async (input: ForestDataInput): Promise<ForestWatchResponse> => {
  // Updated prompt to enforce specific referencing of data points
  const prompt = `Analyze the following forest monitoring data. \n\nCRITICAL: For every alert, your explanation MUST explicitly cite the specific data evidence (Sensor IDs with values, Report descriptions, Satellite IDs) that contributed to the threat detection. Do not be generic. State exactly what was observed.\n\nDATA:\n${JSON.stringify(input)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: forestResponseSchema,
        temperature: 0.1,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ForestWatchResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during analysis.");
  }
};

export const analyzeWasteData = async (input: WasteDataInput): Promise<CircularEconomyResponse> => {
    const prompt = `Analyze the following circular economy data for waste collection. \n\nDATA:\n${JSON.stringify(input)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: WASTE_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: wasteResponseSchema,
                temperature: 0.1,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as CircularEconomyResponse;
        result.timestamp = new Date().toISOString();
        return result;
    } catch (error) {
        console.error("Error calling Gemini API for waste analysis:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during waste analysis.");
    }
};

export const analyzePesOpportunities = async (input: {
    forestAnalysis: ForestWatchResponse | null;
    wasteAnalysis: CircularEconomyResponse | null;
    forestInput: ForestDataInput;
    wasteInput: WasteDataInput;
    existingPrograms: PesProgram[];
}): Promise<GeneratedPesInsights> => {
    const prompt = `Review the current environmental analysis data and existing PES programs. Identify new opportunities or improvements.\n\nCONTEXT:\n${JSON.stringify(input)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: PES_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: pesResponseSchema,
                temperature: 0.3, // Slightly higher creativity for policy suggestions
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeneratedPesInsights;
    } catch (error) {
        console.error("Error calling Gemini API for PES analysis:", error);
        if (error instanceof Error) {
             throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during PES analysis.");
    }
};

export const queryKnowledgeBase = async (query: string): Promise<KnowledgeQueryResult> => {
    const prompt = `User Query: ${query}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: KNOWLEDGE_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: knowledgeResponseSchema,
                temperature: 0.4, 
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as KnowledgeQueryResult;
    } catch (error) {
        console.error("Error calling Gemini API for Knowledge Hub:", error);
        if (error instanceof Error) {
             throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred.");
    }
};

export const identifyPlant = async (base64Image: string, location?: { lat: number, lng: number }): Promise<PlantAnalysisResult> => {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg'
        }
    };

    const prompt = location 
        ? `Identify this plant found at coordinates ${location.lat}, ${location.lng}. Provide conservation advice.`
        : `Identify this plant and provide conservation advice.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [imagePart, { text: prompt }]
            },
            config: {
                systemInstruction: BOTANIST_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: botanistResponseSchema,
                temperature: 0.2
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PlantAnalysisResult;
    } catch (error) {
        console.error("Error calling Gemini API for Plant Identification:", error);
         if (error instanceof Error) {
             throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred.");
    }
};