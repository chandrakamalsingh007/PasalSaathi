import mongoose from "mongoose";


const shopSchema = new mongoose.Schema({
  shopName : {type:String, required: true, null:false},
  OwnerName: { type: String, required: true, null: false },
  email: { type: String, required: true, unique: true, null: false },
  phone: { type: String, required: true, null: false },
  OwnerAddress: {type:String, required:true, null:false},
  shopAddress: {type:String, required:true, null: false},
  password: { type: String, required: true, null: false },

});

const shopModel = mongoose.models.User || mongoose.model("Shop",userSchema);
export default shopModel;