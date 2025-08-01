import { createGoogleGenerativeAI } from "@ai-sdk/google";

const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVEAI_API_KEY;

export const google = createGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
});
