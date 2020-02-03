const mongoose = require("mongoose")
const schema = mongoose.Schema

const staffSchema = new schema({
   first_name: {
       type: String,
       required: true,
       lowercase: true
   },
   last_name: {
       type: String,
       required: true,
       lowercase: true
   },
   isAdmin: {
       type: Boolean,
       required: false
   },
   email: {
       type: String,
       required: true,
       lowercase: true,
       unique: true
   },
   password: {
       type: String,
       required: true
   }
})

module.exports = mongoose.model("staff", staffSchema)