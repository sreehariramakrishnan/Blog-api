const http=require("http");
const server=http.createServer((req,res)=>{
   if(req.url==="/"){
    res.write(" hi ");

   }
   else if(req.url==="/about"){
        res.write("poda mairu");
   }
   else{
     res.write("404 found error");
   }
   res.end();
});
server.listen(3000,()=>{
    console.log(" server running on port 3000");
});
