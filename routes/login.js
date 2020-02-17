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
    let type = findUserAsStaff ? findUserAsStaff.isAdmin? "admin":"staff" : findUserAsStudent ?"student": "staff"
    const setter = async () => {
        try {
        let correctPassword = bcryptjs.compareSync(password, user.password)
        let token = jwt.sign({
            data: {
                full_name: `${user.first_name} ${user.last_name}`,
                type: type,
                email: user.email
            }
        }, secret, { expiresIn: '30d' })
    
        if (correctPassword && user !== null) {
            res.json({msg: `welcome ${user.first_name}`, type: type, token: token})
        } else {
            res.status(400).json({msg: "your details don't match"})
        }
    
        } catch (error) {
            res.status(400).json({msg: "no user with details"})
            console.log(error)        
        }
    }
    
    if (findUserAsStaff) {
        user = findUserAsStaff
        await setter()
    } else if (findUserAsStudent) {
        user = findUserAsStudent
        await setter()
    } else {
        user = null
        res.status(400).json({msg: "no user with details"})
    }
})

module.exports = routes