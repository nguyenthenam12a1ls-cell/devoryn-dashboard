import mongoose, {Schema} from "mongoose";
import UserModel from "../models/User";
const projectSchema = new Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    }, 
    description: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
}, {timestamps: true});

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;