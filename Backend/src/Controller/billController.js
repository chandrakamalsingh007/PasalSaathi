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
        const productNamesSet = new Set();
        const purchasedItems = await Promise.all(
            billItems.map(async (item) => {
                const name = item.name.trim().toLowerCase();

                if(productNamesSet.has(name)){
                    return res.json({
                        message:`Duplicate product : ${name}`,
                    })
                }
                productNamesSet.add(name);

                const product = await productModel.findOne({
                    shop: req.user.id,
                    name : name,
                });

                if(!product) {
                    return res.status(404).json({
                        message:`Product ${item.name} not found`,
                    });

                };
                if (product.quantity <= product.lowStockThreshold){
                    return res.json({
                        message:`Low stock alert for ${product.name}: ${product.quantity} left`
                    })
                };

                if (product.quantity < item.quantity){
                    return res.json({
                        message: `Insufficient stock for ${item.name}`
                    })
                }

                const price = product.sellingPrice;
                const subtotal = item.quantity * price
                totalAmount += subtotal;

                product.quantity -= item.quantity;
                await product.save();

                return {
                    product : product._id,
                    quantity : item.quantity,
                    price : price,
                }
            })
        )

        totalAmount -= discount;
        const dueAmount = totalAmount - paidAmount;

        const bill = await billModel.create({
            shop: req.user.id,
            customer: customerId,
            billItems:purchasedItems,
            toatalAmount : totalAmount,
            discount : discount,
            paidAmount : paidAmount,
            dueAmount : dueAmount,
            isQuickBill : false,
        });

        if (dueAmount > 0){
            await customerModel.findByIdAndUpdate(customerId,{
                $inc : { totalDue : dueAmount},
            })
        }
    } catch (err) {
        console.error("Bill Error:", err);
    res.status(500).json({ message: "Server error while generating bill" });
    }
}

export {createBill};