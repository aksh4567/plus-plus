import mongoose from 'mongoose';

const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    tags: {
        type: String,
        enum: ['array', 'linkedList', 'graph', 'dp', 'string', 'math'],
        required: true,
    },

    visibleTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            explanation: { type: String, required: true },
        },
    ],

    hiddenTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
        },
    ],

    startCode: [
        {
            language: { type: String, required: true },
            initialCode: { type: String, required: true },
        },
    ],

    referenceSolution: [ //if user se input test cases liye, to inn inputs ko mai apne ref-sol ko dedunga taki output aa sake
        {
            language: { type: String, required: true },
            completeCode: { type: String, required: true },//ye actual solution hai - real solution hai - paid user ko dikha dia sol
        },
    ],

    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User', // our local User model
        required: true,
    },
});

const Problem =
    mongoose.models.Problem || mongoose.model('Problem', problemSchema);

export default Problem;
