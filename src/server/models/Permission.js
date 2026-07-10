import mongoose from 'mongoose'

const PermissionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
  },
  { timestamps: false },
)

export const Permission =
  mongoose.models.Permission || mongoose.model('Permission', PermissionSchema)
