
export type DocField = {
     path: string;
     type; string;
     description?: string;
};

// Interface for fields sent to Lambda
export interface Field {
     path: string;
     type: string;
}

// Interface for the response received from the AI (Gemini)
export interface AIResponseField {
     path: string;
     description: string;
     // If AI can also return type, add it here, e.g., type?: string;
}

// Interface for items in your 'result' state
export interface ResultItem {
     path: string;
     type: string;
     description?: string; // description is optional as it might be added later
     fromAI?: boolean;   // fromAI is optional/added later
     // Add other properties if your initial 'result' objects have them
}

export interface MarkdownItem {
     path: string;
     type: string;
     description: string; // Explicitly REQUIRED for markdown generation
}