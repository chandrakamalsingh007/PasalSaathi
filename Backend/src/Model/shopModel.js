import mongoose from "mongoose";


const shopSchema = new mongoose.Schema({
  shopName : {type:String, required: true, null:false},
  ownerName: { type: String, required: true, null: false },
  email: { type: String, required: true, unique: true, null: false },
  phone: { type: String, required: true, null: false },
  ownerAddress: {type:String, required:true, null:false},
  shopAddress: {type:String, required:true, null: false},
  password: { type: String, required: true, null: false },

});

const shopModel = mongoose.models.User || mongoose.model("Shop",shopSchema);
export default shopModel;