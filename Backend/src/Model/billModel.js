import mongoose, { Schema } from "mongoose";

const billSchema = new mongoose.Schema({
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    null: false,
  },
  customer: { type: Schema.Types.ObjectId, ref: "Customer", default: null },
  billItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        null: false,
      },
      quantity: { type: Number, required: true, null: false },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  paidAmount: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
  isQuickBill: { type: Boolean, default: false },
  billDate: { type: Date, default: Date.now },
});

const billModel = mongoose.models.bill || mongoose.model("Bill", billSchema);

export default billModel;
