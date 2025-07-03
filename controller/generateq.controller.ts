import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

export const generateQuestions = async (req: any, res: any) => {
    const { topic, numQuestions } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Generate ${numQuestions} high-quality multiple-choice questions on the topic "${topic}".
Each question must include:

- A "question" string
- An array of 4 "options"
- A "correctAnswer" that exactly matches one of the options
- An "explanation" string that justifies the correct answer

Return the response as a JSON array in the following format:

[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "Berlin", "Rome", "Madrid"],
    "correctAnswer": "Paris",
    "explanation": "Paris is the capital city of France."
  },
  ...
]

Make sure:
- There are no markdown characters
- The format is valid JSON
`;


        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const jsonStart = text.indexOf("[");
        const jsonEnd = text.lastIndexOf("]") + 1;
        const jsonString = text.slice(jsonStart, jsonEnd);

        const questions = JSON.parse(jsonString);
        res.json({ questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate questions." });
    }
};
