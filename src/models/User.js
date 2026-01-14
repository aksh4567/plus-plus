import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        // Clerk user id (string, e.g. "user_2Xv..."), main foreign key
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // Core profile data synced from Clerk
        firstName: {
            type: String,
            minLength: 1,
            maxLength: 50,
        },
        lastName: {
            type: String,
            minLength: 1,
            maxLength: 50,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            immutable: true,
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        // Problems this user has solved (ObjectId → problem)
        problemSolved: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Problem',
            },
        ],

        // Any extra app-specific fields you want
        // e.g. rating, streak, coins, etc.

    },
    {
        timestamps: true,
    }
);

// Cascade delete submissions when user is deleted
userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('Submission').deleteMany({ userId: userInfo._id });
    }
});

const User =
    mongoose.models.User || mongoose.model('User', userSchema);

export default User;
