require('dotenv').config()

let password = process.env.PASSWORD

module.exports = {
	MongoURI:
		`mongodb+srv://DCN:${password}@cluster0.0qick.mongodb.net/Cluster0?retryWrites=true&w=majority`,
};
