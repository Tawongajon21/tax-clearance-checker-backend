const express= require("express");
const cors= require("cors");

const connect = require("./db/db");
const userRoutes = require("./routes/customer");
const taxRoutes = require("./routes/tax");
const connString=process.env.MONGO_URI;
console.log(connString);
const app= express();
//app.use(express.static('uploads'))
app.use("/uploads",express.static(__dirname+"/uploads"))
app.use(express.json());
app.use(cors());
const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`the app is listening to port ${PORT}`);
})
connect(connString);

app.use("/api/v1/user/",userRoutes);
app.use("/api/v1/tax/",taxRoutes);
