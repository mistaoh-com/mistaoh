import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    name: string
    email: string
    password: string
    phone: string
    isVerified: boolean
    verificationToken?: string
    verificationTokenExpiry?: Date
    createdAt: Date
    provider: "email" | "google"
    googleId?: string
    phoneVerified: boolean
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        password: {
            type: String,
            required: function (this: IUser) {
                return this.provider === "email"
            },
        },
        phone: {
            type: String,
            required: function (this: IUser) {
                return this.provider === "email"
            },
        },
        isVerified: {
            type: Boolean,
            default: function (this: IUser) {
                return this.provider === "google"
            },
        },
        verificationToken: String,
        verificationTokenExpiry: Date,
        provider: {
            type: String,
            enum: ["email", "google"],
            default: "email",
        },
        googleId: {
            type: String,
            index: true,
        },
        phoneVerified: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
