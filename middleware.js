const jwt=require("jsonwebtoken");
const verifyToken=(req,res,next)=>{
    try{
     const token=req.header("authorization")
    if(!token){
        return res.status(404).json({message:"no token provided"});

    }
    const decode=jwt.verify(token,process.env.JWTTOKEN);
    req.user=decode;
    next();
}catch(error){
        return res.status(500).json({error:error.message});
    }


    }
    module.exports=verifyToken;