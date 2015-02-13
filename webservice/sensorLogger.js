var config = require('./config.js');
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var UserManager = require('./userMngr.js');
//var sensorMngr = require('./sensorMngr.js');
var MeasureManager = require('./measureMngr.js');

var connectSql = mysql.createConnection(config.conf_database_connect_info);
connectSql.connect();

function replyUser(res, httpCode, body, header) {
  ansheader = config.answer_static_header;
  for(item in header) {
    ansheader[item] = header[item];
  }
  res.writeHead(httpCode, ansheader);

  if (body) {
    res.write(body);
  }
  res.end();
}

function mainServerParser(req, res) {
  var page = url.parse(req.url).pathname;	
  console.log("R: " + page);
//  console.log(req.headers);

  req.setEncoding(config.request_encoding);

  var userMng = new UserManager(connectSql, req, res);


  if ( (req.method=='OPTIONS') && (config.cors_sites.length>0) ){
    
  }
  else if (page == '/get_userid') { // TODO: on GET
    userMng.verifyUser(function (userid) {
      replyUser(res, 200, '{"UserID" : '+ userid +' }');
      });
  }
  else if (page == '/create_user') { // TODO: on PUT
    replyUser(res, 200, '{"UserID" : 69 }');
  }
  else if (page == '/delete_user') { // TODO: on DELETE
    replyUser(res, 200);
  }
  else if (page == '/update_user') { // TODO: on PATCH
    replyUser(res, 200, '{"UserID" : 69 }');
  }
  else if (page == '/add_sensor') { // TODO: on PUT
    replyUser(res, 200, '{"SensorID" : 12}');
  }
  else if (page == '/edit_sensor') { // TODO: on PATCH
    replyUser(res, 200, '{"SensorID" : 12}');
  }
  else if (page == '/list_sensor') { // TODO: on GET
    replyUser(res, 200, '[{"SensorID" : 12, "Name": "Temp. Garage", "Unit": "°C"},{"SensorID" : 12,"Name": "Luminosity","Unit": "AU"}]');
  }
  else if (page == '/delete_sensor') { // TODO: on DELETE
    replyUser(res, 200);
  }
  else if (page == '/post_data') { // TODO: on POST
    var measMng = new MeasureManager(connectSql, req, res);
    userMng.verifyUser(function (userid) {
          req.on('data', function (chunk) {
            try {
              var postedData=JSON.parse(chunk);
              for (key in postedData) {
                if (!("Timestamp" in postedData[key])) throw 400;	
                if (!("SensorID" in postedData[key])) throw 400;	
                if (!("Value" in postedData[key])) throw 400;	
              }
              //res.writeHead(200);
              //res.end();
              measMng.setData(userid, postedData);
            } catch (err) {
              replyUser(res, 400);
            }
            });
      });
  }
  else if (page == '/get_data') { // TODO: on GET
    var measMng = new MeasureManager(connectSql, req, res);
    userMng.verifyUser(function (userid) {
          req.on('data', function (chunk) {
            try {
              var postedData=JSON.parse(chunk);
              console.log(postedData);
             
              if (!("StartTimestamp" in postedData)) throw 400;	
              if (!("EndTimestamp" in postedData)) throw 400;	
              if (!("SensorID" in postedData)) throw 400;	
              if (!("MaxElements" in postedData)) throw 400;	
              //replyUser(res, 400, '{"Timestamp": [231443252364, 231443280954],"Value": [3.14159, 5.042]}');
             
              measMng.getData(userid, postedData);
            } catch (err) {
              //console.log(err.stack)
              replyAns(res, 400);
            }
            });
      });
  }
  // TODO: delete data in range
  else
  {
    replyUser(res, 404, 'This service is not to be used this way.');
  }
}


var server = http.createServer(mainServerParser);
server.listen(1337);
console.log("Go");
