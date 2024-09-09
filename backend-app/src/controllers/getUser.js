const connectDB = require('../models/db');
const User = require('../models/user');

const getUser = async (req, res) => {
	try {
		await connectDB();
		let userId = req?.user._id;
		const userInfo = await User.findById(userId);
		return res.status(200).send(userInfo);
	} catch (err) {
        console.log("error while retrieving users ", err);
		return res.status(500).send(err);
	}
};

module.exports = getUser