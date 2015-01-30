var http = require('http');

var t_insertdata = function(testNum, validHTTPCode, authheader, userid) {
  var options = {
    host: '127.0.0.1',
    port: 1337,
    path: '/post_data',
    method: 'POST',
    headers: {
      'authorization': authheader
    }
  };

  var valid = true;


  var req = http.request(options, function(res) {
    console.log(res.statusCode);
   

  });

var now = new Date;

var afewsecago= new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()-10, now.getUTCMilliseconds());

  var v=('[{ "Timestamp" : "' + now.toUTCString() +'" , "SensorID" : 1, "Value": ' + Math.random() + ' }, { "Timestamp" : "' + afewsecago.toUTCString() + '" , "SensorID" : 1, "Value": ' + Math.random() + ' }]');
  console.log(v);

//  var v=('[{ "Timestamp" : "' + now.toUTCString() +'" , "SensorID" : 12, "Value": ' + Math.random() + ' }, { "Timestamp" : "' + afewsecago.toUTCString() + '" , "SensorID" : 12, "Value": ' + Math.random() + ' }]');
  console.log(v);

  req.write(v);
  req.end();
}

t_insertdata(0, 200, "test:test", 1);
