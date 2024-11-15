const mongoose = require("mongoose")

const ApplicationSchema = mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    school: {type:mongoose.Schema.Types.ObjectId, ref:'School', required:true},
    applicationStatus: {type:String,enum:['Pending','Approved','Rejected'], default:'Pending',required:true},
    personalInfo: {
        dateOfBirth: {type:Date, required:true},
        gender: {type:String, required:true},
        address: {type:String, required:true},
        name:{type:String, required:true}
    },
    academicInfo: {
        previousSchool: { type: String, required: true},
        // grades - theyre gonna upload results in ui
        grades: {type: String, required:true}
    },
    essayAnswer: {type:String, required: false},
    createdAt: {type: Date, default: Date.now},
    // payment
    payment: {
        status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
        amount: { type: Number, required: true },
        transactionId: { type: String },
        paymentMethod: { type: String, enum: ['MTN-Uganda', 'Airtel-Uganda'] }
    }
})

module.exports = mongoose.model('Application', ApplicationSchema)

