const mongoose = require("mongoose")

const prodSchema = new mongoose.Schema({
    prodName: String,
    prodID: String,
    prodPrice: Number,
    prodQuantity: Number
})

const prodModel = mongoose.model("product", prodSchema)
module.exports = prodModel