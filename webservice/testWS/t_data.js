var http = require('http');

var t_insertdata = function(testNum, validHTTPCode, authheader, sensorID0, sensorID1, timeTest, randomData) {
  var options = {
    host: '127.0.0.1',
    port: 1337,
    path: '/post_data',
    method: 'POST',
    agent:false,
    headers: {
      'authorization': authheader
    }
  };

  var valid = true;

  var req = http.request(options, function(res) {
    //console.log(res.statusCode);
    if (res.statusCode!=validHTTPCode)
    { 
      valid=false;
    }
    console.log("Test "+ testNum + ": Passed: " + valid) ;
  });

  var time1_string;
  var time2_string;

  switch (timeTest)
  {
    case 0:
      var time1 = new Date;
      var time2 = new Date(time1.getUTCFullYear(),time1.getUTCMonth(), time1.getUTCDate(), time1.getUTCHours(), time1.getUTCMinutes(), time1.getUTCSeconds()-10, time1.getUTCMilliseconds());
      time1_string=time1.toISOString().replace('T', ' ').slice(0, 23)+"000";
      time2_string=time2.toISOString().replace('T', ' ').slice(0, 23)+"000";
      break;
    case 1:
      var time1 = new Date;
      time1_string=time1.toISOString().replace('T', ' ').slice(0, 23)+"000";
      time2_string=time1.toISOString().replace('T', ' ').slice(0, 23)+"001";
      break;
    case 2:
      var time1 = new Date;
      time1_string=time1.toISOString().replace('T', ' ').slice(0, 23)+"000";
      time2_string=time1.toISOString().replace('T', ' ').slice(0, 23)+"000";
      break;
    case 3:
      var time1 = new Date;
      var time2 = new Date(0);
      time1_string=time1.toISOString().replace('T', ' ').slice(0, 23)+"000";
      time2_string=time2.toISOString().replace('T', ' ').slice(0, 23)+"000";
      break;
    default:
      break;
  }

  var msg;

  if (randomData)
  {
    msg=('[{ "Timestamp" : "' + time1_string +'" , "SensorID" : '+sensorID0+', "Value": ' + Math.random() + ' }, { "Timestamp" : "' + time2_string + '" , "SensorID" : '+ sensorID1+', "Value": ' + Math.random() + ' }]');
  }
  else
  {
    msg=('[{ "Timestamp" : "' + time1_string +'" , "SensorID" : '+sensorID0+', "Value": 42 }, { "Timestamp" : "' + time2_string + '" , "SensorID" : '+ sensorID1+', "Value": 42 }]');

  }
  //console.log(msg);
  req.write(msg);
  req.end();
}

// **************************
// **************************
// **   Data Insersion     **
// **************************
// **************************
console.log("**   Data Insersion     **");
// add code for corrupted data/ partiellement correct
// code retour 500 en case de date identique
//t_insertdata(0, 200, "test:test", 1, 1, 0, true);
//t_insertdata(1, 401, "test:testz", 1, 1, 0, true);
//t_insertdata(2, 401, "testz:test", 1, 1, 0, true);
//t_insertdata(3, 200, "test:test", 1, 1, 1, true);
//t_insertdata(4, 409, "test:test", 1, 1, 2, true);
//t_insertdata(5, 409, "test:test", 1, 1, 3, true); // should be false on first because return is 200
//t_insertdata(6, 200, "test:test", 1, 2, 0, true);
//t_insertdata(7, 406, "test:test", 80085, 80085, 0, true);
//t_insertdata(8, 406, "test:test", 1, 80085, 0, true);
//t_insertdata(9, 406, "test:test", 80085, 1, 0, true);
//t_insertdata(10, 200, "test:test", 1, 1, 0, false);


var t_readdata = function(testNum, authheader, sensorID, date1, date2, maxElem) {
  var options = {
    host: '127.0.0.1',
    port: 1337,
    path: '/get_data',
    method: 'POST',
    agent:false,
    headers: {
      'authorization': authheader
    }
  };

  var valid = true;

  var req = http.request(options, function(res) {
    console.log(res.statusCode);

    res.on("data", function(chunk) {
      console.log("body: " + chunk);
    });
    return;
    if (res.statusCode!=200)
    { 
      console.log("Test "+ testNum + ": Error: " + valid);
      return;
    }

    res.on("data", function(chunk) {
      console.log("body: " + chunk);


      var postedData=JSON.parse(chunk);
      for (key in postedData) {
      }


      if (res.maxElem)
      { 
        console.log("Test "+ testNum + ": Error " + valid) ;
      }
      console.log("Test "+ testNum + ": Entries: " + valid) ;
    });

  });

  date1_str=date1.toISOString().replace('T', ' ').slice(0, 23)+"000";
  date2_str=date2.toISOString().replace('T', ' ').slice(0, 23)+"000";
  var msg='{ "StartTimestamp" : "' + date1_str + '", "EndTimestamp" : "' + date2_str + '", "SensorID" : ' + sensorID + ', "MaxElements" : ' + maxElem + ' }';

  //console.log(msg);
  req.write(msg);
  req.end();
}

// **************************
// **************************
// **     Data Readout     **
// **************************
// **************************
console.log("**   Data Readout    **");
t_readdata(0, "test:test" , 1, new Date(0), new Date, 200);
//t_readdata(1, "testz:test", 1, new Date(0), new Date, 200);
//t_readdata(2, "test:test" , 1, new Date(0), new Date, 10);
//t_readdata(3, "test:test" , 1, new Date, new Date(0), 2000);
//t_readdata(4, "test:test" , 1, new Date(0), new Date, 0);
//t_readdata(5, "test:test" , 1, new Date, new Date, 20);
//t_readdata(6, "test:test" , 1, new Date(0), new Date(0), 20);
//t_readdata(7, "test:test" , 2, new Date(0), new Date, 200);
//t_readdata(8, "test:test" , 80085, new Date(0), new Date, 200);


