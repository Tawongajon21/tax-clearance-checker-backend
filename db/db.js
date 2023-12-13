const mongoose= require("mongoose");
const dotenv= require("dotenv");
dotenv.config();



async function connect(url) {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB CONNECTED");
    } catch (error) {
        console.log('Error ============')
        console.log(error);
        process.exit(1);
    }
 
}

module.exports=connect