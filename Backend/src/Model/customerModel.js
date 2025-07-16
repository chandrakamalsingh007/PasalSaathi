import mongoose, { Schema } from "mongoose";

const customerSchema = new mongoose.Schema({
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    null: false,
  },
  name: { type: String, required: true, null: false },
  email: { type: String, required: true, null: false },
  phone: { type: String, required: true, null: false },
  address: { type: String, required: true, null: false },
  customerNo: { type: Number, required: true, null: false },
  hashedId: { type: String, required: true, null: false },
  totalDue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

customerSchema.index({ shop: 1, customerNo: 1 }, { unique: true });

const customerModel =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default customerModel;
