var setData = function(connection, userID, sensorID, timestamp, value) {
    console.log('Bonjour !');
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	if (err) throw err;
	console.log('The solution is: ', rows[0].solution);
	});

connection.end();
}

var getData = function() {
    console.log('Bye bye !');
}

exports.setData = setData;
exports.getData = getData;
