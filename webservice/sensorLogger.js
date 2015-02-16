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


  console.log(req.method);
  if (req.method=='OPTIONS'){
  console.log('OPTIONS');
    replyUser(res, 200, undefined, config.cors_sites);
  }
  else if ((page == '/userid') && (req.method=='GET')) { // get userid
    userMng.verifyUser(function (userid) {
      replyUser(res, 200, '{"UserID" : '+ userid +' }');
      });
  }
  else if ((page == '/user') && (req.method=='PUT')) { // create user
    userMng.verifyUser(function (userid) {
      req.on('data', function (chunk) {
        try {
          var postedData=JSON.parse(chunk);
          if (!("Login" in postedData)) throw 400;	
          if (!("Password" in postedData)) throw 400;	
          userMng.createUser(userid, postedData, function (newuserid) {
            replyUser(res, 200, '{"UserID" : '+ newuserid +' }');
          });
        } catch (err) {
          replyUser(res, 400);
        }
      });
     });
  }
  else if ((page == '/user') && (req.method=='DELETE')) { // delete user
    userMng.verifyUser(function (userid) {
      req.on('data', function (chunk) {
        try {
          var postedData=JSON.parse(chunk);
          if (!("UserID" in postedData)) throw 400;	
          userMng.deleteUser(userid, postedData["UserID"]);
        } catch (err) {
          replyUser(res, 400);
        }
      });
     });
  }
  else if ((page == '/user') && (req.method=='PATCH')) { // update user data
    replyUser(res, 200, '{"UserID" : 69 }');
  }
  else if ((page == '/sensor') && (req.method=='PUT')) { // add sensor
    replyUser(res, 200, '{"SensorID" : 12}');
  }
  else if ((page == '/sensor') && (req.method=='PATCH')) { // edit sensor
    replyUser(res, 200, '{"SensorID" : 12}');
  }
  else if ((page == '/sensor') && (req.method=='POST')) { // get sensor list
    replyUser(res, 200, '[{"SensorID" : 12, "Name": "Temp. Garage", "Unit": "°C"},{"SensorID" : 12,"Name": "Luminosity","Unit": "AU"}]');
  }
  else if ((page == '/sensor') && (req.method=='DELETE')) { // delete sensor
    replyUser(res, 200);
  }
  else if ((page == '/data') && (req.method=='PUT')) { // post new data
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
  else if ((page == '/data') &&  (req.method=='POST')) { // get data
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
            console.log(err.stack)
            replyUser(res, 400);
          }
        });
      console.log("5");
      });
  }
  else if ((page == '/data') &&  (req.method=='DELETE')) { // delete data in range
    replyUser(res, 200);
  }
  else {
    replyUser(res, 404, 'This service is not to be used this way.');
  }
}


var server = http.createServer(mainServerParser);
server.listen(1337);
console.log("Go");
