const School = require('../models/School');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school_logos',
    allowed_formats: ['jpg', 'png', 'jpeg']
  },
});

// Configure multer
const upload = multer({ storage: storage });


// PUBLIC RIGHTS

//search schools
exports.searchSchools = async (req, res) => {
    try {
        const { 
            query,
            district,
            region,
            type,
            category,
            curriculum,
            maxTuition,
            hasBoarding,
            sortBy = 'name',
            sortOrder = 'asc',
            limit = 10, 
            page = 1 
        } = req.query;

        let searchQuery = {};

        // Text search
        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { 'location.district': { $regex: query, $options: 'i' } }
            ];
        }

        // Location filters
        if (district) {
            searchQuery['location.district'] = { 
                $regex: new RegExp(district, 'i')
            };
        }
        if (region) {
            searchQuery['location.region'] = region;
        }

        // School type filter
        if (type) {
            searchQuery.type = type;
        }

        // Category filter
        if (category) {
            searchQuery.category = category;
        }

        // Curriculum filter
        if (curriculum) {
            searchQuery.curriculum = curriculum;
        }

        // Tuition fee filter
        if (maxTuition) {
            searchQuery['fees.tuitionFee.dayStudent'] = { 
                $lte: parseInt(maxTuition) 
            };
        }

        // Boarding filter
        if (hasBoarding === 'true') {
            searchQuery.type = { $in: ['Boarding', 'Mixed'] };
        }

        // Active schools only
        searchQuery['metadata.isActive'] = true;

        // Enhanced sorting
        let sortOptions = {};
        switch (sortBy) {
            case 'performance':
                sortOptions = { 'performance.UCE.div1Count': sortOrder === 'asc' ? 1 : -1 };
                break;
            case 'tuition':
                sortOptions = { 'fees.tuitionFee.dayStudent': sortOrder === 'asc' ? 1 : -1 };
                break;
            default:
                sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        }

        const resultsPerPage = parseInt(limit);
        const currentPage = parseInt(page);

        const schools = await School.find(searchQuery)
            .sort(sortOptions)
            .limit(resultsPerPage)
            .skip(resultsPerPage * (currentPage - 1));

        const totalResults = await School.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            data: schools,
            total: totalResults,
            page: currentPage,
            totalPages: Math.ceil(totalResults / resultsPerPage)
        });

    } catch (error) {
        console.error("Error during school search:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while searching for schools',
            error: error.message
        });
    }
};


// get single school by id || Can be a public one too
exports.getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({
                success: false,
                message: 'School not found',
            });
        }
        res.status(200).json({
            success: true,
            data: school,
        });
    } catch (error) {
        console.error('Error fetching school by ID:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the school',
            error: error.message,
        });
    }
};


// SUPER ADMIN RIGHTS

// get all schools
exports.getAllSchools = async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// delete schools
exports.deleteSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        if (school.logo) {
            const publicId = school.logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await School.findByIdAndDelete(req.params.id);
        res.json({ message: 'School deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// add schools
exports.addSchools = async (req, res) => {
    try {
        upload.single('logo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file', error: err.message });
            }

            const { name, location, type,year, admissionFee, description, applicationDeadline, availableSpots, requirements, website } = req.body;

            const newSchool = new School({
                name,
                location,
                type,
                admissionFee,
                description,
                applicationDeadline,
                availableSpots,
                requirements: requirements.split(',').map(req => req.trim()),
                website,
                year,
                logo: req.file ? req.file.path : null // Cloudinary URL
            });

            await newSchool.save();

            res.status(201).json({ message: 'School added successfully', school: newSchool });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update school
exports.updateSchool = async (req, res) => {
    try {
        upload.single('logo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file', error: err.message });
            }

            const updates = req.body;
            const schoolId = req.params.id;

            if (req.file) {
                const school = await School.findById(schoolId);
                if (school.logo) {
                    const publicId = school.logo.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                updates.logo = req.file.path;
            }

            if (updates.requirements) {
                updates.requirements = updates.requirements.split(',').map(req => req.trim());
            }

            const updatedSchool = await School.findByIdAndUpdate(schoolId, updates, { new: true, runValidators: true });
            if (!updatedSchool) {
                return res.status(404).json({ message: 'School not found' });
            }

            res.json({ message: 'School updated successfully', school: updatedSchool });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add this new function
exports.getSimilarSchools = async (req, res) => {
  try {
    const { schoolId, category, region, type } = req.query;
    
    const query = {
      'metadata.isActive': true // Only get active schools
    };

    // Exclude current school if provided
    if (schoolId) {
      query._id = { $ne: schoolId };
    }

    // Add filters if provided
    if (category) query.category = category;
    if (region) query['location.region'] = region;
    if (type) query.type = type;

    // Find schools with similar characteristics
    const similarSchools = await School.find(query)
      .limit(5) // Limit to 5 similar schools
      .select('name logo type category location.region') // Select only needed fields
      .sort({ 
        // You can add custom sorting logic here
        // For example, sort by rating if you have that field
        'metadata.rating': -1,
        name: 1
      });

    res.status(200).json({
      success: true,
      data: similarSchools
    });
  } catch (error) {
    console.error("Error fetching similar schools:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching similar schools',
      error: error.message
    });
  }
};

// Add gallery images
exports.addGalleryImages = async (req, res) => {
  try {
    const schoolId = req.params.id;
    const images = req.files; // Assuming multiple file upload

    const imageUrls = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'school_gallery'
        });
        return {
          url: result.secure_url,
          caption: '',
          isMain: false
        };
      })
    );

    const school = await School.findByIdAndUpdate(
      schoolId,
      { 
        $push: { 
          'media.gallery': { 
            $each: imageUrls 
          } 
        } 
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: school.media.gallery
    });
  } catch (error) {
    console.error('Error adding gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding gallery images',
      error: error.message
    });
  }
};

// Remove gallery image
exports.removeGalleryImage = async (req, res) => {
  try {
    const { schoolId, imageId } = req.params;

    const school = await School.findById(schoolId);
    const image = school.media.gallery.id(imageId);

    if (image) {
      // Delete from Cloudinary
      const publicId = image.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);

      // Remove from database
      school.media.gallery.pull(imageId);
      await school.save();
    }

    res.status(200).json({
      success: true,
      message: 'Image removed successfully'
    });
  } catch (error) {
    console.error('Error removing gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing gallery image',
      error: error.message
    });
  }
};


