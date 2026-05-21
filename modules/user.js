const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    userName: String,
    password: String
})

const userModel = mongoose.model("login", userSchema)
module.exports = userModel