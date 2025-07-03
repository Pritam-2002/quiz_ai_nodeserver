import { parse } from "path";
import { Question } from "../model/question.model"
import { streamUpload } from "../utils/cloudinaryUpload";
import { Request, Response } from "express";



interface MulterRequest extends Request {
    file: Express.Multer.File;
}
export const CreateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {

        // const { question, options, correctAnswer, explanation, VideoSolutionUrl, subject, type, tags } = req.body;
        const payload = req.body.questions || req.body;
        const multerrequest = req as MulterRequest

        const questionList = Array.isArray(payload) ? payload : [payload];
        const createdQuestions = [];

        for (let q of questionList) {
            const {
                question,
                options,
                correctAnswer,
                explanation,
                VideoSolutionUrl,
                subject,
                type,
                tags
            } = q;


            const resultImage = await streamUpload(multerrequest.file.buffer, "questionImages");
            // Basic validation for required fields
            if (!question || !options || !correctAnswer || !explanation || !subject || !type) {
                res.status(400).json({ error: "Missing required fields: question, options, correctAnswer, explanation, subject, type." });
                return; // Important to return after sending response
            }



            let parsedOptions: any;

            try {
                parsedOptions = typeof options === "string" ? JSON.parse(options) : options;
            } catch (err) {
                res.status(400).json({ error: "Invalid options format." });
                return
            }

            let optionArray: string[];

            if (Array.isArray(parsedOptions)) {
                optionArray = parsedOptions;
            } else if (typeof parsedOptions === 'object') {
                optionArray = Object.values(parsedOptions);
            } else {
                res.status(400).json({ error: "Options must be an array or object with string values." });
                return
            }

            if (!optionArray.includes(correctAnswer)) {
                console.log(optionArray)
                res.status(400).json({ error: "Correct answer must be one of the provided options." });
                return
            }


            // Create the new question document
            const newQuestion = await Question.create({
                question,
                options: optionArray,
                questionImage: resultImage.secure_url,
                correctAnswer,
                explanation,
                VideoSolutionUrl,
                subject,
                type, // Use the new 'type' field
                tags: tags || [], // Default to empty array if tags are not provided
            });

            res.status(201).json({ message: "Question created successfully", question: newQuestion });
        }
    } catch (error: any) {
        console.log("Error creating question:", error); // Use console.error for errors
        // Mongoose validation errors

        res.status(500).json({ error: error.message });

    }
};

export const UpdateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const multerReq = req as MulterRequest;
        const { id } = req.params;

        // Find the existing question
        const existingQuestion = await Question.findById(id);
        if (!existingQuestion) {
            res.status(404).json({ error: "Question not found." });
            return;
        }

        // Handle file upload if new image provided
        if (multerReq.file) {
            const resultImage = await streamUpload(multerReq.file.buffer, "questionImages");
            existingQuestion.questionImage = resultImage.secure_url;
        }

        const { question, options, correctAnswer, explanation, VideoSolutionUrl, subject, type, tags } = req.body;

        const updates: any = {};

        if (question) updates.question = question;
        if (options) {
            const parsedOptions = typeof options === "string" ? JSON.parse(options) : options;
            if (!Array.isArray(parsedOptions) || parsedOptions.length < 2) {
                res.status(400).json({ error: "Options must be an array with at least two elements." });
                return;
            }
            updates.options = parsedOptions;
        }

        if (correctAnswer) {
            if (updates.options && !updates.options.includes(correctAnswer)) {
                res.status(400).json({ error: "Correct answer must be one of the updated options." });
                return;
            }
            updates.correctAnswer = correctAnswer;
        }

        if (explanation) updates.explanation = explanation;
        if (VideoSolutionUrl) updates.VideoSolutionUrl = VideoSolutionUrl;
        if (subject) updates.subject = subject;
        if (type) updates.type = type;
        if (tags) updates.tags = typeof tags === "string" ? JSON.parse(tags) : tags;

        Object.assign(existingQuestion, updates);
        await existingQuestion.save();

        res.status(200).json({ message: "Question updated successfully", question: existingQuestion });

    } catch (error: any) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: "Failed to update question: " + error.message });
    }
};

export const ValidateAnswer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { userAnswer } = req.body;

        if (!userAnswer) {
            res.status(400).json({ error: "userAnswer is required in the request body." });
            return;
        }

        const question = await Question.findById(id);

        if (!question) {
            res.status(404).json({ error: "Question not found." });
            return;
        }

        const isCorrect = question.correctAnswer === userAnswer;

        res.status(200).json({
            questionId: id,
            isCorrect,

            explanation: question.explanation,
            VideoSolutionUrl: question.VideoSolutionUrl,
            correctAnswer: isCorrect ? undefined : question.correctAnswer, // Optional: Only return correct answer if wrong
            message: isCorrect ? "Correct answer!" : "Incorrect answer.",
        });

    } catch (error: any) {
        console.error("Error validating answer:", error);
        res.status(500).json({ error: "Failed to validate answer: " + error.message });
    }
};



export const GetQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
        // You can add query parameters for filtering (e.g., by subject, type, tags)
        const { subject, type, tag } = req.query;
        const query: any = {};

        if (subject) {
            query.subject = subject;
        }
        if (type) {
            query.type = type; // Filter by quiz or practice_paper
        }
        if (tag) {
            query.tags = tag; // Filter by a specific tag
        }

        const questions = await Question.find(query).sort({ createdAt: -1 });

        if (questions.length === 0) {
            res.status(404).json({ message: "No questions found matching your criteria." });
            return;
        }

        res.status(200).json({ message: "Questions fetched successfully", questions });

    } catch (error: any) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: 'Failed to fetch questions: ' + error.message });
    }
};