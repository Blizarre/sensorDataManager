/*
 * This class manages all the interaction regarding the sensor management. Adding sensor, verufy userid/sensor, listing, ...
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
var SensorManager = function(sqlConnexion, userRequest, answerWrap) {
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
SensorManager.prototype.replyUser = function(httpCode, body, header) {
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
 * 
 * _parameters:_
 *  
 * _error:_ call the error function with the corresponding HTTP code
 *
 * _return value:_
 *     this is a void function
 *
 * */
SensorManager.prototype.verifySensorList = function(userID, listSensor, outfun) {
    var curr=this;
    var uniqueSensorIDList = listSensor.filter(function(item, pos) {
      return listSensor.indexOf(item) == pos;
    });
    var shouldEqualLen=uniqueSensorIDList.length;

    var sqlStr="SELECT COUNT(*) as NSENSOR FROM sensortable WHERE";
    for (key in uniqueSensorIDList) {
      sqlStr+= " (sensorid = " + this.sqlConn.escape(uniqueSensorIDList[key]) + " AND userid = " +  this.sqlConn.escape(userID) + ") OR";
    }
    sqlStr = sqlStr.substr(0, sqlStr.length-2);

    this.sqlConn.query(sqlStr, function(err, rows, fields) {
    	if (err) {
        curr.replyUser(500);
        return;
      }
      if (rows[0]["NSENSOR"]==shouldEqualLen) {
        outfun();
      } else {
        curr.replyUser(406);
      }
  	});
}

module.exports = SensorManager;
