const Tax= require("../models/Tax");
const User = require("../models/User");
const fs= require("fs")
const bucket="nicoz-tcc"
const {S3Client, PutObjectAclCommand, PutObjectCommand}= require("@aws-sdk/client-s3")
async function uploadToS3(path,originalFilename,mimetype) {
    const client= new S3Client({
        region:"eu-north-1",

        credentials:{
            accessKeyId:process.env.AWS_ACCESS_KEY,
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
        }
    })
    const parts= originalFilename.split(".");
    const ext= parts[parts.length-1]
   const newFilename= Date.now()+"."+ext
 await client.send(new PutObjectCommand({
    Bucket:bucket,
    Body:fs.readFileSync(path),
    Key:newFilename,
    ContentType:mimetype,
    ACL:"public-read"
   })) 

   return `https://${bucket}.s3.amazonaws.com/${newFilename}`
  // console.log({data});
}

const createTaxClearance=async(req,res)=>{
    try {
        const user= req.user;
       
      const {companyName,businessPartnerNo,startPeriod,expiryDate}=req.body;
       ///console.log(req.files);
        if (user) {
          
let image;
let pdf;
            
            const files=req.files;
       let url
       //   console.log(files);
          for (let i = 0; i < req.files.length; i++) {
            const {originalname,path,mimetype}=req.files[i];
      url=     await  uploadToS3(path,originalname,mimetype)
        console.log(url);
    }
         

            
          
           
             
      
            const getCustomer= await User.findById(user._id);
            
       
    
       //console.log(newPath);
           if (getCustomer) {
              
                
             
                const getTaxClearance= await Tax.findOne({businessPartnerNo:businessPartnerNo});
        
                if (getTaxClearance) {
                    res.status(401).json({
                        message:"the business partner number is already in use"
                    })
                  
                }else{
                 
                    const createTaxClearance= await Tax.create({
                        companyName,
                        businessPartnerNo,
                        startPeriod,
                        expiryDate,
                    
                      
                      
                        pdf:url,
                        addedBy:user._id,
                        username:`${user.name} ${user.surname}`
                                })
                                //console.log(newFiles);
        
               res.status(200).json({message:"tax created succesfully", data:createTaxClearance});
            
                }
                   
              
            } else{
                res.send("user not authorized")
            }
            
        }
    } catch (error) {
        
    res.status(500).send(error)

    }
  

       
    

   
   
    
}
const getTaxClearances=async(req,res)=>{
try {
    const user= req.user;
    if (user) {
        const data = await Tax.find();
    if (data) {
        res.status(200).json({data:data,message:"data has been sucesfully retrieved"})
    }else{
        res.status(200).send("data has not been found")
    }
  
    }
    
} catch (error) {
    res.status(500).send("server error")
}
}
const getTaxClearance=async(req,res)=>{
    const id= req.params.id;
    try {
        
const data= await Tax.findById(id);
if (data) {
    res.status(200).json(data)
}else{
    res.status(200).send("data has not been found")
}
    } catch (error) {
        res.status(500).send("server error")
    }

}
const updateTaxClearance=async(req,res)=>{
  try {
    const user=req.user;
    const id= req.params.id
    if (user) {
        let image;
let pdf;
            
            const files=req.files;
       let url
       //   console.log(files);
          for (let i = 0; i < req.files.length; i++) {
            const {originalname,path,mimetype}=req.files[i];
      url=     await  uploadToS3(path,originalname,mimetype)
        console.log(url);
    }  

    const data= await Tax.findById(id);
    if (data) {
        data.companyName= data.companyName||req.body.companyName;
        data.businessPartnerNo= data.businessPartnerNo||req.body.businessPartnerNo;
        data.startPeriod= data.startPeriod||req.body.startPeriod;
        data.expiryDate= data.expiryDate||req.body.expiryDate;
        data.pdf= data.pdf||pdf;
    
        await data.save()
            
              res.status(201).json({msg:"tax clearance has been updated",data})  
    } else {
        res.status(200).send("the tax clearance has not been found")
    }
  
        
            
        
    }
  } catch (error) {
    res.status(500).json({msg:"server error",error})
  }
    
}
const deleteTaxClearance=async(req,res)=>{
const id= req.params.id;
try {
    const data= await Tax.findByIdAndDelete(id);
    if (data) {
        res.status(200).send("data has been deleted")
    }else{
        res.status(200).send("data has not been found")
    }
} catch (error) {
   res.status(500).send("server error") 
}
}

module.exports={
    createTaxClearance,
    getTaxClearance,
    getTaxClearances,
    updateTaxClearance,
    deleteTaxClearance
}