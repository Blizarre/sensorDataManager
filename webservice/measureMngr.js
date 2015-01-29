var setData = function(connection, userID, sensorID, timestamp, value) {
    console.log('Bonjour !');
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	if (err) throw err;
	console.log('The solution is: ', rows[0].solution);
	});

connection.end();
}

var getData = function() {
    console.log('Bye bye !');
}

exports.setData = setData;
exports.getData = getData;





/*
 * This class manages all the interaction regarding the user management. User creation, identification, ...
 *  
 * _Instance variables:_
 *     sqlConn: the mysql object to the database
 *     userRq: the HTTP request object provided by the client
 *     ansWrp: the object that manages the HTTP answer to client
 *
 */


/*
 * Constructor for this class.
 * 
 * _parameters:_
 *     sqlConnexion: the mysql object to the database
 *     userRequest : the HTTP request object provided by the client
 *     answerWrap: the object that manages the HTTP answer to client
 *
 * _return value:_
 *     this is a void function
 *
 * */
var MeasureManager = function(sqlConnexion, userRequest, answerWrap) {
  this.sqlConn = sqlConnexion;
  this.userRq = userRequest;
  this.ansWrp = answerWrap;
};


/*
 * Error function that replies to the user the HTTP code provided
 * 
 * _parameters:_
 *     httpCode: an int that corresponds to the HTTP code to be returned
 *  
 * _return value:_
 *     this is a void function
 *
 * */
MeasureManager.prototype.onError = function(httpCode) {
  this.ansWrp.writeHead(httpCode);
  this.ansWrp.end();
};


/*
 * Check auth is used to provide the userid of a user provided in "authorization" field
 * and to verify this auth header.
 * 
 * _parameters:_
 *     outfun: the function that manages the answer to client
 *          (one parameter: an int value: the user ID if http code ==200)
 *  
 * _error_: call the error function with the corresponding HTTP code
 *
 * _return value:_
 *     this is a void function
 *
 * */
MeasureManager.prototype.verifyUser = function(outfun) {
  var head=this.userRq.headers;
  if ("authorization" in head) {	
    var n=head["authorization"].indexOf(":");
    if ((n<0)||(n>=head["authorization"].length-1)) {
      this.onError(401,0);
    }
    var login=head["authorization"].substr(0, n);
    var reqmdp=head["authorization"].substr(n+1);
    var getUserQuery = "SELECT userid, mdp, MD5(CONCAT(seed," + this.sqlConn.escape(reqmdp) + ")) as reqmdp FROM usertable WHERE login="+ this.sqlConn.escape(login);
    var curr=this; // no this is not a shitty language :p
    this.sqlConn.query(getUserQuery, function(err, rows, fields) {
                  if (err) {
                  curr.onError(500);
                  } else if (rows.length==0) {
                  curr.onError(401);
                  } else if (rows.length>1) {
                  curr.onError(500);
                  } else if (rows[0]["reqmdp"]===rows[0]["mdp"]) {
                  outfun(rows[0]["userid"]);
                  } else {
                  curr.onError(401);
                  }
                  });
  } else {
    this.onError(401);
  }
}

module.exports = MeasureManager;





