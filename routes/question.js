const express = require("express")
const route = express.Router()
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET || "vRT3d`oGWXMe2!ueBh.?YQM:E:A%Fhrnmd61g(p*?8$u[sOZl!+g+EFIwy29`eh"
const questionSchema = require("../model/question")
const mailgun = require("mailgun-js")
const DOMAIN = 'sandbox59170e274efc4fb58c4a287d32ca550b.mailgun.org'
const mg = mailgun({apiKey: "e220f4adbfc091099a13f83ccd4c3041-713d4f73-1c10fabd", domain: DOMAIN})
const studentSchema = require("../model/student")


route.post("/set", async (req,res)=>{
    let {
        question_type,
        questions,
        classFor,
        token
    } = req.body
    let students = await studentSchema.find({class: classFor})
    var info = []
    jwt.verify(token, secret, (err, decoded)=>{
        if (err) {
            console.log(err)
        } if (decoded) {
          info = decoded  
        }
    })
    if (info.data.type === "admin" || info.data.type === "staff") {
        let newQuestion = new questionSchema({
            teacher_name: info.data.full_name,
            question_type: question_type,
            questions: questions,
            class: classFor
        })
        newQuestion.save()
        .then( async ()=>{
            res.json({msg: "question created"}) 
            let msgdata = {
                from: 'Excited User <me@samples.mailgun.org>',
                to: [[...students].email],
                subject: 'Hello',
                text: `Your password is ${password}`
            };
            await mg.messages().send(msgdata, function (error, body) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(body);
                }
            });

        })
        .catch(err=>{
            res.status(400).json({msg: "unable to create", error: err})
        })
    } else {
        res.status(400).json({msg: "you'er not authorized to set any questions on the system"})
    }
})

route.get("/", async (req,res)=>{
    let {
        token,
        questiontype,
    } = req.query
    let classIn = ""
    let date = Date()
    jwt.verify(token, secret,(err, decode)=>{
        if (err) {
            console.log(err)
        } else if (decode.data) {
           classIn = decode.data.class
        } else {
            res.status(400)
        }
    }) 
    // console.log(classIn,questiontype, date)
    if (classIn === "" || classIn === undefined || classIn === null) {
        await questionSchema.findOne({class: classIn, question_type: questiontype}).then(question=>{
            res.json({question: question,msg: "your questions"})
            console.log()
        }).catch(err=>{
            res.status(400).json({msg: "user not allowed", error: err})
        })
    }
    // if (token === "" || token===null || token === undefined) {
    //     res.status(400).json({msg: "invalid student"})
    // } else {
    //     res.json({question: question})
    // }
})

module.exports = route