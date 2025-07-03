import mongoose from 'mongoose';
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },

    options: {
        type: [String],
        required: true,
        validate: [(arr: any) => arr.length >= 2, 'At least two options are required']
    },
    questionImage: { type: String }, // Optional banner
    correctAnswer: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    },
    VideoSolutionUrl: {
        type: String,
        validate: {
            validator: function (url: any) {
                return !url || /^(http|https):\/\/[^ "]+$/.test(url);
            },
            message: 'Video solution URL must be a valid URL or null'
        }
    },
    subject: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['quiz', 'practice_paper'], // Enforce specific values
        required: true,
    },
    tags: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

export const Question = mongoose.model('Question', questionSchema);