const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://abhiranjanms5646:8aCB8YwojAA5jq6z@cluster1.3acwtwk.mongodb.net/college-form?retryWrites=true&w=majority&appName=Cluster1')
        console.log('MongoDB Connected Successfully..')
    } catch (error) {
        console.log(error)
    }
}

module.exports= connectDB