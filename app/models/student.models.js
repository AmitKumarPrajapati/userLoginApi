const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    name: String,
    college: String,
    age: String,
},{
    timestamps: true
})

module.exports =  mongoose.model('Student', StudentSchema) 