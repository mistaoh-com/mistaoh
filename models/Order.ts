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
        selectedAddOns?: Array<{
            id: string
            name: string
            price: number
        }>
    }>
    totalAmount: number
    subtotal?: number
    taxAmount?: number
    taxRate?: number
    status: "PENDING" | "PAID" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED"
    stripeSessionId?: string
    paymentStatus?: string
    guestToken?: string
    createdAt: Date
}

const AddOnSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
}, { _id: false })

const ItemSchema = new Schema({
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    id: String,
    selectedAddOns: [AddOnSchema]
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
        subtotal: {
            type: Number,
        },
        taxAmount: {
            type: Number,
        },
        taxRate: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["PENDING", "PAID", "PREPARING", "READY", "COMPLETED", "CANCELLED"],
            default: "PENDING",
        },
        stripeSessionId: String,
        paymentStatus: String,
        guestToken: String,
    },
    {
        timestamps: true,
    }
)

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order
