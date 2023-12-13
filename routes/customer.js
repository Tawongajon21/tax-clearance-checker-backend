

const  express= require('express');
const {  UserSignup, UserLogin, EditUserProfile, GetUserProfile, UserSignin } = require('../controllers/auth');
const isAuth = require('../middlewares/auth');
const userRoutes= express.Router();

userRoutes.post("/signup",UserSignup)
userRoutes.post("/signin",UserSignin);
userRoutes.put("/update-profile",isAuth,EditUserProfile);
userRoutes.get("/get-profile",isAuth,GetUserProfile);



module.exports=userRoutes