require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const app = express();
const mongoose = require("./config/db")
const userModel = require("./model/user")
const prodModel = require("./model/product")



app.set("view engine", "ejs");
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var isLoggedIn = false;

const auth = (req, res, next) => {
    if (isLoggedIn) {
        next()
    }
    else {
        res.redirect("/login")
        //res.send("Unauthorized");
    }
}


app.get("/", auth, async (req, res) => {
    const products = await prodModel.find();
    res.render("home", { products })
})

app.get("/home", auth, async (req, res) => {
    const products = await prodModel.find();
    res.render("home", { products })
})

app.post('/products', async (req, res) => {
    const { prodName, prodID, prodPrice, prodQuantity } = req.body;
    await prodModel.create({ prodName, prodID, prodPrice, prodQuantity });
    res.redirect("/home");
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/signup', (req, res) => {
    res.render("signup")
})

app.post('/register', async (req, res) => {
    const { userName, password } = req.body;
    const user = await userModel.findOne({ userName });
    if (user) {
        console.log("Registration failed: user already exists:", userName);
        return res.send("user already exists")
    }
    else {
        const hashp = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            userName: userName,
            password: hashp
        });
        console.log("User registered successfully:", newUser);
    }
    res.redirect("/login");
})

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    const user = await userModel.findOne({ userName });
    if (user) {
        const ismatch = await bcrypt.compare(password, user.password);
        if (ismatch) {
            res.redirect("/home");
            isLoggedIn = true;
        }
        else {
            res.send("Invalid password");
        }
    } else {
        res.send("Invalid username");
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
