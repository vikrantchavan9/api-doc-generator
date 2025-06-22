
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
}

// Interface for items in your 'result' state
export interface ResultItem {
     path: string;
     type: string;
     description?: string;
     fromAI?: boolean;

}