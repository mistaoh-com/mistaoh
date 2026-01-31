import mongoose, { Schema, Document, Model } from "mongoose"

export interface IAddOnOption {
    id: string
    name: string
    price: number
}

export interface IAddOn {
    title: string
    type: "checkbox" | "radio"
    required?: boolean
    options: IAddOnOption[]
}

export interface IMenuItem extends Document {
    title: string
    korean: string
    price: number
    vegetarian?: boolean
    glutenFree?: boolean
    spicyLevel?: "mild" | "medium"
    description: string
    image?: string
    notOrderable?: boolean
    category: string
    isAlcoholic?: boolean // From category level
    menuType: "lunch" | "dinner" | "drinks"
    addOns?: IAddOn[]
    createdAt: Date
    updatedAt: Date
}

const AddOnOptionSchema = new Schema({
    id: String,
    name: String,
    price: Number
}, { _id: false })

const AddOnSchema = new Schema({
    title: String,
    type: {
        type: String,
        enum: ["checkbox", "radio"]
    },
    required: Boolean,
    options: [AddOnOptionSchema]
}, { _id: false })

const MenuItemSchema: Schema<IMenuItem> = new Schema(
    {
        title: { type: String, required: true },
        korean: String,
        price: { type: Number, required: true },
        vegetarian: Boolean,
        glutenFree: Boolean,
        spicyLevel: {
            type: String,
            enum: ["mild", "medium"]
        },
        description: String,
        image: String,
        notOrderable: Boolean,
        category: { type: String, required: true, index: true },
        isAlcoholic: Boolean,
        menuType: {
            type: String,
            required: true,
            enum: ["lunch", "dinner", "drinks"],
            index: true
        },
        addOns: [AddOnSchema]
    },
    {
        timestamps: true,
    }
)

// Compound index for efficient querying
MenuItemSchema.index({ menuType: 1, category: 1 });

const MenuItem: Model<IMenuItem> =
    mongoose.models.MenuItem || mongoose.model<IMenuItem>("MenuItem", MenuItemSchema)

export default MenuItem
