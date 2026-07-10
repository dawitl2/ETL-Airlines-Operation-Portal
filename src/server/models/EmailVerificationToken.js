import mongoose from 'mongoose'

const EmailVerificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

export const EmailVerificationToken =
  mongoose.models.EmailVerificationToken ||
  mongoose.model('EmailVerificationToken', EmailVerificationTokenSchema)
