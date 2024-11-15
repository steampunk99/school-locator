const mongoose = require('mongoose')
const {MongoMemoryServer} = require('mongodb-memory-server')
const request = require('supertest')
const app = require('../../app')
const Application = require('../models/Application')
const User = require('../models/User')
const School = require('../models/School')

let mongoServer;
let token;
let schoolId

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)

    // create a test user and get token
    const userData = {username: 'testuser', email:'testexample.com', password:'password', role:'student'}
    await User.create(userData)
    const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({email:userData.email, password:userData.password})

    token = loginResponse.body.token

    // create a test school
    const schoolData = {name: 'Test school',location: 'Test location', type:'public',admissionFee:10000}
    const schoolResponse = await request(app)
    .post('api/schools/add')
    .set('Authorization', `Bearer ${token}`)
    .send(schoolData)
    schoolId = schoolResponse.body.school._id
})

afterAll(async ()=>{
    await mongoose.disconnect()
    await mongoServer.stop()
})

beforeEach(async ()=> {
    await Application.deleteMany({})
})

describe('Application API', ()=> {
    it('should submit an application', async()=> {
        const applicationData = {
            school: schoolId,
            personalInfo:{
                dateOfBirth: '2000-02-02',
                gender: 'Male',
                address: 'Test Address'
            },
            academicInfo: {
                previousSchool: 'Previous Test School',
                grades: 'A'
            },
            essayAnswer: 'Test Essay Answer'
        }

        const response = await request(app)
        .post('api/schools/submit')
        .set('Authorization', `Bearer ${token}`)
        .send(applicationData)

        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe('Application submitted successfully.')
    })

    it('should get school applications', async ()=> {
        //First submit an application

        const applicationData = {
            school: schoolId,
            personalInfo: {dateOfBirth: '2000-02-02', gender: 'Male', address: 'Test Address'},
            academicInfo: {previousSchool: 'Previous Test School', grades:'A'},
            essayAnswer: 'Test Essay Answer'
        }
        await request(app)
        .post('/api/schools/submit')
        .set('Authorization', `Bearer ${token}`)
        .send(applicationData)

        // Now, get the applications for the school
        const response = await request(app)
        .get(`/api/applications/school/${schoolId}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    })
})