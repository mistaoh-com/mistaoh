import mongoose, { Schema, Document, Model } from "mongoose"

export interface ILog extends Document {
    action: string
    userId?: mongoose.Types.ObjectId
    metadata?: any
    ip?: string
    userAgent?: string
    timestamp: Date
}

const LogSchema: Schema<ILog> = new Schema({
    action: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    metadata: {
        type: Schema.Types.Mixed,
    },
    ip: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const Log: Model<ILog> =
    mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema)

export default Log
