import mongoose from 'mongoose';

const { Schema } = mongoose;

const submissionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        problemId: {
            type: Schema.Types.ObjectId,
            ref: 'Problem',
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
            enum: ['javascript', 'c++', 'java'],
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'wrong', 'error'],
            default: 'pending',
        },
        runtime: {
            type: Number, // ms
            default: 0,
        },
        memory: {
            type: Number, // kB
            default: 0,
        },
        errorMessage: {
            type: String,
            default: '',
        },
        testCasesPassed: {
            type: Number,
            default: 0,
        },
        testCasesTotal: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Each user–problem pair unique (latest submission wins)
submissionSchema.index({ userId: 1, problemId: 1 });

const Submission =
    mongoose.models.Submission ||
    mongoose.model('Submission', submissionSchema);

export default Submission;
