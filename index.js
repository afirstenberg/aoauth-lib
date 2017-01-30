
var isInitialized = false;
var name = 'AOauth';
var conf;

var init = function( config ){
  conf = config;
};
exports.init = init;

var firebase = function(){
  var fb = require('firebase');
  if( isInitialized ){
    return Promise.resolve( fb.app( name ) );
  } else {
    isInitialized = true;
    var ret = firebase.initializeApp( conf.firebase, name );
    var auth = ret.auth();
    auth.signInWithEmailAndPassword( conf.aoauth.id, conf.aoauth.secret )
      .then( user => {
        console.log( user );
        return Promise.resolve( ret );
      });
  }
};

var db = function(){
  return firebase()
    .then( fb => {
      return Promise.resolve( fb.database() );
    });
};

var nodeValue = function( path, name ){
  return db()
    .then( db => {
      var tokens = db.ref(path);
      var tokenRef = tokens.child( name );
      return tokenRef.once('value');
    })
    .then( data => {
      return Promise.resolve( data.val() );
    });
};

var tokenNamed = function( token ){
  return nodeValue( '/token', token );
};
exports.tokenNamed = tokenNamed;

var user = function( uid ){
  return nodeValue( '/user', uid );
};
exports.user = user;

var userFromToken = function( token ){
  tokenNamed( token )
    .then( tokenVal => {
      return user( tokenVal. uid );
    });
};
exports.userFromToken = userFromToken;
