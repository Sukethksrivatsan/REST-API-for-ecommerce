const mongoose=require('mongoose');
const productschema=mongoose.Schema(
    {
        _id:mongoose.Schema.Types.ObjectId,
        name:{type:String,required:true},
        price:{type:Number,required:true}
    }
)
module.exports=mongoose.model('Product',productschema);
// implementing product validation
