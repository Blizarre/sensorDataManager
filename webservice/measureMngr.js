/*
 * This class manages all the interaction regarding the measure management. Adding measures, searching, ...
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
 * 
 * _parameters:_
 *  
 * _error:_ call the error function with the corresponding HTTP code
 *
 * _return value:_
 *     this is a void function
 *
 * */
MeasureManager.prototype.setData = function(userID, postedData) {
  var SensorManager = require('./sensorMngr.js');
  var sensorMng = new SensorManager(this.sqlConn, this.userRq, this.ansWrp);
  var curr=this;

  var sensorIDList= new Array();
  for (key in postedData) {
    sensorIDList[key]=postedData[key]["SensorID"];
  }

  sensorMng.verifySensorList(userID, sensorIDList, function() {
    var sqlStr="INSERT INTO datatable (userid,sensorid,timestamp,datavalue) VALUES ";
    for (key in postedData) {
      sqlStr+= "('" + userID + "','" + curr.sqlConn.escape(postedData[key]["SensorID"]) + "'," +  curr.sqlConn.escape(postedData[key]["Timestamp"]) + ",'" + curr.sqlConn.escape(postedData[key]["Value"])  + "'),";
    }
    sqlStr = sqlStr.substr(0, sqlStr.length-1);

    curr.sqlConn.query(sqlStr, function(err, rows, fields) {
      if (err) {
        if (err["errno"]==1062)
        {
          curr.onError(409);
        }
        else
        {
          curr.onError(500);
        }
        return;
      }
      curr.ansWrp.writeHead(200);
      curr.ansWrp.end();
  	});
  });
}


module.exports = MeasureManager;

