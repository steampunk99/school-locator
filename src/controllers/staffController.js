const Staff = require('../models/Staff')

// add staff members
exports.addStaffMember = async(req, res) => {
    try {
        const {user, school, position} = req.body

        const newStaff = new Staff({user, school, position})
        await newStaff.save()

        res.status(201).json({message: 'Staff member added successfully', staff:newStaff})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: 'server error', error: error.message})
    }
    
}

// get school staff members
exports.getSchoolStaff = async (req, res) => {
    try {
        const schoolId = req.params.schoolId
        const staff = await Staff.find({school: schoolId})
        .populate('user', 'username email')

        res.json(staff)
    }
    catch(error ) {
        console.error(error)
        res.status(500).json({messgae: 'Server Error', error: error.message})
    }
}

