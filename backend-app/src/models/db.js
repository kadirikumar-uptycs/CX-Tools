require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = require('../models/db-creds');


let isConnected = false;

const connectDB = async () => {
	if (isConnected) {
		console.log('⏩ Already connected to MongoDB');
		return;
	}
	try {
		await mongoose.connect(MONGODB_URI, {
			dbName: process.env.MONGO_DB_NAME,
		});
	} catch (err) {
		console.error('⛔ Error connecting to MongoDB', err);
	}
};



mongoose.connection.on('connected', () => {
	isConnected = true;
	console.log('✅ Mongoose connected to DB 🔗');
});

mongoose.connection.on('disconnected', () => {
	console.warn('⚠️  Mongoose disconnected. Attempting to reconnect...');
	isConnected = false;
});


mongoose.connection.on('reconnected', () => {
	console.log('⌛ Mongoose Reconnected to DB 🔗');
});

mongoose.connection.on('error', (err) => {
	console.error('⛔ Mongoose connection error:', err);
	isConnected = false;
});

module.exports = connectDB;