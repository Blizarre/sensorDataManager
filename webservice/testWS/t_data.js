var http = require('http');

var t_insertdata = function(testNum, validHTTPCode, authheader, userid)
{
  var options =
  {
      host: '127.0.0.1',
      port: 1337,
      path: '/post_data',
      method: 'POST',
      headers: { 'authorization': authheader }
  };

  var valid=true;


  var req = http.request(options, function(res) {
  console.log(res.statusCode);
                        });
  req.write('[{ "Timestamp" : 231443252364, "SensorID" : 12, "Value": 3.14159 }, { "Timestamp" : 231443232464, "SensorID" : 12, "Value": 3.14159 }]');
  req.end();
}

t_insertdata(0, 200, "test:test", 1);

