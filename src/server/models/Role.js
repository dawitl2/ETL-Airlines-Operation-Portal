import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'SYSTEM_ADMIN',
        'OPERATIONS_MANAGER',
        'CREW_SCHEDULER',
        'SUPERVISOR',
        'FLIGHT_CREW',
        'MAINTENANCE_TECHNICIAN',
      ],
    },
    description: { type: String },
    permissionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    isSystemRole: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema)
