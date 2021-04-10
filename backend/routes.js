const UserFunction=require("./UserFunction");

module.exports = (app) => {

    //======================== Users Routes =========================//
    app.get("/arkenea/api/getUser", UserFunction.getUser)
    app.get("/arkenea/api/getUser/:UserID", UserFunction.getUser)
    app.post("/arkenea/api/addUser", UserFunction.addUser);
    app.put("/arkenea/api/updateUser/:UserID", UserFunction.UpdateUser);
    app.delete("/arkenea/api/deleteUser/:userID", UserFunction.DeleteUser);
    app.get("/document/:image", UserFunction.getImage);
    app.post("/uploadimage/", UserFunction.uploadImage);

    
    //======================== Not found urls =======================//

    app.get('*', function(req, res){
      res.status(404).json({status:false , msg:"Request url not found!"});
    });


};
  
