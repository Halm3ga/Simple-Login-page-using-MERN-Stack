const express = require("express");
const app = express();
const mongoose = require("./config/db")
const userModel = require("./modules/user")
const bcrypt = require("bcrypt")


app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.render("home")
})

app.get("/home", (req, res) => {
    res.render("home")
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
        }
        else {
            res.send("Invalid password");
        }
    } else {
        res.send("Invalid username");
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
