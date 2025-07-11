import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  shopName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    null: false,
  },
  name: { type: String, required: true, null:false },
  category: { type: String , required: true, null:false},
  unit: { type: String, required:true, null:false }, // e.g., kg, pcs, bottle
  purchasePrice: { type: Number, required: true, null:false },
  sellingPrice: { type: Number, required: true , null:false},
  quantity: { type: Number, required: true , null:false},
  lowStockThreshold: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

const productModel = mongoose.models.product || mongoose.model("product",shopSchema);
export default productModel;