import mongoose from 'mongoose';

const connectDb = async (DATABASE_URL)=>{
    try{
        const DB_OPTIONS = {
            dbName:"yogidb"
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log('COnnected successfully.....')

    }catch(error){
        console.log(error)
    }
}

export default connectDb