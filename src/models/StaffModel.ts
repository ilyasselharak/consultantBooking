import { ObjectId, Schema, model } from "mongoose";


export interface IStaff {
    fullName: string;
    email: string;
    password: string;
    role: "SuperAdmin" | "Manager" | "Supervisor" | "Agent";
    permissionsId: ObjectId;
    verified: boolean;
    token: string | null;
    expireDate: Date | null;
    image: {
        url: string | null;
        public_id: string | null;
    };
    phoneNumber: string;
    address: string;
    createdAt: Date;
 }

const staffSchema = new Schema<IStaff>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["SuperAdmin", "Manager", "Supervisor", "Agent"],
            required: true,
        },
        permissionsId: {
            type: Schema.Types.ObjectId,
            ref: "Permission",
            default: null,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
            default: null,
        },
        expireDate: {
            type: Date,
            default: null,
        },
        image: {
            url: {
                type: String,
                default: null,
            },
            public_id: {
                type: String,
                default: null,
            },
        },
        phoneNumber: {
            type: String,
            default: null,
        },
    }, {
        timestamps: true,
})


const Staff = model('Staff', staffSchema);
export default Staff