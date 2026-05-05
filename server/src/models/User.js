import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true })

// Hash le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Comparer le mot de passe
userSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password)
}

export default mongoose.model('User', userSchema)
