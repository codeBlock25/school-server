const express = require("express")
const bcryptjs = require("bcryptjs")

const routes = express.Router()
const staffSchema = require("../model/staff")
const studentSchema = require("../model/student")
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET || "vRT3d`oGWXMe2!ueBh.?YQM:E:A%Fhrnmd61g(p*?8$u[sOZl!+g+EFIwy29`eh"


routes.post("/login", async (req,res)=> {
    let  {
        email,
        password
    } = req.body
    var user = null
    var findUserAsStaff = await staffSchema.findOne({email: email})
    var findUserAsStudent = await studentSchema.findOne({email: email})

    
    if (findUserAsStaff) {
        user = findUserAsStaff
    } else if (findUserAsStudent) {
        user = findUserAsStudent
    } else {
        user = null
        res.status(400).json({msg: "no user with details"})
    }try {
    let correctPassword = bcryptjs.compareSync(password, user.password)
    // let type = findUserAsStaff !== null || findUserAsStaff !== undefined ? findUserAsStaff.isAdmin !== null ? "admin" : findUserAsStudent? "student":null : "staff"
    
    let type = findUserAsStaff === null? findUserAsStudent ? "student": "staff" : findUserAsStaff.isAdmin ? "admin": "staff"
    console.log(type)
    let token = jwt.sign({
        data: {
            full_name: `${user.first_name} ${user.last_name}`,
            type: type,
            email: user.email,
            class: findUserAsStudent!==null ? findUserAsStudent.class : null
        } 
    }, secret, { expiresIn: '30d' })

    console.log(findUserAsStaff!==null ? null : findUserAsStudent.class)
    if (correctPassword && user !== null) {
        res.json({msg: `welcome ${user.first_name}`, type: type, token: token})
    } else {
        res.status(400).json({msg: "your details don't match"})
    }

    } catch (error) {
        res.status(400).json({msg: "no user with details"})
        console.log(error)        
    }
})

module.exports = routes