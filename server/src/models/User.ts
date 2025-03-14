import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    profilePicture?: string;
    bio?: string;
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            // TODO Validate email format
        },  
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long']
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },
        isActive: {
            type: Boolean, 
            default: true
        },
        profilePicture: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [500, 'Bio must be less than 500 characters']
        }
    },
    {
        timestamps: true    
    }
)

// Add indexes for frequently queried fields
// UserSchema.index({ username: 1 }); // Username queries
// UserSchema.index({ email: 1 }); // Email queries
// UserSchema.index({ isActive: 1 }); // Active user queries

export default mongoose.model<IUser>('User', UserSchema);
