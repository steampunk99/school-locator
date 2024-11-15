const Enrollment = require('../models/Enrollment')

// enroll student
exports.enrollStudent = async (req, res) => {
    try {
        const {studentId, schoolId,studentStatus} = req.body

        const newEnrollment = new Enrollment({
            student: studentId,
            school:schoolId,
            studentStatus:studentStatus
            
        })

        await newEnrollment.save()
        res.status(201).json({message: 'Student enrolled successfully',newEnrollment:newEnrollment})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error', error: error.message})
    }
}

// get all enrollments
exports.getSchoolEnrollments = async (req, res) => {
    try {
        const schoolId = req.params.schoolId
        const enrollments = await Enrollment.find({school:schoolId})
        .populate('student', 'username email')
        .sort('-enrollmentDate')
        re.json(enrollments)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error', error:error.message})
    }
}