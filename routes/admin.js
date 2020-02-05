const express = require("express")
const routes = express.Router()
const staffSchema = require("../model/staff")
const bcryptjs = require("bcryptjs")
const salt = bcryptjs.genSaltSync(10)
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const crypto = require("crypto");
const studentSchema = require("../model/student")


routes.post("/add",async (req,res)=>{
    let {
        first_name,
        last_name,
        email,
        token 
    } = req.body
    let password = crypto.randomBytes(6).toString('hex')
    let hashedPassword = bcryptjs.hashSync(password, salt)
    let foundOneAdmin = await  staffSchema.find()
    console.log("password",password, first_name, last_name, email) 
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
    console.log(verifiedAdmin)
      if(verifiedAdmin || foundOneAdmin.length === 0) { 
        let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAILACC, // generated ethereal user
      pass: process.env.MAILPASSCODE // generated ethereal password
    }
  });
    await transporter.sendMail({
        from: 'server <server@basiccompanybooks.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "password - noreply@basiccompanybooks-server", // Subject line
        text: `
        `, // plain text body
        html: `<p>your password ${password}</p>`
    // html body 
      }).then((info)=>{
        console.log("message sent")
      })
      .catch((err)=>{
          console.log(`Error: ${err}`)
      })
        await newUser.save()
        .then(()=>{
            res.status(200).json({msg: "user registered"})
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
    console.log(token)
    let password = crypto.randomBytes(10).toString('hex')
    let hashedPassword = bcryptjs.hashSync(password, 10)
    let newStudent  = new studentSchema({
        email: email,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        class: classS
    })
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
    if (token !== null || token !== undefined) {
        if (person === "admin" || person === "staff") {
          await newStudent.save()
            .then(()=>{
                console.log("user save", password)
                res.json({msg: "new student added"})
            })
            .catch(err=>{
                res.status(400).json({msg: "user not save", error: err})
            })
        }  
        let transporterr = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAILACC, // generated ethereal user
      pass: process.env.MAILPASSCODE // generated ethereal password
    }
  });
    await transporterr.sendMail({
        from: 'server <server@basiccompanybooks.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "password - noreply@basiccompanybooks-server", // Subject line
        text: `
        `, // plain text body
        html: `<p>your password ${password}</p>`
    // html body 
      }).then((info)=>{
        console.log("message sent")
      })
      .catch((err)=>{
          console.log(`Error: ${err}`)
      })
        });
    } else {
        res.status(400).json({msg: "not allowed!"})
    }
})

module.exports = routes
