
const  express= require('express');
const isAuth = require('../middlewares/auth');
const { createTaxClearance, getTaxClearance, getTaxClearances,updateTaxClearance,deleteTaxClearance  } = require('../controllers/tax');
const taxRoutes= express.Router();

const multer= require('multer');
const path= require("path")
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"../uploads")
    },
    filename:(req,file,cb)=>{
        console.log(file);
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const uploadMiddleware = multer({ dest: 'uploads/' });





taxRoutes.use(isAuth)
taxRoutes.post("/create-tax-clearance",uploadMiddleware.any(),createTaxClearance);
taxRoutes.put("/update-tax-clearance/:id",uploadMiddleware.any(),updateTaxClearance);
taxRoutes.delete("/delete-tax-clearance/:id",deleteTaxClearance);
taxRoutes.get("/get-tax-clearances",getTaxClearances);
taxRoutes.get("/get-tax-clearance/:id",getTaxClearance);



module.exports=taxRoutes