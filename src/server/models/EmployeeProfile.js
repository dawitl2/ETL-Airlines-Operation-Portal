import mongoose from 'mongoose'

const EmployeeProfileSchema = new mongoose.Schema(
  {
    employeeNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    baseAirport: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    employmentStatus: { type: String, default: 'ACTIVE' },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile' },
    qualifications: [{ type: String }],
  },
  { timestamps: true },
)

export const EmployeeProfile =
  mongoose.models.EmployeeProfile || mongoose.model('EmployeeProfile', EmployeeProfileSchema)
