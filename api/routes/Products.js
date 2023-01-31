const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const Product=require('../models/Product');
const multer=require('multer');
const checkAuth=require('../middleware/check-auth');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname); 
    }
});
const upload=multer({storage:storage});
// router.get('/',(req,res,next)=>{
//     res.status(200).json({
//         message:"handling get requests to /products"
//     })
// })
//creating a new product id 
//does not matter what the vscode editor highlights the code as, depends only on the way node compiles it 
//we can add how many ever handlers we want and then those act as middleware,so here we have upload.single as a handler
router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    })
    product
    .save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:"handling products now ",
            createProduct:result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })
    
})
//get request where we fetch a particular product id
router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs=>{
        const response=
        {count:docs.length,
            products:docs.map(doc=>{
                return {
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:"localhost:3000/products/"+doc._id
                        }
                        }  
            })
        }
    res.status(200).json(response);
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
})
// router.get('/',(req,res,next)=>{
//     Product.find()
//     .exec()
//     .then(docs=>{
//         res.status(200).json(docs)
//     })
//     .catch(err=>{
//         res.status(500).json(err)
//     })
// })
    //idea behind patching being that we retain the object id and then we only change the other parameters 
    router.patch('/:productid',(req,res,next)=>{
        const id=req.params.productid;
        const updateops={};
        //required body is passed in postman in such a way that it is an array of objects 
        //each object is iterated by using the variable ops
        for (const ops of req.body){
            updateops[ops.propName]=ops.value;
        }
        Product.updateOne({_id:id},{$set:updateops})//mongoose syntax
        .exec()
        .then(result=>{
            const request={
                type:'GET',
                url:"localhost:3000/products/"+id
                }
            res.status(201).json(request);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
    })
    router.delete('/:productid',(req,res,next)=>{
        const id=req.params.productid;
        Product.remove({_id:id})
        .exec()
        .then(result=>{
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        })
        })
    //using patch we can update the products and using delete which is also a request we can delete a product 
module.exports=router;
