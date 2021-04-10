const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb://localhost:27017";

var connection;

module.exports = {

  conn: function( callback ) {
    MongoClient.connect( url,  { useUnifiedTopology: true }, function( err, client ) {
      connection  = client.db('arkenea');
      return callback( err );
    } );
  },

  db: function() {
    return connection;
  }
};