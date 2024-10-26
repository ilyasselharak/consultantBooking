import { model, Schema } from "mongoose";


interface IPermission {
  role: string;
  permissions: {
    isCreate: any;
    isUpdate: any;
    isDelete: any;
  };
}

const createPermissionSchema = () => ({
  User: { type: Boolean, default: false },
  Consultant: { type: Boolean, default: false },
  Transaction: { type: Boolean, default: false },
  Wallet: { type: Boolean, default: false },
  Availability: { type: Boolean, default: false },
  Permission: { type: Boolean, default: false },
  Ticket: { type: Boolean, default: false },
  Booking: { type: Boolean, default: false },
  Staff: { type: Boolean, default: false },
});

const permissionSchema = new Schema<IPermission>(
  {
    role: {
      type: String,
      enum: ["Manager", "Supervisor", "Agent"],
      required: true,
      unique: true,
    },
    permissions: {
      isCreate: createPermissionSchema(),
      isUpdate: createPermissionSchema(),
      isDelete: createPermissionSchema(),
    },
  },
  {
    timestamps: true,
  }
);


const Permission = model('Permission', permissionSchema);


export default Permission