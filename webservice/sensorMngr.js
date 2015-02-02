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
SensorManager.prototype.onError = function(httpCode) {
  this.ansWrp.writeHead(httpCode);
  this.ansWrp.end();
};

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
        curr.onError(500);
        return;
      }
console.log(sqlStr);
console.log('The solution is: ', rows[0]["NSENSOR"]);
console.log(rows);
console.log(shouldEqualLen);
      if (rows[0]["NSENSOR"]==shouldEqualLen) {
        outfun();
      } else {
        curr.onError(406);
      }
  	});

}

module.exports = SensorManager;
