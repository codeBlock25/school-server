const express = require("express")
const routes = express.Router()
const studentSchema = require("../model/student")
const staffSchema = require("../model/staff")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET || "vRT3d`oGWXMe2!ueBh.?YQM:E:A%Fhrnmd61g(p*?8$u[sOZl!+g+EFIwy29`eh"

routes.get("/:token", async(req,res)=>{
    let {
        token
    } = req.params
    let students = await studentSchema.find()
    let staffs = await staffSchema.find()
    var veirfied = []
    jwt.verify(token, secret, (err, decoded)=>{
        if (err) {
            console.log(err)
        }
        if (decoded) {
            veirfied = decoded
        }
    })

    if (veirfied.data.type === "admin") {
        res.json({student: students, staff: staffs})
    } else if ( veirfied.data.type === "staff") {
        res.json({student: students})
    } else {
        res.status(400).json({msg: "not allowed"})
    }
    
})


module.exports = routes