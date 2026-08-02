import mongoose from "mongoose";
import Counter from "../counterModal.js";

const courseSubSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
});

const installmentSchema = new mongoose.Schema({
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
});

const invoiceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    courses: [courseSubSchema],

    invoiceNumber: { type: String, unique: true, index: true },

    paymentMode: {
      type: String,
      enum: ["Cash", "Bank", "UPI", "Cheque"],
      required: true,
    },
    paymentDate: { type: Date, default: Date.now, index: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
      index: true,
    },

    discount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    taxes: {
      cgst: { type: mongoose.Schema.Types.Decimal128, default: 0 },
      sgst: { type: mongoose.Schema.Types.Decimal128, default: 0 },
      igst: { type: mongoose.Schema.Types.Decimal128, default: 0 },
      otherTaxes: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    },

    totalAmount: { type: mongoose.Schema.Types.Decimal128 },
    paidAmount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    dueAmount: { type: mongoose.Schema.Types.Decimal128, default: 0 },

    installments: [installmentSchema],

    notes: { type: String, trim: true },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },

    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", async function (next) {
  const invoice = this;

  if (!invoice.invoiceNumber) {
    const year = new Date().getFullYear();
    const counter = await Counter.findOneAndUpdate(
      { _id: `invoice-${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    invoice.invoiceNumber = `INV-${year}-${counter.seq
      .toString()
      .padStart(5, "0")}`;
  }

  const coursesTotal = invoice.courses.reduce(
    (sum, c) => sum + parseFloat(c.amount.toString() || 0),
    0
  );
  const discount = parseFloat(invoice.discount.toString() || 0);
  const cgst = parseFloat(invoice.taxes?.cgst.toString() || 0);
  const sgst = parseFloat(invoice.taxes?.sgst.toString() || 0);
  const igst = parseFloat(invoice.taxes?.igst.toString() || 0);
  const otherTaxes = parseFloat(invoice.taxes?.otherTaxes.toString() || 0);

  const total = coursesTotal - discount + cgst + sgst + igst + otherTaxes;
  invoice.totalAmount = mongoose.Types.Decimal128.fromString(total.toFixed(2));

  const paid = parseFloat(invoice.paidAmount?.toString() || 0);
  invoice.dueAmount = mongoose.Types.Decimal128.fromString(
    (total - paid).toFixed(2)
  );

  next();
});

invoiceSchema.index({
  invoiceNumber: 1,
  studentId: 1,
  "courses.courseId": 1,
  paymentStatus: 1,
  paymentDate: 1,
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
