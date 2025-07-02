// to connect project to mongodb
import mongoose from 'mongoose';


const connectDB = async() => {
    mongoose.connection.on('connected',() =>
        console.log('MongoDB connected successfully'))

        await mongoose.connect(`${process.env.MONGODB_URI}/lms`,)
}

export default connectDB;