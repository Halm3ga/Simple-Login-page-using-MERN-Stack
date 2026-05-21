const mongoose = require("mongoose")

const connection = mongoose.connect("mongodb://localhost:27017/autodesk")
    .then(() => { console.log("Database connected successfully") })
    .catch((err) => { console.error("Database connection error:", err) })
