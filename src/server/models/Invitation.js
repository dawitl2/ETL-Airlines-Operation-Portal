import mongoose from 'mongoose'

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  employeeProfileData: { type: Object, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  acceptedAt: { type: Date },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
})

export const Invitation =
  mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema)
