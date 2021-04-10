var ObjectId = require('mongodb').ObjectID;
var sanitize = require('mongo-sanitize');
const path = require('path');
const multer = require('multer');
const fs = require("fs");
const url = require("url");

fs.access("./document", function(error) {
    if (error) {
        fs.mkdir(path.join(__dirname, 'document'), (err) => {
            if (err) {
                return console.error(err);
            }
        
        });
    } else {

    }
  })

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, path.join(__dirname, './document'));
    },
    filename: function(req, file, callback){
      var filename = Date.now();
      switch (file.mimetype) {
        case 'image/png':
        filename = filename + ".png";
        break;
        case 'image/jpeg':
        filename = filename + ".jpeg";
        break;
        default:
        break;
      }
      callback(null, filename);
    }
});
module.exports = {

    getUser(req , res) {
        var db = require( './db_config').db();
        var url_str = req.url.split('/');
        if(url_str[4] !=undefined && url_str[4].trim() !=""){
            var id = url_str[4];
            if(ObjectId.isValid(id)){
                var query = {_id : sanitize(ObjectId(id))};
                db.collection("users").findOne(query, function(err,result){
                    if (err) throw err;
                    res.status(200).json({code:200, status:true , data:result});
                });
            }
            else
            {
                res.status(200).json({code:400, status:false , data: "Id is not valid!"});
            }         
            
        }
        else
        {
            db.collection("users").find({}).toArray(function(err, result) {
                if (err) throw err;
                res.status(200).json({code:200, status:true , data:result});
    
            });
        }

    },

    addUser(req , res) {
        const upload = multer({storage: storage,limits : {fileSize : 1000000}}).single("image");

        upload(req, res , (err) => {    
   
            if(err) return res.status(200).json({code:400, status:false , data: "image validation failed"});
            var db = require( './db_config').db();
            if(Number(req.body.phone) == NaN || req.body.phone.length != 10){

                return res.status(200).json({code:200, status:false , data:"Phone number is not valid"});
            }
            var image_url = req.protocol + '://' + req.get('host')+"/document/"+req.file['filename'];
            var dataObj= {
                first_name: sanitize(req.body.firstname), 
                last_name: sanitize(req.body.lastname),
                email:sanitize(req.body.email),
                phone_number:sanitize(Number(req.body.phone)),
                image:{path : req.file['path'], name: req.file['filename'], url:image_url}
            };
            db.listCollections().toArray(function(err, collections) {
                if(collections.length < 1){
                            db.createCollection('users', function(err, col){
                                if(err) return   res.status(500).json({code:500, status:false , data:"Unable to process! try again later"});
                                console.log('collection created')
                            })
                            db.collection("users").createIndex({ "email": 1 }, { unique: true }, function(err, collections){
                                if(err) return   res.status(500).json({code:500, status:false , data:"Unable to process! try again later"});
                            console.log('email set')
                            } );

                }
                else
                {
                collections.forEach(key => {
                    if(key['name'] === "users" && key['type'] === 'collection'){
 
                    } else {
                        db.collection("users").createIndex({ "email": 1 }, { unique: true }, function(err, collections){
                            if(err) return   res.status(500).json({code:500, status:false , data:"Unable to process! try again later"});
                        coonsole.log('collection created')
                        } );
                    }
                });
                }
                
                db.collection("users").insertOne(dataObj, function(err, result) {
                    if (err && err['code'] == 11000){
                        res.status(200).json({code:409, status:false , data:"Email already exists!"});
                    } else if(!err && result['insertedCount'] == 1){
                        res.status(200).json({code:200, status:true , data:"User added successfully"});
                    } else{
                        res.status(500).json({code:500, status:false , data:"Internal Server Error! Try again later"});
                    }
                    });
            });

        });
    },

    UpdateUser(req , res) {

        const upload = multer({storage: storage,limits : {fileSize : 1000000}}).single('image');
        upload(req, res , (err) => {
            if(err) return res.status(200).json({code:400, status:false , data: "image validation failed"});

            var db = require( './db_config').db();
            var url_str = req.url.split('/');
            if(req.file !=undefined){
                var image_url = req.protocol + '://' + req.get('host')+"/document/"+req.file['filename'];
                var dataObj= { $set: {
                    first_name: sanitize(req.body.firstname), 
                    last_name: sanitize(req.body.lastname),
                    email:sanitize(req.body.email),
                    phone_number:sanitize(Number(req.body.phone)),
                    image:{path : req.file['path'], name: req.file['filename'], url:image_url}
                }};
            }else{
                var dataObj= { $set: {
                    first_name: sanitize(req.body.firstname), 
                    last_name: sanitize(req.body.lastname),
                    email:sanitize(req.body.email),
                    phone_number:sanitize(Number(req.body.phone))
                }};
            }
            if(Number(req.body.phone) === NaN || req.body.phone.length != 10){
                return res.status(200).json({code:200, status:false , data:"Phone number is not valid"});

            }
            if(url_str[4] !=undefined && url_str[4].trim() !=""){
                var id = url_str[4];
                if(ObjectId.isValid(id)){
                    var query = {_id : sanitize(ObjectId(id))};
                    db.collection("users").updateOne(query, dataObj, function(err, result) {
                        if (err && err['code'] == 11000){
                            res.status(200).json({code:409, status:false , data:"Email already exists!"});
                        } else if(result['modifiedCount'] == 1){
                            res.status(200).json({code:200, status:true , data:"User updated successfully"});
                        } else if(result['modifiedCount'] == 0){
                            res.status(200).json({code:200, status:false , data:"No changes to updated", req:req.body});
                        } else{
                            res.status(500).json({code:500, status:false , data:"Internal Server Error! Try again later", image:image});
                        }
                    });
                }
                else
                {
                    res.status(200).json({code:400, status:false , data: "Id is not valid!"});
                }    
            }  

        });
          
    },

    DeleteUser(req , res) {
        var db = require( './db_config').db();
        var url_str = req.url.split('/');
        if(url_str[4] !=undefined && url_str[4].trim() !=""){
            var id = url_str[4];
            if(ObjectId.isValid(id)){
                var query = {_id : sanitize(ObjectId(id))};
                db.collection("users").deleteOne(query, function(err,result){
                    if(result['deletedCount'] == 1){
                        res.status(200).json({code:200, status:true , data:"User deleted successfully"});
                    } else if(result['deletedCount'] == 0){
                        res.status(200).json({code:200, status:false , data:"No record found to deleted"});
                    } else{
                        res.status(500).json({code:500, status:false , data:"Internal Server Error! Try again later"});
                    }
                });
            }
            else
            {
                res.status(200).json({code:400, status:false , data: "Id is not valid !"});
            }         
            
        }
    },
    
    getImage( req ,res) {

        var request = url.parse(req.url, true);

        var action = request.pathname;

        var filePath = path.join(__dirname,"./"+
            action).split("%20").join("");

        fs.exists(filePath, function (exists) {
      
            if (!exists) {
                res.writeHead(404, { 
                    "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
            }

            var ext = path.extname(action);
      

            var contentType = "text/plain";
            if (ext === ".png") {
                contentType = "image/png";
            }
      
            res.writeHead(200, { 
                "Content-Type": contentType });
      
            fs.readFile(filePath, 
                function (err, content) {
                    res.end(content);
                });
        });
    
    },

};