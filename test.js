#!/usr/local/bin/node

var aoauth = require('./index.js');
var config = require('./config.js');
aoauth.init( config );

//aoauth.tokenNamed( process.argv[2] )
aoauth.userFromToken( process.argv[2] )
.then( token => {
  console.log( JSON.stringify( token, null, ' ' ) );
  return Promise.resolve(true);
})
.then( () => {
  process.exit();
});