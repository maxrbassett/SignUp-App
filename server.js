
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoClient = require('mongodb').MongoClient;
var path = require('path');
//var fs = require('file-system');
var fs = require('fs');
var multer = require('multer');
var assert = require('assert');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var db;
var ObjectId = require('mongodb').ObjectId;
var schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true,})

//mongoose.connect(`mongodb://bassetm:012694mrb@ds055555.mlab.com:55555/heroku_kvx8k047`, {useMongoClient: true,})
 //mongoose.connect('mongodb://maxbassett:012694mrb@ds023455.mlab.com:23455/heroku_fk7knb54', {useMongoClient: true,})
 

var memberSchema = mongoose.Schema({
	LastName: {type: String},
	WFirstName: {type: String},
	HFirstName: {type: String},
	HPhone: {type: String},
	WPhone: {type: String},
	HEmail: {type: String},
	WEmail: {type: String},
	Address: {type: String},
	HBirthday: {type: String},
	WBirthday: {type: String},
	MoveinDate: {type: Date},
	ExpectedExit: {type: String},
	HMission: {type: String},
	WMission: {type: String},
	HVocalAbilities: {type: String},
	HPianoAbilities: {type: String},
	HOrganAbilities: {type: String},
	HConductingAbilities: {type: String},
	WVocalAbilities: {type: String},
	WPianoAbilities: {type: String},
	WOrganAbilities: {type: String},
	WConductingAbilities: {type: String},
	HSchool: {type: String},
	WSchool: {type: String},
	HMajor: {type: String},
	WMajor: {type: String},
	HWork: {type:String},
	WWork: {type: String},
	HHobbies: {type: String},
	WHobbies: {type: String},
	img: {data: Buffer, contentType: String, required: false }

});

var Member = mongoose.model('Member', memberSchema);


mongoClient.connect(process.env.MONGODB_URI,(err,database) =>{
		if(err) return console.log(err)
		db=database
	var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname));
app.set('views', path.join(__dirname, 'views'));




app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname + '/index.html'));
})

app.get('/profile/:_id/image', function(req,res,next) {
	var id=req.params._id;
	console.log(id);
	Member.findById(id, function(err,user) {
		if (err) return next(err);
		res.contentType(user.img.contentType);
		res.send(user.img.data);
	});
  });


  app.post('/upload/:_id', multer({ dest: './uploads/'}).single('upl'), function(req,res){
	var imgPath = req.file.path;
	var id=req.params._id;
	console.log(imgPath);
	Member.findById(id, function(err, mem){
		mem.img.data = fs.readFileSync(imgPath);
    	mem.img.contentType = 'image/png';
    	mem.save(function (err, a) {
      	if (err) throw err;
      	console.error('saved img to mongo');
      	res.redirect(req.get('referer'));
		});
	});
});

  app.get('/photo/:_id', (req,res) => {
	Member.findById(req.params._id, function(err, mem){
		console.log(mem.img.contentType);
		if(mem.img.contentType != undefined){
			console.log("i am in if");
    		console.log(req.params._id)
    		Member.findById(req.params._id, function (err, doc) {
        	if (err) return next(err);
        	res.contentType(doc.img.contentType);
        	res.send(doc.img.data);
	  	});
	}else{
		console.log("i am in else");
		res.sendFile(path.resolve(__dirname + '/blank-profile-pic.png'));
	}
	});
})
    

// app.post('/upload/:_id', function(req, res){
// 	Member.findById(id, function(err, doc){
// 		doc.img.data = fs.readFileSync(req.files.userPhoto.path);
// 		doc.img.contentType = 'image/png';
// 		doc.img.save();
// 		res.render('member.ejs', {members: doc});
// 		})
// 	})

	
 

app.post('/WardForm2', (req, res) => {
	db.collection('members').save(req.body, (err, result) => {
		if(err) return console.log(err)
		console.log('Saved to your Database')
	})
	res.redirect('/ThankYou')
})

app.get('/ThankYou', (req, res) => {
	res.sendFile(path.resolve(__dirname + '/ThankYou.html'));
})


app.get('/index', (req,res) => {
	Member.find({}).sort({"MoveinDate": 1}).exec(function(err, users){
		var userMap = {};
		
			users.forEach(function(user) {
			  userMap[user._id] = user;
			});
		
			res.render('index.ejs', {members: users});  
		  });
	
})

app.get('/member/:_id', (req,res) => {
	var id = req.params._id
	var x =db.collection('members').findOne({_id: ObjectId(id)})
	Member.findById(id, function(error, doc) {
      assert.ifError(error);
      res.render('member.ejs', {members: doc})
    });
})

app.get('/pianoMembers', (req,res) => {

	Member.find({$or: [{HPianoAbilities: "4-Plays Piano"}, {HPianoAbilities: "5-Very good piano"}, {WPianoAbilities: "4-Plays Piano"}, {WPianoAbilities:"5-Very good piano"}]
}, function(err, users) {
		var userMap = {};
	
		users.forEach(function(user) {
		  userMap[user._id] = user;
		});
	
		res.render('index.ejs', {members: users});  
	  });
})

app.get('/organMembers', (req,res) => {

	Member.find({$or: [{HOrganAbilities: "4-Good at Organ"}, {HOrganAbilities: "5-Very good at Organ"}, {WOrganAbilities: "4-Good at Organ"}, {WOrganAbilities:"5-Very good at Organ"}]
}, function(err, users) {
		var userMap = {};
	
		users.forEach(function(user) {
		  userMap[user._id] = user;
		});
	
		res.render('index.ejs', {members: users});  
	  });
	
})

app.get('/conductingMembers', (req,res) => {

	Member.find({$or: [{HConductingAbilities: "4-Good at conducting"}, {HConductingAbilities: "5-Very good at conducting"}, {WConductingAbilities: "4-Good at conducting"}, {WConductingAbilities:"5-Very good at conducting"}]
}, function(err, users) {
		var userMap = {};
	
		users.forEach(function(user) {
		  userMap[user._id] = user;
		});
	
		res.render('index.ejs', {members: users});  
	  });
})

app.get('/singingMembers', (req,res) => {

	  Member.find({$or: [{HVocalAbilities: "4-Good at singing"}, {HVocalAbilities: "5 - Excellent at singing"}, {WVocalAbilities: "4-Good at singing"}, {WVocalAbilities:"5-Very Vocal"}]
	}, function(err, users) {
			var userMap = {};
		
			users.forEach(function(user) {
			  userMap[user._id] = user;
			});
		
			res.render('index.ejs', {members: users});  
		  });
	
})

app.get('/delete', (req,res) => {
	db.collection('members').find().toArray(function(err, result) {
  		if (err) return console.log(err)
  		res.render('deletePage.ejs', {members: result})
	})
})

app.get('/deleteMembers/:_id', (req, res) => {
	var id = req.params._id;
	Member.findOneAndRemove({'_id' : id}, function(err, doc){
		res.redirect('/delete');
	})
})







// require('dotenv').config();
// const express = require('express');
// const fileUpload= require('express-fileupload');
// const path = require('path');
// const bodyParser = require('body-parser');
// const app = express();
// const mongoClient = require('mongodb').MongoClient;

// // var fs = require('fs');

// // var thumbnailPluginLib = require('mongoose-thumbnail');
// // var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
// // var make_upload_to_model = thumbnailPluginLib.make_upload_to_model;
// // var uploads_base = path.join(__dirname, "uploads");
// // var uploads = path.join(uploads_base, "u");

// var assert = require('assert');
// var mongoose = require('mongoose');
// var db;
// var ObjectId = require('mongodb').ObjectId;
// var schema = mongoose.Schema;
// mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true,})

// //mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds023550.mlab.com:23550/ward-form`, {useMongoClient: true,})
//  //mongoose.connect('mongodb://maxbassett:012694mrb@ds023455.mlab.com:23455/heroku_fk7knb54', {useMongoClient: true,})
 

// var memberSchema = mongoose.Schema({
// 	LastName: {type: String},
// 	WFirstName: {type: String},
// 	HFirstName: {type: String},
// 	HPhone: {type: String},
// 	WPhone: {type: String},
// 	Address: {type: String},
// 	HBirthday: {type: String},
// 	WBirthday: {type: String},
// 	MoveinDate: {type: String},
// 	ExpectedExit: {type: String},
// 	HMission: {type: String},
// 	WMission: {type: String},
// 	HVocalAbilities: {type: String},
// 	HPianoAbilities: {type: String},
// 	HOrganAbilities: {type: String},
// 	HConductingAbilities: {type: String},
// 	WVocalAbilities: {type: String},
// 	WPianoAbilities: {type: String},
// 	WOrganAbilities: {type: String},
// 	WConductingAbilities: {type: String},
// 	HSchool: {type: String},
// 	WSchool: {type: String},
// 	HMajor: {type: String},
// 	WMajor: {type: String},
// 	HWork: {type:String},
// 	WWork: {type: String},
// 	HHobbies: {type: String},
// 	WHobbies: {type: String},

// });
// // memberSchema.plugin(thumbnailPlugin, {
// // 	name: "photo",
// //     format: "png",
// //     size: 80,
// //     inline: false,
// //     save: true,
// //     upload_to: make_upload_to_model(uploads, 'photos'),
// //     relative_to: uploads_base
// // });

// var Member = mongoose.model('Member', memberSchema);


// mongoClient.connect(process.env.MONGODB_URI,(err,database) =>{
// 		if(err) return console.log(err)
// 		db=database
// 	var server = app.listen(process.env.PORT || 3000, function () {
//     var port = server.address().port;
//     console.log("App now running on port", port);
//   });
// })

// app.use(fileUpload());
// app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
// app.use(express.static(__dirname));

// app.get('/', (req, res) => {
// 	res.sendFile(path.resolve(__dirname + '/index.html'));
// })


// // app.post('/upload/:_id/:_img', function(req, res){
// // 	var id = req.params._id;
// // 	var picture = req.params._img;
// // 	Member.findById(id, function(err, doc){
// // 		doc.img.data = fs.readFileSync(__dirname + picture);
// // 		doc.img.contentType = 'image/png';
// // 		db.collection('members').save(doc.img)
// // 		})
// // 	})

// 	// var id = req.params._id;
// 	// Member.findById(id, function(err, doc){
// 	// 	doc.photo.name = req
// 	// 	console.log(doc.photo.name)
// 	// })	
 

// app.post('/WardForm2', (req, res) => {
// 	db.collection('members').save(req.body, (err, result) => {
// 		if(err) return console.log(err)
// 		console.log('Saved to your Database')
// 	})
// 	res.redirect('/ThankYou')
// })

// app.get('/ThankYou', (req, res) => {
// 	res.sendFile(path.resolve(__dirname + '/ThankYou.html'));
// })


// app.get('/index', (req,res) => {
//  		db.collection('members').find().toArray(function(err, result) {
//   		if (err) return console.log(err)
//   		res.render('index.ejs', {members: result})
// 	})
// })

// app.get('/member/:_id', (req,res) => {
// 	var id = req.params._id
// 	var x =db.collection('members').findOne({_id: ObjectId(id)})
// 	Member.findById(id, function(error, doc) {
//       assert.ifError(error);
//       res.render('member.ejs', {members: doc})
//       doc
//     });
// })

// app.get('/pianoMembers', (req,res) => {
// 	db.collection('members').find({$or: [{HPianoAbilities: "4-Plays Piano"}, {HPianoAbilities: "5-Very good piano"}, {WPianoAbilities: "4-Plays Piano"}, {WPianoAbilities:"5-Very good piano"}]
// 	}).toArray(function(err, result) {
// 		if(err) return console.log(err)
// 			res.render('index.ejs', {members: result})
// 	})
// })

// app.get('/organMembers', (req,res) => {
// 	db.collection('members').find({$or: [{HOrganAbilities: "4-Good at Organ"}, {HOrganAbilities: "5-Very good at Organ"}, {WOrganAbilities: "4-Good at Organ"}, {WOrganAbilities:"5-Very good at Organ"}]
// 	}).toArray(function(err, result) {
// 		if(err) return console.log(err)
// 			res.render('index.ejs', {members: result})
// 	})
// })

// app.get('/conductingMembers', (req,res) => {
// 	db.collection('members').find({$or: [{HConductingAbilities: "4-Good at conducting"}, {HConductingAbilities: "5-Very good at conducting"}, {WConductingAbilities: "4-Good at conducting"}, {WConductingAbilities:"5-Very good at conducting"}]
// 	}).toArray(function(err, result) {
// 		if(err) return console.log(err)
// 			res.render('index.ejs', {members: result})
// 	})
// })

// app.get('/singingMembers', (req,res) => {
// 	db.collection('members').find({$or: [{HVocalAbilities: "4-Good at singing"}, {HVocalAbilities: "5 - Excellent at singing"}, {WVocalAbilities: "4-Good at singing"}, {WVocalAbilities:"5-Very Vocal"}]
// 	}).toArray(function(err, result) {
// 		if(err) return console.log(err)
// 			res.render('index.ejs', {members: result})
// 	})
// })

// app.get('/delete', (req,res) => {
// 	db.collection('members').find().toArray(function(err, result) {
//   		if (err) return console.log(err)
//   		res.render('deletePage.ejs', {members: result})
// 	})
// })

// app.get('/deleteMembers/:_id', (req, res) => {
// 	var id = req.params._id;
// 	Member.findOneAndRemove({'_id' : id}, function(err, doc){
// 		res.redirect('/delete');
// 	})
// })

