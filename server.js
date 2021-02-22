// Imports
import express from 'express';
import mongoose from 'mongoose';
import Videos from './dbModel.js';
import Users from './userDbModel.js';
import bcrypt from 'bcrypt';

// App config
const app=express();
const port=process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use((req,res,next) => {
	res.setHeader("Access-Control-Allow-Origin","*");
	res.setHeader("Access-Control-Allow-Headers","*");
	res.setHeader("Access-Control-Allow-Methods","*");
	next();
});

// DB Config
const connection_url="mongodb+srv://admin:admin@mycluster.edprm.mongodb.net/tiktok?retryWrites=true&w=majority";

mongoose.connect(connection_url,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

// API Endpoints
app.get('/',(req,res) => {
	res.send("Backend Home Page");
})

app.post('/register',(req,res) => {
	console.log(req.body.username)
	Users.findOne({username: req.body.username},(err,data) => {
		if(err) {
			console.log(err);
		} else {
			try
			{
				if(data.username == req.body.username)	
					res.send('User Exists');
			} catch {
				bcrypt.hash(req.body.password, 10, function(err, hash) {
				    // Store hash in your password DB.
				    let x=req.body;
				    x.password=hash;
					Users.create(x,(err,data) => {
						if(err){
							console.log(err);
							console.log('user not inserted');
							res.send('not ok')
						} else {
							console.log('user inserted');
							res.send('Registered');
						}
					})
				});
				
			}
		}
	})
})


app.post('/login',(req,res) => {
	
	Users.findOne({username: req.body.username},(err,data) => {
		if(err) {
			console.log(err);
			console.log('Login Failed');
		} else {
			if(data != null)
			{
				bcrypt.compare(req.body.password, data.password, function(err, result) {
				    if(result == true) {
				    	console.log('Login successfull');
						res.send('success');
				    } else {
						console.log('Login Failed');
						res.send('fail');
				    }
				});
			} else {
				console.log('Login successfull');
				res.send('fail');
			}	
		}
	})
})

app.post("/upload",(req,res) => {
	Videos.create(req.body,(err,data) => {
		if (err) {
			res.status(500).
			res.send('fail');	
		} else {
			res.status(201)
			res.send('success');
		}
	})
})

app.get("/v2/posts",(req,res) => {
	Videos.find((err,data) => {
		if(err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	})
})

app.put("/v2/posts/likeon",(req,res) => {
	const doc = Videos.findOne({_id: req.body.objid},(err,data) => {
		if(err){
			console.log(err);
		}else{
			var v=parseInt(data.likes);
			const newVal = {
				$set: {likes: v+1 }
			}
			Videos.updateOne({_id: req.body.objid},newVal,{upsert:true},(err,data) => {
				if (err) {
					console.log(err);
				}
			});
		}
	})
	res.send(req.body);
})

app.put("/v2/posts/likeoff",(req,res) => {
	const doc = Videos.findOne({_id: req.body.objid},(err,data) => {
		if(err){
			console.log(err)
		}else{
			var v=parseInt(data.likes);
			const newVal = {
				$set: {likes: v-1 }
			}
			Videos.updateOne({_id: req.body.objid},newVal,{upsert:true},(err,data) => {
				if (err) {
					console.log(err);
				}
			});
		}
	})
	res.send(req.body);
})

app.post("/v2/posts",(req,res) => {
	Videos.create(req.body,(err,data) => {
		if (err) {
			res.status(500).send(err);	
		} else {
			res.status(201).send(data);
		}
	})
})

// Listener
app.listen(port);

