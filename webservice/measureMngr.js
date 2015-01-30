

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
    var shouldEqualLen=0;
    var curr=this;

    var sensorIDList= new Array();
    for (key in postedData) {
      sensorIDList[shouldEqualLen++]=postedData[key]["SensorID"];
    }

    var uniqueSensorIDList = sensorIDList.filter(function(item, pos) {
      return sensorIDList.indexOf(item) == pos;
    });

    var sqlStr="SELECT COUNT(*) as NSENSOR FROM sensortable WHERE";
    for (key in uniqueSensorIDList) {
      sqlStr+= " (sensorid = " + this.sqlConn.escape(uniqueSensorIDList[key]) + " AND userid = " +  this.sqlConn.escape(userID) + ") OR";
    }
    sqlStr = sqlStr.substr(0, sqlStr.length-2);
    console.log(sqlStr);

    this.sqlConn.query(sqlStr, function(err, rows, fields) {
      console.log(rows);
    	if (err) throw err;
  	  console.log('The solution is: ', rows[0].solution);
      curr.ansWrp.writeHead(200);
      curr.ansWrp.end();
  	});

}





module.exports = MeasureManager;





