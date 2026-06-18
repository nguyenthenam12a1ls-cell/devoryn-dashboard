import mongoose,{Schema} from "mongoose"

export enum Status {
    TODO = "todo",
    IN_PROGRESS = "in-progress",
    DONE = "done",
};

export enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
};

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.TODO
    },
    priority: {
        type: String,
        enum: Object.values(Priority),
        default: Priority.MEDIUM
    },
    dueDate: {
        type: Date,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;