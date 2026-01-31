import mongoose, { Schema, Document, Model } from "mongoose"

export interface IOrder extends Document {
    user?: mongoose.Types.ObjectId
    guestInfo?: {
        name: string
        email: string
        phone: string
    }
    items: Array<{
        title: string
        quantity: number
        price: number
        id?: string
    }>
    totalAmount: number
    status: "PENDING" | "PAID" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED"
    stripeSessionId?: string
    paymentStatus?: string
    createdAt: Date
}

const ItemSchema = new Schema({
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    id: String
}, { _id: false })

const OrderSchema: Schema<IOrder> = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        guestInfo: {
            name: String,
            email: String,
            phone: String,
        },
        items: [ItemSchema],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "PAID", "PREPARING", "READY", "COMPLETED", "CANCELLED"],
            default: "PENDING",
        },
        stripeSessionId: String,
        paymentStatus: String,
    },
    {
        timestamps: true,
    }
)

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order
