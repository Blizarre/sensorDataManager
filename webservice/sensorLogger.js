var http = require('http');
var url = require('url');
var mysql = require('mysql');
var userMngr = require('./userMngr.js');
//var sensorMngr = require('./sensorMngr.js');
var dataMngr = require('./dataMngr.js');

var connectSql = mysql.createConnection({
host     : 'localhost',
user     : 'sensorLogger',
password : 'otter&42Loutre',
database : 'sensorLogger',
});
connectSql.connect();

function mainServerParser(req, res) {
  var page = url.parse(req.url).pathname;	
  console.log("----====----");
  console.log(page);
  console.log(" ");
  console.log(req.headers);

  req.setEncoding('utf8');

  if (page == '/') {
    res.writeHead(400);
    res.write('This service is not to be used this way.');
    res.end();
  }
  else if (page == '/get_userid')
  {
    userMngr.verifyUser(connectSql, req.headers, function (httpCode, userid)
      {
        res.writeHead(httpCode);
        if (httpCode==200)
        {
        console.log(userid);
          res.write('{"UserID" : '+ userid +' }');
        }
        res.end();
      });
  }
  else if (page == '/create_user') {
    res.writeHead(200);
    res.write('{"UserID" : 69}');
    res.end();
  }
  else if (page == '/delete_user') {
    res.writeHead(200);
    res.write('');
    res.end();
  }
  else if (page == '/update_user') {
    res.writeHead(200);
    res.write('{"UserID" : 69}');
    res.end();
  }
  else if (page == '/add_sensor') {
    res.writeHead(200);
    res.write('{"SensorID" : 12}');
    res.end();
  }
  else if (page == '/edit_sensor') {
    res.writeHead(200);
    res.write('{"SensorID" : 12}');
    res.end();
  }
  else if (page == '/list_sensor') {
    res.writeHead(200);
    res.write('[{"SensorID" : 12, "Name": "Temp. Garage", "Unit": "°C"},{"SensorID" : 12,"Name": "Luminosity","Unit": "AU"}]');
    res.end();
  }
  else if (page == '/delete_sensor') {
    res.writeHead(200);
    res.end();
  }
  else if (page == '/post_data') {
    userMngr.verifyUser(connectSql, req.headers, function (httpCode, userid)
      {
        if (httpCode==200)
        { 
          req.on('data', function (chunk) {
            try
            {
              console.log("BLA");
              var postedData=JSON.parse(chunk);
              console.log(postedData);
              res.end();
            }
            catch (err)
            {
              res.writeHead(400);
              res.end();
            }
            });
        }
        else
        {
          res.writeHead(httpCode);
          res.end();
        }
      });


    res.write('');
  }
  else if (page == '/get_data') {
    res.writeHead(200);
    res.write('{"Timestamp": [231443252364, 231443280954],"Value": [3.14159, 5.042]}');
    res.end();
  }
  else
  {
    res.writeHead(404);
    res.end();
  }

}



var server = http.createServer(mainServerParser);
server.listen(1337);
console.log("Go");
