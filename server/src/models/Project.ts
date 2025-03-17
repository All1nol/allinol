import mongoose, { Document, Schema } from 'mongoose';

export enum ProjectStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    ON_HOLD = 'on_hold',
    CANCELLED = 'cancelled'
}

export interface IProject extends Document {
    name: string;
    description: string;
    color: string;
    createdAt: Date;
    status: ProjectStatus;
    startDate: Date;
    endDate: Date;
    owner: string;
    members: string[];
    tasks: string[];
    tags: string[];
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: {
        type: String,
        required: [true, 'Project color is required'],
        default: '#808080', 
    },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ProjectStatus, default: ProjectStatus.ACTIVE },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    tags: [{ type: String }]
});

ProjectSchema.index({ status: 1 });
ProjectSchema.index({ startDate: 1 });
ProjectSchema.index({ endDate: 1 });
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ members: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
