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
var UserManager = function(sqlConnexion, userRequest, answerWrap) {
  this.sqlConn = sqlConnexion;
  this.userRq = userRequest;
  this.ansWrp = answerWrap;
  this.config = require('./config.js');
};


/*
 * Function that replies to the user the HTTP code provided
 * 
 * _parameters:_
 *     httpCode: an int that corresponds to the HTTP code to be returned
 *     body: the text to reply
 *     header: an associative array corresponding to the headers
 *  
 * _return value:_
 *     this is a void function
 *
 * */
UserManager.prototype.replyUser = function(httpCode, body, header) {
  ansheader = this.config.answer_static_header;
  for(item in header) {
    ansheader[item] = header[item];
  }
  this.ansWrp.writeHead(httpCode, ansheader);

  if (body) {
    this.ansWrp.write(body);
  }
  this.ansWrp.end();
}


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
UserManager.prototype.verifyUser = function(outfun) {
  var head=this.userRq.headers;
  if ("authorization" in head) {	
    var n=head["authorization"].indexOf(":");
    if ((n<0)||(n>=head["authorization"].length-1)) {
      this.replyUser(401);
    }
    var login=head["authorization"].substr(0, n);
    var reqmdp=head["authorization"].substr(n+1);
    var getUserQuery = "SELECT userid, mdp, MD5(CONCAT(seed," + this.sqlConn.escape(reqmdp) + ")) as reqmdp FROM usertable WHERE login="+ this.sqlConn.escape(login);
    var curr=this; // no this is not a shitty language :p
    this.sqlConn.query(getUserQuery, function(err, rows, fields) {
                  if (err) {
                  curr.replyUser(500);
                  } else if (rows.length==0) {
                  curr.replyUser(401);
                  } else if (rows.length>1) {
                  curr.replyUser(500);
                  } else if (rows[0]["reqmdp"]===rows[0]["mdp"]) {
                  outfun(rows[0]["userid"]);
                  } else {
                  curr.replyUser(401);
                  }
                  });
  } else {
    this.replyUser(401);
  }
}

module.exports = UserManager;
