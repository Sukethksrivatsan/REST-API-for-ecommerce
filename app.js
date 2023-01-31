const express=require("express");
const app=express();
//adding authentication we sue JWT-JSON WEB TOKEN, so what happens when we login is that the server sends us a token with a unique signature that is contained in it which helps us retain the info whether
//user is logged in or not
//JSON data plus your signature makes up the JWT.JSON data is typically not encrypted and then the signature is the one being verified
const bodyParser=require('body-parser');
const morgan=require('morgan');
const productRoutes=require('./api/routes/Products');
const orderRoutes=require('./api/routes/orders')
const userRoutes=require('./api/routes/User');
const mongoose=require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://sukethks:"+process.env.mongodb_password+"@cluster0.r5zoh3i.mongodb.net/?retryWrites=true&w=majority");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//this has to be defined before you end up calling orders and products 
//otherwise it will not know how to parse the data
app.use((req,res,next)=>{
    res.header=('Access-Control-Allow-Origin','*');
    res.header=('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-type,Accept,Authorization");
if (req.method==='OPTIONS'){
res.header('Access-Control-Allow-Method','PUT,POST,PATCH,DELETE,GET')
return res.status(200).json({   
});
}
next();
})
app.use("/orders",orderRoutes);
app.use("/products",productRoutes);
app.use('/user',userRoutes);
//using Async keyword 
const login=async(username,password)=>{
    if(!username || !password){
        console.log("login credentials are invalid or one of them are blank");
    }
}
const backgroundcolorchange=(color,delay)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            document.body.style.backgroundcolorchange=color;
            resolve();
        }, delay);
    })
}
//we can only use await keyword in functions which are declared as async waits for the function to be resolved before any other course of action is taken
//Basically in the above code, we set up morgan, and since it’s a middleware, So we used the .use() method to tell express to use that as a middleware in our app. Other than that we have used ‘dev’ as a preset. 
//Some other presets available are combined, common, short, tiny. Each preset returns different information. 
app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports=app;