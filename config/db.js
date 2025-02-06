const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const DB_NAME = "db_comp3133_employee"
        const DB_USER_NAME = 'admin'
        const DB_PASSWORD = 'harin123'
        const CLUSTER_ID = 'pujm6'
        const mongoURI = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster0.${CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`        
        await mongoose.connect(mongoURI);
        console.log('MongoDB Atlas Connected...');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB; 