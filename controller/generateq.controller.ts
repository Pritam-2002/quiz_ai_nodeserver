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

Each question object must include the following keys:
- "question": A clear and concise question string.
- "options": An array of exactly 4 possible answers (strings).
- "correctAnswer": One of the options, exactly matching one of the entries in the "options" array.
- "explanation": A brief explanation that justifies why the answer is correct.
- "subject": Use "${topic}" as the subject.
- "tags": Include relevant keywords or concepts from the topic "${topic}" as an array of strings.

Format your response as a pure JSON array like below (no markdown, no extra commentary):

[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "Berlin", "Rome", "Madrid"],
    "correctAnswer": "Paris",
    "explanation": "Paris is the capital city of France.",
    "subject": "Geography",
    "tags": ["France", "capital", "Europe"]
  },
  ...
]
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
