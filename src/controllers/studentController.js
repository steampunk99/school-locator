const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// get school students
exports.getSchoolStudents = async (req, res) => {
    try {
        const schoolId = req.params.schoolId
        const enrollments = await Enrollment.find({school: schoolId, studentStatus:'Active'})
        .populate('student', 'username email')
        res.json(enrollments)
    } 
    catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error',error:error.messsage})
    }
}

// update student status
exports.updateStudentStatus = async (req, res) => {
    try {
        const {enrollmentId} = req.params
        const {studentStatus} = req.body

        const enrollment = await Enrollment.findByIdAndUpdate(enrollmentId, {studentStatus}, {new:true, runValidators:true})
        .populate('student', 'username email')

        if(!enrollment) {
            return res.status(404).json({message: 'Student enrollment found anywhere.'})
        }
        res.json({message: 'Student status updated successfully', enrollment})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({
            message: 'server error bro',
            error: error.message
        })
    }
}