import mongoose from 'mongoose';

const tiktokSchema = mongoose.Schema({
	url: String,
	channel: String,
	description:String,
	song: String,
	likes: Number,
	comments: Number,
	shares: Number,
})

export default mongoose.model('tiktokVideos', tiktokSchema)