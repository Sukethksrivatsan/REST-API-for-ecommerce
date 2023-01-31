const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
router.get('/',(req,res,next)=>{
    User.find()
    .exec()
    .then(result=>{
        res.status(201).json(result);
    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
})
router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    //here an array will be returned containing all the emails which are the same as req.body.email
.then(user=>{
    if (user.length<1) {
        return res.status(401).json({message:"auth failed"});
    }
    //whatever is stored in the database
    bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
        if (err){
            return res.status(401).json({message:"auth failed"})
        }
        else{
            //password is correct or password is wrong
            if (result){
                const token=jwt.sign({
                    email:user[0].email,
                    userid:user[0]._id
                },"secret",{
                    expiresIn:'1h'
                })//private key which can be accessed only by the server
                return res.status(201).json({message:"logged in successfully",
            token:token});
            }
            else{

                return res.status(201).json({message:"your password is incorrect"});
            }
        }
    })

})
.catch()
})
router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if (user.length>=1){
        res.status(409).json({message:"User with this particular email already exists"})
    }
    else{
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if (err){
            res.status(500).json({
                error:err
            })}
            else{ 
                const user=new User({
                    _id: new mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password:hash
                    })
            user
            .save()
            .then(result=>{
                console.log(result);
                res.status(200).json({message:"user has been created"});
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                })
            })
        }
        //hashing library in bcrypt is being adding since we cannot have password lying around for anyone to access it
    })
    }

    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
    
})
router.delete('/:userid',(req,res,next)=>{
    const id=req.params.userid;
    User.remove({_id:id}).exec()
    .then(response=>{
        res.status(201).json({message:"deleted"})
    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
})
//add router.delete here

module.exports=router;
