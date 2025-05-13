const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hashing the password before saving
userSchema.pre('save', async function(next) {
 
  console.log(`before hashing the password is:${this.password}`);
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  console.log(` after hashing the password this.password :${this.password}`);
  next();
});

module.exports = mongoose.model('User', userSchema); 