import Express from "express";
import "./connection.js"
import userModel from "./modules/users.js";
import productModel from "./modules/products.js";
import pendingOrders from "./modules/pendingOrders.js";
import cors from "cors"

const app = Express();

app.use(Express.json())

app.use(cors({
    origin: "*"
}))



/////////////// admin /////////////////////////////////////
app.post("/admin", async (req, res) => {
    const { email, password } = req.body;

    // בדוק אם המייל והסיסמה נכונים
    if (email === "trifo@trifo.com" && password === "1") {
        // אם המייל והסיסמה נכונים, שלח אישור
        res.json({ message:   " admin בהצלחה", success: true });
    } else {
        // אם המייל או הסיסמה לא נכונים, החזר שגיאה
        res.status(401).json({ message: "התחברות נכשלה: פרטי ההתחברות שגויים" });
    }
});



//////////////////////// login / sign-up ////////////////////

//login
app.post("/", async (req, res)=>{
    try {
    const { password, email } = req.body;
        const user = await userModel.findOne({ password: password, email: email})
        if (user) {
            res.json(user);
        } else {
            res.status(401).json({ message: "התחברות נכשלה: משתמש לא נמצא" });
        }
    }catch (error){
        console.log(error)
    }
})

// sign-up
app.post("/sign-up", async (req, res)=>{
    try {
    const user = req.body

        const exist = await userModel.findOne({ email: user.email})

        if(exist){
            res.send({"info":"email already taken", "created": false})
        }
        
    await userModel.create(user)
    res.send({"info":"user is created successfully", "created": true})
    } catch (error) {
        console.log(error)
    }
})

//////////////////////// product ////////////////////

app.post("/products", async (req, res) => {
    try{
        const products = await productModel.find()
        console.log("products sent")
        res.send(products)
    }catch (error){
        console.log(error)
    } 

    
})

//////////////////////// pending ////////////////////

app.post("/pending", async (req, res) => {
    try {
        const orderData = req.body; 
        await pendingOrders.create(orderData);
        res.send({ "info": "ההזמנה נוצרה בהצלחה", "created": true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "error": "שגיאה בהזמנה" });
    }
});

///////////////// all /////////////////////////

app.get("/all", async (req, res) => {
    try{
        const qury = req.query
        if(qury.isadmin === "true")
        {const pend = await pendingOrders.find()
            res.send(pend)
        }else{
            res.status(404).send("not found")
        }
    }catch{
        console.log(error)
    }
})


app.listen(3002, ()=> {
    console.log("listening on 3002....")
})