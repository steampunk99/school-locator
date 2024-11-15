const mongoose = require('mongoose');
const School = require('./models/School'); // Adjust this path to match your project structure

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Sample test data for 5 schools
const schools = [
  {
    name: "Bright Future High School",
    location: {
      district: "Kampala",
      region: "Central",
      address: "Plot 25, Kampala Road",
      coordinates: { type: "Point", coordinates: [32.5825, 0.3476] }
    },
    type: "Mixed",
    category: "Private",
    fees: {
      admissionFee: 500000,
      tuitionFee: { dayStudent: 800000, boardingStudent: 1500000 },
      otherFees: [{ name: "Development fee", amount: 100000, term: "Term 1" }]
    },
    curriculum: ["O-Level", "A-Level"],
    subjects: {
      oLevel: ["Math", "English", "Physics", "History"],
      aLevel: ["Math", "Economics", "History"]
    },
    performance: {
      UCE: { lastResults: "2023", div1Count: 50, div2Count: 30 },
      UACE: { lastResults: "2023", div1Count: 20, div2Count: 15 }
    },
    facilities: [{ name: "Library", description: "Modern library with a collection of 5000 books" }],
    contact: {
      email: "info@brightfuturehs.com",
      phone: "0771234567",
      alternativePhone: "0707654321",
      website: "https://brightfuturehs.com"
    },
    media: { logo: "https://example.com/logo.jpg", photos: ["https://example.com/photo1.jpg"] },
    admissions: {
      applicationDeadline: new Date("2024-01-15"),
      availableSpots: { dayStudents: 50, boardingStudents: 30 },
      requirements: [{ name: "ID Copy", required: true }],
      termDates: [{ term: "Term 1", startDate: new Date("2024-02-01"), endDate: new Date("2024-05-01") }]
    },
    stats: {
      studentCount: 500,
      teacherCount: 40,
      classSize: 30,
      boardingCapacity: 200
    },
    extraCurricular: [{ name: "Football", description: "Football team competes in national leagues" }],
    metadata: { isVerified: true, isActive: true, subscriptionTier: "Premium" }
  },
  {
    name: "Green Valley International School",
    location: {
      district: "Mbarara",
      region: "Western",
      address: "Plot 12, Ruti Avenue",
      coordinates: { type: "Point", coordinates: [30.6588, -0.6077] }
    },
    type: "Boarding",
    category: "International",
    fees: {
      admissionFee: 800000,
      tuitionFee: { dayStudent: null, boardingStudent: 3000000 },
      otherFees: [{ name: "ICT Fee", amount: 200000, term: "Term 2" }]
    },
    curriculum: ["Cambridge"],
    subjects: {
      cambridge: ["Mathematics", "Biology", "Economics", "Chemistry"]
    },
    performance: {
      UCE: { lastResults: "2023", div1Count: 0, div2Count: 0 },
      UACE: { lastResults: "2023", div1Count: 25, div2Count: 5 }
    },
    facilities: [{ name: "Science Labs", description: "Fully equipped science laboratories" }],
    contact: {
      email: "info@greenvalleyint.com",
      phone: "0779876543",
      alternativePhone: "0701234567",
      website: "https://greenvalleyint.com"
    },
    media: { logo: "https://example.com/logo2.jpg", photos: ["https://example.com/photo2.jpg"] },
    admissions: {
      applicationDeadline: new Date("2024-03-10"),
      availableSpots: { dayStudents: 0, boardingStudents: 100 },
      requirements: [{ name: "Passport Copy", required: true }],
      termDates: [{ term: "Term 2", startDate: new Date("2024-04-20"), endDate: new Date("2024-07-20") }]
    },
    stats: {
      studentCount: 300,
      teacherCount: 35,
      classSize: 25,
      boardingCapacity: 400
    },
    extraCurricular: [{ name: "Debate Club", description: "National level debate competitions" }],
    metadata: { isVerified: true, isActive: true, subscriptionTier: "Premium" }
  },
  {
    name: "King's College Buddo",
    location: {
      district: "Wakiso",
      region: "Central",
      address: "Plot 1, King's Road",
      coordinates: { type: "Point", coordinates: [32.4825, 0.2833] }
    },
    type: "Mixed",
    category: "Government",
    fees: {
      admissionFee: 600000,
      tuitionFee: { dayStudent: 1200000, boardingStudent: 2000000 },
      otherFees: [{ name: "Sports Fee", amount: 50000, term: "Term 3" }]
    },
    curriculum: ["O-Level", "A-Level"],
    subjects: {
      oLevel: ["Geography", "History", "Chemistry", "Biology"],
      aLevel: ["Geography", "Literature", "Economics"]
    },
    performance: {
      UCE: { lastResults: "2022", div1Count: 70, div2Count: 25 },
      UACE: { lastResults: "2022", div1Count: 30, div2Count: 10 }
    },
    facilities: [{ name: "Sports Complex", description: "State-of-the-art sports facilities" }],
    contact: {
      email: "info@kingscollegebuddo.ac.ug",
      phone: "0751237890",
      alternativePhone: "0785432190",
      website: "https://kingscollegebuddo.ac.ug"
    },
    media: { logo: "https://example.com/logo3.jpg", photos: ["https://example.com/photo3.jpg"] },
    admissions: {
      applicationDeadline: new Date("2024-02-20"),
      availableSpots: { dayStudents: 30, boardingStudents: 70 },
      requirements: [{ name: "National ID", required: true }],
      termDates: [{ term: "Term 1", startDate: new Date("2024-02-15"), endDate: new Date("2024-05-15") }]
    },
    stats: {
      studentCount: 700,
      teacherCount: 60,
      classSize: 35,
      boardingCapacity: 350
    },
    extraCurricular: [{ name: "Drama Club", description: "Annual school plays and performances" }],
    metadata: { isVerified: true, isActive: true, subscriptionTier: "Basic" }
  },
  {
    name: "St. Mary's College Kisubi",
    location: {
      district: "Entebbe",
      region: "Central",
      address: "Plot 18, Kisubi Road",
      coordinates: { type: "Point", coordinates: [32.5123, 0.0389] }
    },
    type: "Boarding",
    category: "Religious",
    fees: {
      admissionFee: 400000,
      tuitionFee: { dayStudent: null, boardingStudent: 1800000 },
      otherFees: [{ name: "Building Fund", amount: 300000, term: "Term 1" }]
    },
    curriculum: ["O-Level", "A-Level"],
    subjects: {
      oLevel: ["English", "Physics", "Math", "Chemistry"],
      aLevel: ["Math", "Physics", "Chemistry"]
    },
    performance: {
      UCE: { lastResults: "2023", div1Count: 90, div2Count: 15 },
      UACE: { lastResults: "2023", div1Count: 35, div2Count: 5 }
    },
    facilities: [{ name: "Dormitories", description: "Spacious and modern dormitories" }],
    contact: {
      email: "info@smck.ac.ug",
      phone: "0781234567",
      alternativePhone: "0759876543",
      website: "https://smck.ac.ug"
    },
    media: { logo: "https://example.com/logo4.jpg", photos: ["https://example.com/photo4.jpg"] },
    admissions: {
      applicationDeadline: new Date("2024-01-30"),
      availableSpots: { dayStudents: 0, boardingStudents: 80 },
      requirements: [{ name: "Recommendation Letter", required: true }],
      termDates: [{ term: "Term 1", startDate: new Date("2024-02-01"), endDate: new Date("2024-05-01") }]
    },
    stats: {
      studentCount: 600,
      teacherCount: 50,
      classSize: 28,
      boardingCapacity: 500
    },
    extraCurricular: [{ name: "Basketball", description: "Championship-winning basketball team" }],
    metadata: { isVerified: true, isActive: true, subscriptionTier: "Standard" }
  },
  {
    name: "Victory Junior School",
    location: {
      district: "Jinja",
      region: "Eastern",
      address: "Plot 5, Nile Crescent",
      coordinates: { type: "Point", coordinates: [33.1933, 0.4387] }
    },
    type: "Day",
    category: "Private",
    fees: {
      admissionFee: 300000,
      tuitionFee: { dayStudent: 400000, boardingStudent: null },
      otherFees: [{ name: "Transport Fee", amount: 100000, term: "Term 1" }]
    },
     curriculum: ["O-Level", "A-Level"],
        subjects: {
          oLevel: ["English", "Physics", "Math", "Chemistry"],
          aLevel: ["Math", "Physics", "Chemistry"]
    },
    performance: {
      PLE: { lastResults: "2023", div1Count: 80, div2Count: 15 }
    },
    facilities: [{ name: "Playground", description: "Outdoor play area with modern equipment" }],
    contact: {
      email: "info@victoryjuniorschool.com",
      phone: "0709876543",
      alternativePhone: "0784561234",
      website: "https://victoryjuniorschool.com"
    },
    media: { logo: "https://example.com/logo5.jpg", photos: ["https://example.com/photo5.jpg"] },
    admissions: {
      applicationDeadline: new Date("2024-01-25"),
      availableSpots: { dayStudents: 100, boardingStudents: 0 },
      requirements: [{ name: "Birth Certificate", required: true }],
      termDates: [{ term: "Term 1", startDate: new Date("2024-02-05"), endDate: new Date("2024-05-05") }]
    },
    stats: {
      studentCount: 400,
      teacherCount: 25,
      classSize: 20,
      boardingCapacity: 0
    },
    extraCurricular: [{ name: "Music Club", description: "Weekly music lessons and performances" }],
    metadata: { isVerified: true, isActive: true, subscriptionTier: "Basic" }
  }
];

// Insert sample data
const seedData = async () => {
  try {
    await School.insertMany(schools);
    console.log("Sample schools inserted successfully");
  } catch (error) {
    console.error("Error inserting sample schools:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
