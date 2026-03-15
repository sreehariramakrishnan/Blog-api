const express=require("express");
const app=express();
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://sreehariramakrishnan300_db_user:Sreehari215@sreehari1.ubgdlpb.mongodb.net/")
.then(()=>{
    console.log(" mongodb connected ");
})
.catch(err=>{
     console.log(err);
});
const userSchema=new mongoose.Schema({
    name:String,
    age:Number

});
const User=mongoose.model("User",userSchema);
app.use(express.urlencoded());
app.use(express.json());
app.get("/user",async(req,res)=>{
    const user=await User.find();
    res.status(200).json({user:user});
});
app.get("/user/:id",async(req,res)=>{
    
    try{
    const {id}=req.params;
    const user=await User.findById(id);
    if(!user){
       return res.status(404).json({message:"no user"});
    }
    
    res.status(200).json(user);
    }
    catch(error){
        res.status(400).json({message: "invalid id"});
    }
});
app.post("/user",async(req,res)=>{
    const user=new User({
        name:req.body.name,
        age:req.body.age
    });
    await user.save();
    res.json({message:"saved succesfilly"});
});
app.put("/user",(req,res)=>{
    
    res.json({message:"upadted"});
});
app.delete("/user",(req,res)=>{
    res.json({message:"user deleted"});
});
app.listen(3000,()=>{
    console.log("server running on port 3000");



}
);
