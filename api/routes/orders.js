const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const Order=require('../models/Order');
const Product=require('../models/Product');
router.get('/',(req,res,next)=>{
    Order.find()
    // .populate('product','name')
    .exec()
    .then(docs=>{
        res.status(201).json(docs);
    })
    .catch(err=>{
        res.status(500).json(err);
    })
})
router.delete('/:orderID',(req,res,next)=>{
    id=req.params.orderID;
    Order.remove({_id:id})
    .exec()
    .then(result=>{
        message:"deleted"
        res.status(202).json(result);
    })
    .catch(err=>{
        res.status(500).json(err);
    })
})
//req.body signifies that the body parser is being used inorder to pass the jjson data , but what if we have raw data
//Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
//Don't forget the enctype="multipart/form-data" in your form.
router.get('/:orderId',(req,res,next)=>{
    Order.findById(req.params.orderId)
    .exec()
    .then(order=>{
        if (!order){
            res.status(404).json({
                message:"order not found"
            })
            return;
        }
        res.status(201).json({
            order:order}
            );
    })
    .catch(err=>{
        res.status(500).json(err);
    })
})
//we realise that we are saving orders on the products which do not exist at all
// we need to make sure that we are saving orders on products which exist in the db only 
router.post('/',(req,res,next)=>{
    Product.findById(req.body.productID)
    .then(product=>{
        if (!product){
            res.status(404).json({
                message:"Product not found"
            }
            )
            return;
        }
        const order=new Order({
            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productID
        })
        return order.save()
    })
            .then(result=>{
                res.status(201).json(result);
    
            }
            )
        .catch(err=>{
            res.status(500).json({error:err});
            return;
        })
})
module.exports=router;
