const express = require("express");
const cors = require('cors');
port =3000;
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json())
app.use(cors());

var mongo = require( './db_config' );

mongo.conn( function( err, client ) {
  if (err) console.log(err);
} );

require("./routes")(app);

const https = require("http");

var server = https.createServer(app);

server.listen(app.listen(port), () => {
    console.log(`listening on *:${port} `);
});

