const express = require("express")
const routes = express.Router()
const staffSchema = require("../model/staff")
const bcryptjs = require("bcryptjs")
const salt = bcryptjs.genSaltSync(10)
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET || "vRT3d`oGWXMe2!ueBh.?YQM:E:A%Fhrnmd61g(p*?8$u[sOZl!+g+EFIwy29`eh"
const crypto = require("crypto");
const studentSchema = require("../model/student")

let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "server@basiccompanybooks.com", // generated ethereal user
      pass: "a20b30c40!@" // generated ethereal password
    }
  });

routes.post("/add",async (req,res)=>{
    let {
        first_name,
        last_name,
        email,
        token
    } = req.body
    let password = crypto.randomBytes(4).toString('hex')
    let hashedPassword = bcryptjs.hashSync(password, salt)
    let foundOneAdmin = await  staffSchema.find()
    console.log("password",password) 
    let newUser = foundOneAdmin.length >= 1 ?
    new staffSchema({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        isAdmin: false
    }):new staffSchema({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        isAdmin: true
    })
    let verifiedAdmin = false
    if(token) {
        jwt.verify(token, secret, (err, decode)=>{
            if (decode) {
                verifiedAdmin = decode.data.type ==="admin"? true:false
            }
        })
    }
      if(verifiedAdmin || foundOneAdmin.length === 0) { 
        await newUser.save()
        .then( async ()=>{
            res.status(200).json({msg: "user registered"})
            await transporter.sendMail({
                from: 'server <server@basiccompanybooks.com>', // sender address
                to: email, // list of receivers
                subject: "details - noreply@server", // Subject line
                text: `Your password is ${password}`, // plain text body
                html: `<h2>Your password is ${password}</h2>`
            // html body 
              }).then((info)=>{
                console.log("message sent")
              })
              .catch((err)=>{
                  console.log(`Error: ${err}`)
              })
        })
        .catch(err=>{
            res.status(400).json({msg: "user registeration not successful", error: err})
        })
        return null
      } else {
        res.status(400).json({msg: "only admin accounts can add other admin"})
        return null
    } 
})

routes.post("/student", async (req,res)=>{
    let {
        email,
        first_name,
        last_name,
        classS,
        token
    } = req.body
    let password = crypto.randomBytes(4).toString('hex')
    let hashedPassword = bcryptjs.hashSync(password, 10)
    let foundOldStaff = await staffSchema.findOne({email: email})
    let newStudent  = new studentSchema({
        email: email,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        class: classS
    })
    console.log("password", password)
    var person = ""
    jwt.verify(token, secret,(err, decode)=>{
        if (err) {
            console.log(err)
        } else if (decode.data.type === "admin" || decode.data.type === "staff") {
           person = decode.data.type
        } else {
            res.status(400)
        }
    }) 
    if ((person === "admin" || person === "staff") && !Boolean(foundOldStaff)) {
      await newStudent.save()
        .then( async ()=>{
            res.json({msg: "new student added"})
            await transporter.sendMail({
                from: 'server <server@basiccompanybooks.com>', // sender address
                to: email, // list of receivers
                subject: "details - noreply@server", // Subject line
                text: `Your password is ${password}`, // plain text body
                html: `<h2>Your password is ${password}</h2>`
            // html body 
              }).then((info)=>{
                console.log("message sent")
              })
              .catch((err)=>{
                  console.log(`Error: ${err}`)
              })
        })
        .catch(err=>{
            res.status(400).json({msg: "student not save", error: err})
        })
    } else {
        res.status(404).json({msg: "already registered as a staff"})
    }
})





module.exports = routes
