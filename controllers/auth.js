

const User = require('../models/User');

const {GeneratePassword, ValidatePassword, generateSignature,GenerateSalt}= require("../utils/index")


const UserSignup=async(req,res)=>{

  
    const {email,phone,password,name,surname}=req.body;
   
console.log(email,phone,password,name);
 const salt= await GenerateSalt()

    const existingCustomer= await User.findOne({email});
    const userPassword= await GeneratePassword(password,salt)
  
        if (existingCustomer) {
            res.status(401).json({
                message:"Email already in use"
            })
        }
        else if(!existingCustomer){
            const newUser= await User.create({
                email,phone,password:userPassword,name,surname,salt
            });
            if (newUser) {
              const signature=await generateSignature({
                _id:newUser._id,
                email:newUser.email,
                phone:newUser.phone,
               
    
              })  
              res.status(201).json({
                signature:signature,
                email:newUser.email,
                phone:newUser.phone,
                name:newUser.name,
                surname:newUser.surname,
            })
    
        }
        else{
    
            res.status(500).json({msg:"server error"})
    
        }
    
        }
      

    
    }
    const UserSignin=async(req,res)=>{
        const {email,password}= req.body;
        const existingAdmin=await User.findOne({email:email});
     try {
         if (!existingAdmin) {
             res.status(401).json({msg:"User does not exist please sign up"})
            } else {
             const response=await ValidatePassword(password,existingAdmin.password,existingAdmin)
             if (response==="wrong details") {
                 res.status(401).json({
                     msg:"Wrong email or password"
                 })
                     }
                     else{
                         const signature=await generateSignature({
                             _id:existingAdmin._id,
                             email:existingAdmin.email,
                             phone:existingAdmin.phone,
                             isAdmin:existingAdmin.isAdmin,
                         })
                         res.status(201).json({
                          
                        
                            signature:signature,
                            email:existingAdmin.email,
                            phone:existingAdmin.phone,
                            name:existingAdmin.name,
                            surname:existingAdmin.surname,
                         })
                     }
            }
     } catch (error) {
        console.log(error)
         res.status(500).json({msg:"Server error",error})
     }
     
        
       
     }

const UserLogin=async(req,res)=>{
    const {email,password}= req.body;
    const existingCustomer=await User.findOne({email:email});
 console.log(existingCustomer);
    const response=await ValidatePassword(password,existingCustomer.password,existingCustomer)
  console.log(response);
     if (existingCustomer) {
         if (response==="wrong details") {
     res.status(401).json({
         msg:"Wrong email or password"
     })
         }
         else{
             const signature=await generateSignature({
                 _id:existingCustomer._id,
                 email:existingCustomer.email,
                 phone:existingCustomer.phone,
                 name:existingCustomer.name,
                 surname:existingCustomer.surname,
             })
             res.status(201).json({
              
            
                 signature:signature,
                 email:existingCustomer.email,
                 phone:existingCustomer.phone,
                 name:existingCustomer.name,
                 surname:existingCustomer.surname,
             })
         }
     }
   
}
const EditUserProfile=async(req,res)=>{
    const user=req.user;
    if (user) {
        const existingCustomer =await User.findByIdAndUpdate(user._id,{$set:req.body},{new:true})
        res.json(existingCustomer)
      }
      else{
          return res.json({"msg":"Customer information not found"})
      }
}
const GetUserProfile =async(req,res)=>{
    const user=req.user;
    if (user) {
      const existingCustomer =await User.findById(user._id);
      return res.json({
        name:existingCustomer.name,
        surname:existingCustomer.surname,
        phone:existingCustomer.phone,
        email:existingCustomer.email
      })
    }
    else{
    return res.json({"msg":"Customer profile not found"})
    }
}



module.exports={
UserSignup,
UserLogin,
EditUserProfile,
GetUserProfile,
UserSignin
}