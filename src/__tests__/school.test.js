const mongoose = require("mongoose")
const {MongoMemoryServer} = require('mongodb-memory-server')
const request = require('supertest')
const { app, connectDB, closeDB } = require('../../app')
const School = require('../models/School')
require('dotenv').config();

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri; // Set the MONGO_URI to the in-memory database
    await connectDB(); // Use the connectDB function
  });
  
  afterAll(async () => {
    await closeDB(); // Use the closeDB function
    await mongoServer.stop();
  })

describe('School API', () => {
    it('should create a new school', async () => {
      const schoolData = {
        name: 'Test School',
        location: 'Test Location',
        type: 'public',
        admissionFee: 1000,
        description: 'A test school'
      };
  
      const response = await request(app)
        .post('/api/schools/add')
        .send(schoolData);
  
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('School added successfully');
      expect(response.body.school.name).toBe(schoolData.name);
    });
  
    it('should get all schools', async () => {
      await School.create({ name: 'School 1', location: 'Location 1', type: 'public', admissionFee: 1000 });
      await School.create({ name: 'School 2', location: 'Location 2', type: 'private', admissionFee: 2000 });
  
      const response = await request(app).get('/api/schools/');
  
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
  
    it('should search schools', async () => {
      await School.create({ name: 'ABC School', location: 'Location 1', type: 'public', admissionFee: 1000 });
      await School.create({ name: 'XYZ School', location: 'Location 2', type: 'private', admissionFee: 2000 });
  
      const response = await request(app).get('/api/schools/search?name=ABC');
  
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('ABC School');
    });
  });