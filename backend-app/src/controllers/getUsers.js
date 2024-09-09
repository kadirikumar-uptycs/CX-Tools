const connectDB = require('../models/db');
const User = require('../models/user');

const getAllUsers = async (req, res) => {
	try {
		await connectDB();
		const users = await User.find();
		return res.status(200).send(users);
	} catch (err) {
		console.log("error while retrieving users ", err);
		return res.status(500).send(err);
	}
};

module.exports = getAllUsers