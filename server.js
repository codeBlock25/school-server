const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const port = process.env.PORT || 1100
const server = express()
const customRoute = require("./router")
const databaseURL = process.env.DATABASE || `mongodb://localhost:27017/db`

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: false}))
server.use(cors())

mongoose
.connect(databaseURL, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("database connected successfully"))
.catch(err=>console.log(`connection crashed with this error: ${err}`))
 

server.use("/api",customRoute)

server.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})