var http = require('http');

var t_login = function(testNum, validHTTPCode, authheader, userid)
{
  var options =
  {
      host: '127.0.0.1',
      port: 1337,
      path: '/get_userid',
      method: 'POST',
      agent:false,
      headers: { 'authorization': authheader }
  };

  var valid=true;
  var req = http.request(options, function(res) {
                         if (res.statusCode!=validHTTPCode)
                         { 
                         valid=false;
                         }
                         if ((valid==true)&&(res.statusCode==200))
                         {
                         res.on('data', function(d)
                            {
                            var parsed=JSON.parse(d);
                            if (parsed["UserID"]==userid)
                            {
                               console.log("Test " + testNum + ": Passed: true");
                            }
                            else
                            {
                               console.log("Test " + testNum + ": Passed: false");
                            }
                            });
                         }
                         else
                         {
                         console.log("Test "+ testNum + ": Passed: " + valid) ;
                         }
                         });
  req.end();
}

t_login(0, 200, "test:test", 1);
t_login(1, 401, "t   :test", 0);
t_login(2, 401, "test:t   ", 0);
t_login(3, 401, "testt z  ", 0);

