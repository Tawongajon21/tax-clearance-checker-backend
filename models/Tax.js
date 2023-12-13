const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaxSchema = new Schema({
    companyName: {type:String,required:true},
    businessPartnerNo: {type:String,required:true},
    startPeriod:{type:String,required:true},
    expiryDate:{type:String,required:true},
  
   
    pdf:{type:String},
    addedBy:{type:mongoose.Types.ObjectId,ref:'user',required:true},
    username:{type:String,required:true}
   
},{
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

const Tax =  mongoose.model('tax',TaxSchema );

module.exports=Tax