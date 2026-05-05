import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI manquante')
  const conn = await mongoose.connect(uri)
  console.log(`✅ MongoDB connecté: ${conn.connection.host}`)
}

export default connectDB
