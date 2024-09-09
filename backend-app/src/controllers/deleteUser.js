const connectDB = require('../models/db');
const User = require('../models/user');

const deleteUser = async (req, res) => {
	try {
		await connectDB();
		let userId = req.params.id;
		await User.findByIdAndDelete(userId);
		return res.status(200).send('User deleted successfully');
	} catch (err) {
		console.log("error while deleting the user", err);
		return res.status(500).send(err);
	}
};

module.exports = deleteUser