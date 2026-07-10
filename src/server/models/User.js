import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    employeeProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile', required: true },
    accountStatus: {
      type: String,
      enum: ['INVITED', 'ACTIVE', 'SUSPENDED', 'LOCKED', 'DISABLED'],
      default: 'INVITED',
    },
    emailVerified: { type: Boolean, default: false },
    failedLoginCount: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    passwordChangedAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
