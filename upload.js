const multer =require("multer");
const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:2*1024*1024
    },
    fileFilter:(req,file,cd)=>{
        if(file.mimetype.startsWith("image/")){
            cd(null,true);
        }
        else{
            cd(new Error("only images allowed"),false);
            
        }

    }
});
module.exports=upload;