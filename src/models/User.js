const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },  // Removed unique: true
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'admin', 'superadmin'], required: true, default: 'student' },
    createdAt: { type: Date, default: Date.now },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
});

// Hash password before saving to db
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
