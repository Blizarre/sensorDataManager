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

    if (page == '/') {
    	res.writeHead(400);
        res.write('This service is not to be used this way.');
    }
    else if (page == '/get_userid')
    {
	userMngr.getUserId(connectSql, req.headers, function (authStatus)
	{
	    if (authStatus>=0)
	    {
    	        res.writeHead(200);
                res.write('{"UserID" :'+ authStatus +'}');
    		res.end();
	    }
	    else if (authStatus==-1) 
	    {
    	        res.writeHead(401);
    		res.end();
	    }
	    else if (authStatus==-2) 
	    {
    	        res.writeHead(401);
    		res.end();
	    }
	    else 
	    {
    	        res.writeHead(500);
    		res.end();
	    }
	});
    }
    else if (page == '/create_user') {
    	res.writeHead(200);
        res.write('{"UserID" : 69}');
    }
    else if (page == '/delete_user') {
    	res.writeHead(200);
        res.write('');
    }
    else if (page == '/update_user') {
    	res.writeHead(200);
        res.write('{"UserID" : 69}');
    }
    else if (page == '/add_sensor') {
    	res.writeHead(200);
        res.write('{"SensorID" : 12}');
    }
    else if (page == '/edit_sensor') {
    	res.writeHead(200);
        res.write('{"SensorID" : 12}');
    }
    else if (page == '/list_sensor') {
    	res.writeHead(200);
        res.write('[{"SensorID" : 12, "Name": "Temp. Garage", "Unit": "°C"},{"SensorID" : 12,"Name": "Luminosity","Unit": "AU"}]');
    }
    else if (page == '/delete_sensor') {
    	res.writeHead(200);
        res.write('');
    }
    else if (page == '/post_data') {
    	res.writeHead(200);
        res.write('');
    }
    else if (page == '/get_data') {
    	res.writeHead(200);
        res.write('{"Timestamp": [231443252364, 231443280954],"Value": [3.14159, 5.042]}');
    }
    else
    {
    	res.writeHead(404);
    }
 
}



var server = http.createServer(mainServerParser);
server.listen(1337);
console.log("Go");
