require('dotenv').config(); 
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose");
const cors = require("cors");
const jwt=require("jsonwebtoken");
const verifyToken=require("./middleware");
const {body,validationResult}=require("express-validator");
const AppError=require("./error");
const cloudinary=require("./cloudinary");
const upload=require("./upload");




app.use(express.json());
app.use(cors());
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(" database connected");
    })
    .catch((err) => {
        console.log("not connected");
    });
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true


    },
    imageUrl:{
        type:String,
        default:""
    }
});
const User = mongoose.model("User", userSchema);
const postschema=new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    content:{
        type:String,
        required:true

    },
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }},
{timestamps:true});
const Post=mongoose.model("Post",postschema);

app.post("/register", [
    body("email").notEmpty().withMessage("email should not be empty"),
    body("email").isEmail().withMessage("invalid email format"),
    body("password").notEmpty().withMessage("password should not be empty"),
    body("password").isLength({min:6}).withMessage("password must be atleast six characters"),


],asyncHandler(async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        throw new AppError(errors.array()[0].msg,400);
    }
        const email = req.body.email;
        const password = req.body.password;
        const hashedpassword = await bcrypt.hash(password, 10);

        const user = new User({ email: email, password: hashedpassword });
        await user.save();
        res.status(201).json({ message: "User updated" });
    
}));
app.post("/login", asyncHandler(async(req,res)=>{
   
        const email=req.body.email;
        const password=req.body.password;
        const user= await User.findOne({email:email});
        if(!user){
               throw new AppError("user not found",404)
        }
        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            throw new AppError("password mismatch",400);

        }
        const token=jwt.sign(
            {id:user.id,email:user.email},
            process.env.JWTTOKEN,
            {expiresIn:"1d"}

        );
    
        res.status(200).json({message:"login successfull",token:token,mail:email});

        

    
}));
app.get("/profile",verifyToken, asyncHandler(async (req,res)=>{

        const user = await User.findById(req.user.id).select("-password");
        if(!user){
        throw new AppError("user not found",404);
        }
        res.status(200).json({user:user});
    

}));
app.post("/post",verifyToken, [
    body("title").notEmpty().withMessage(" Title should be not empty"),
    body("content").notEmpty().withMessage("Content should be not empty")
],asyncHandler(async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
                throw new AppError(errors.array()[0].msg,400);

    }
    
        const title=req.body.title;
        const content=req.body.content;
        const post =new Post({
            title:title,
            content:content,
            createdby:req.user.id
            
        })
        await post.save();
        res.status(200).json({message:"post created "});
    
   
}
));
app.get("/posts",asyncHandler(async (req,res)=>{
    
    const posts = await Post.find().populate("createdby","-password");
        if(posts.length==0){
            throw new AppError(" no posts",404);
        }
        res.status(200).json({posts:posts});
 }));



app.get("/myposts",verifyToken,asyncHandler(async (req,res)=>{
    
    const posts = await Post.find({createdby:req.user.id}).populate({path:"createdby",select:{"email":1, "_id":0}});
    if(posts.length==0){
            throw new AppError(" no posts",404);
        }

       res.status(200).json({posts:posts});

    }));

app.post("/imagepost",verifyToken,upload.single("image"),asyncHandler(async(req,res)=>{
    if(!req.file){
        throw new AppError("please upload image",400);
    }
    const filestr=req.file.buffer.toString("base64");
    const filetype=req.file.mimetype;
    const uploadreponse=await cloudinary.uploader.upload(
        `data:${filetype};base64,${filestr}`,
        {
            folder:"profile-pictures",
            transformation:[
        
                { width: 300, height: 300, crop: "fill" }
            ]
        }
    );
    const user=await User.findByIdAndUpdate(
        req.user.id,
        {
            imageUrl:uploadreponse.secure_url
        },
        {
            returnDocument:'after'
        }
    ).select("-password");
    const imageUrl=uploadreponse.secure_url;

    res.status(200).json({message:"image uploaded",user:user});
    
    

}));



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "something went wrong";
    res.status(statusCode).json({
        success: false,
        error: message
    });
});
app.listen(4000, () => {
    console.log("Server connected to port 4000")
});