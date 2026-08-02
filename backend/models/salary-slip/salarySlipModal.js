import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  ifscCode: { type: String, required: true },
});

const salaryHistorySchema = new mongoose.Schema({
  month: { type: String, required: true },
  salary: { type: mongoose.Schema.Types.Decimal128, required: true },
  paidOn: { type: Date, required: true },
  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "Cheque", "Cash"],
    default: "Bank Transfer",
  },
  notes: { type: String },
});

const addressSchema = new mongoose.Schema({
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
});

const salarySlipSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },
    employeeCode: { type: String, unique: true, required: false },
    designation: { type: String, required: true },
    department: { type: String },
    salary: { type: mongoose.Schema.Types.Decimal128, required: true },
    salaryHistory: [salaryHistorySchema],
    contactNumber: { type: String },
    status: {
      type: String,
      enum: ["active", "onLeave", "resigned", "terminated"],
      default: "active",
    },
    bankDetails: bankDetailsSchema,
    address: addressSchema,
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

salarySlipSchema.pre("save", async function (next) {
  if (!this.employeeCode) {
    const count = await mongoose.models.SalarySlip.countDocuments();
    this.employeeCode = `EMP-${(count + 1).toString().padStart(5, "0")}`;
  }
  next();
});

const SalarySlip = mongoose.model("SalarySlip", salarySlipSchema);
export default SalarySlip;
