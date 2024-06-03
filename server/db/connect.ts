import mongoose from 'mongoose'

const connectToMongoDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string)
    } catch(err) {
        console.error(err)
    }
}

export default connectToMongoDb