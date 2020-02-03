const express = require("express")
const customRoute = express()
const adminRoute = require("./routes/admin")
const accountRoute = require("./routes/login")
const questionRoute = require("./routes/question")
const helperRoute = require("./routes/counts")


customRoute.use("/admin", adminRoute)
customRoute.use("/account", accountRoute)
customRoute.use("/questions", questionRoute)
customRoute.use("/use", helperRoute)

 
module.exports = customRoute