import billModel from "../Model/billModel.js";
import customerModel from "../Model/customerModel.js";
import productModel from "../Model/productModel.js";
import hashids from "../services/hashIds.js";

const createBill = async(req,res) => {
    const { customerId , billItems,discount = 0, paidAmount } = req.body;

    if(!customerId || !billItems || billItems.length === 0){
        return res.status(400).json({
            message:"Provide all required fields.",
        })
    }

    try {

        const decode = hashids.decode(customerId);
        const customerNo = decode.length > 0 ? decode[0]: null;
        if(!customerNo){
            return res.status(400).json({message:"Invalid customerId"});
        }

        const customer = await customerModel.findOne({
            shop:req.user.id,
            customerNo: customerNo,
        });

        if(!customer){
            return res.status(404).json({
                message:"Customer not found !!",
            })
        }

        let totalAmount = 0;
        const purchasedItems = await Promise.all(
            billItems.map(async (item) => {
                const product = await productModel.findOne({
                    shop: req.user.id,
                    name : item.name.trim().toLowerCase(),
                });

                if(!product) throw new Error (`Product ${item.name} not found`);

                const price = product.sellingPrice;
                const subtotal = item.quantity * price
            })
        )
        const bill = await billModel.create({
            shop: req.user.id,
            customer: customerId,
            billItems:billItems,
            toatalAmount : totalAmount,
            discount : disCount,
            paidAmount : paidAmount,
            dueAmount : dueAmount,
            isQuickBill : false,
        });

        if (dueAmount > 0){
            await customerModel.findByIdAndUpdate(customerId,{})
        }
    } catch (err) {
        
    }
}

export {createBill};