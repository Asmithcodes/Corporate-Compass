import { GoogleGenAI } from "@google/genai";
import { Company, CompanyStatus } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const jsonSchemaString = `
{
  "name": "string", // The full name of the company or project.
  "status": "string", // The current development status (e.g., Established, Under Development).
  "location": "string", // The city and state/country of the company.
  "description": "string", // A brief one-sentence summary of what the company does or the project entails.
  "investment": "string", // Proposed or known investment amount, if applicable. 'N/A' if unknown.
  "website": "string", // The official, real, and working website URL. 'N/A' if not found.
  "googleMapsUrl": "string", // A direct Google Maps URL for the company's location. 'N/A' if not applicable.
  "employeeCount": "string | number", // The estimated number of employees. 'N/A' if unknown.
  "establishedYear": "number | null" // The year the company was established. null if unknown.
}
`;


export const generateCompanyList = async (
  domain: string,
  location: string,
  statuses: CompanyStatus[],
  existingCompanyNames: string[] = [],
  useThinkingMode: boolean = false
): Promise<Company[]> => {
  let exclusionPrompt = '';
  if (existingCompanyNames.length > 0) {
    exclusionPrompt = `
      Please provide a new set of companies. CRUCIALLY, DO NOT include any of the following companies that have already been listed:
      - ${existingCompanyNames.join('\n- ')}
    `;
  }
  
  const prompt = `
    Based on real-world, verifiable public data from Google Search and Google Maps, generate a list of real companies in the "${domain}" industry within a 200km radius of "${location}".
    Only include companies with the following statuses: ${statuses.join(", ")}.
    For each company, provide its details, including the number of employees and the year it was established. The website URL must be a real, working link. Do not invent any information.
    ${exclusionPrompt}
    Return the result as a valid JSON array of objects. Each object in the array must conform to the following structure:
    ${jsonSchemaString}
    If no new companies are found, return an empty array [].
  `;
  
  const modelName = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

  const modelConfig = {
    tools: [{ googleSearch: {} }, { googleMaps: {} }],
    seed: 42,
    ...(useThinkingMode && { thinkingConfig: { thinkingBudget: 32768 } }),
  };

  let toolConfig = {};
  const isCoords = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(location);
  if (isCoords) {
    const [latitude, longitude] = location.split(',').map(s => parseFloat(s.trim()));
    toolConfig = {
      retrievalConfig: {
        latLng: { latitude, longitude }
      }
    };
  }


  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: modelConfig,
      ...(Object.keys(toolConfig).length > 0 && { toolConfig }),
    });
    
    let jsonText = response.text.trim();

    // The model might wrap the JSON in markdown backticks, so we clean it up.
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.substring(3, jsonText.length - 3).trim();
    }

    if (!jsonText) {
      return [];
    }

    const parsedData = JSON.parse(jsonText) as Company[];
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && (error.message.includes('json') || error instanceof SyntaxError)) {
        throw new Error("The AI returned an invalid format. This can happen with complex queries. Please try again.");
    }
    throw new Error("Failed to fetch data from the AI service. The grounding service may be temporarily unavailable.");
  }
};