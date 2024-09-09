const connectDB = require('../models/db');
const User = require('../models/user');

const updateUser = async (req, res) => {
	try {
		await connectDB();
		let userId = req.params.id;
		let updatedData = req.body;
		const updatedUserInfo = await User.findByIdAndUpdate(
			userId,
			{
				$set: updatedData
			},
			{ new: true }
		);
		return res.status(200).send(updatedUserInfo);
	} catch (err) {
		console.log("error while editing user", err);
		res.status(500).send(err);
	}
};

module.exports = updateUser