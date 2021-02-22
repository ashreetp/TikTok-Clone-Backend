import mongoose from 'mongoose';

const userDbSchema = mongoose.Schema({
	fullname: String,
	phonenumber: String,
	email: String,
	username: String,
	password: String
})

export default mongoose.model('usersDb', userDbSchema)