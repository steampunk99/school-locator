// src/routes/schools.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const schoolController = require('../controllers/schoolController');
const enrollmentController = require('../controllers/enrollmentController')
const applicationController = require('../controllers/applicationController')
const programController = require('../controllers/programController')
const staffController = require('../controllers/staffController');
const feeController = require('../controllers/feeController');
const dashboardController = require('../controllers/dashboardController');
const studentController = require('../controllers/studentController');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for gallery
const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school_gallery',
    allowed_formats: ['jpg', 'png', 'jpeg']
  },
});

// Configure multer for gallery uploads
const upload = multer({ storage: galleryStorage });

// public url for school search
router.get('/search', schoolController.searchSchools);

// Add similar schools route BEFORE the :id route
router.get('/similar', schoolController.getSimilarSchools);

// APPLICATION - Public route for submitting application
router.post('/application/submit', applicationController.submitApplication);


// PAYMENT
router.post('application/pay', applicationController.processPayment)

// private urls for school -- TBD -auth
router.post('/add', schoolController.addSchools)
router.get('/:id', schoolController.getSchoolById)
router.get('/', schoolController.getAllSchools)
router.put('/:id', schoolController.updateSchool)
router.delete('/:id', schoolController.deleteSchool)
router.get('/:schoolId/applications', applicationController.getSchoolApplications)
// router.post('/approve/:applicationId', applicationController)
router.put('/update/:applicationId', applicationController.updateApplicationStatus)

// PREMIUM FEATURES
// school programs
router.post('/programs/add', programController.addProgram)
router.get('/:schoolId/programs', programController.getSchoolPrograms)
// add and edit and delete

// student enrollment
router.post('/enroll', enrollmentController.enrollStudent)
router.get('/:schooldId/enrollments', enrollmentController.getSchoolEnrollments)

// New admin routes
router.get('/:schoolId/students', studentController.getSchoolStudents);
router.put('/students/:enrollmentId', studentController.updateStudentStatus);
router.post('/staff', staffController.addStaffMember);
router.get('/:schoolId/staff', staffController.getSchoolStaff);
router.post('/fees', feeController.addFee);
router.get('/:schoolId/fees', feeController.getSchoolFees);

// school gallery images
router.post('/:id/gallery', upload.array('images', 10), schoolController.addGalleryImages);
router.delete('/:schoolId/gallery/:imageId', schoolController.removeGalleryImage);


router.get('/dashboard-stats', dashboardController.getDashboardStats)



module.exports = router;