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
MeasureManager.prototype.replyUser = function(httpCode, body, header) {
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
          curr.replyUser(409);
        }
        else
        {
          curr.replyUser(500);
        }
        return;
      }
      curr.replyUser(200);
  	});
  });
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
// TODO: do some histograms with group by min/max
// faire un fichier de conf limiter les réponses comparer à un nombre
MeasureManager.prototype.getData = function(userID, postedData) {
  var SensorManager = require('./sensorMngr.js');
  var sensorMng = new SensorManager(this.sqlConn, this.userRq, this.ansWrp);
  var curr=this;

  var sensorIDList= new Array();
  sensorIDList[0]=postedData["SensorID"];
  console.log("4");
  sensorMng.verifySensorList(userID, sensorIDList, function() {
    var sqlStr="SELECT COUNT(datavalue) as cnt , MIN(datavalue) as minVal, MAX(datavalue) as maxVal FROM datatable WHERE userid='"+ userID + "' AND sensorid="+ curr.sqlConn.escape(postedData["SensorID"]) +" AND timestamp>="+ curr.sqlConn.escape(postedData["StartTimestamp"])+" AND timestamp<="+ curr.sqlConn.escape(postedData["EndTimestamp"]);
    curr.sqlConn.query(sqlStr, function(err, rows, fields) {
      console.log(err);
      console.log(rows);
      //console.log(fields);
      console.log(sqlStr);
      if (err)
      {
         curr.replyUser(500);
         return;
      }
      if ((rows[0]["cnt"]>postedData["MaxElements"]) || (rows[0]["cnt"]>curr.config.get_data_max_entries)) {
        curr.replyUser(432);
        return;
        var sqlStr="SELECT timestamp, datavalue  FROM datatable WHERE userid='"+ userID + "' AND sensorid="+ curr.sqlConn.escape(postedData["SensorID"]) +" AND timestamp>="+ curr.sqlConn.escape(postedData["StartTimestamp"])+" AND timestamp<="+ curr.sqlConn.escape(postedData["EndTimestamp"])+" ORDER BY timestamp";
      } else {
        // Answer is short enought
        var sqlStr="SELECT timestamp, datavalue  FROM datatable WHERE userid='"+ userID + "' AND sensorid="+ curr.sqlConn.escape(postedData["SensorID"]) +" AND timestamp>="+ curr.sqlConn.escape(postedData["StartTimestamp"])+" AND timestamp<="+ curr.sqlConn.escape(postedData["EndTimestamp"])+" ORDER BY timestamp";
      }
      curr.sqlConn.query(sqlStr, function(err, rows, fields) {
        console.log(err);
        console.log(rows);
        //console.log(fields);
        console.log(sqlStr);
        if (err)
        {
          curr.replyUser(500);
          return;
        }
        
        var retData;
        retData={
          "Timestamp" : [],
          "Value" : []
        }
        for (entry in rows)
        {
          retData["Timestamp"].push(rows[entry]["timestamp"]);
          retData["Value"].push(rows[entry]["datavalue"]);
        }
        curr.replyUser(200, JSON.stringify(retData)); 
      });
  	});
  });
}


module.exports = MeasureManager;

