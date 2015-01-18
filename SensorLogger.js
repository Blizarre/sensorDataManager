var fs = require('fs');
var minimist = require('minimist');
var endOfLine = require('os').EOL;
var SensorDataFile = require('./SensorDataFile.js');

function validateArgs() {
	var args = minimist(process.argv.slice(2), { "default": { "interval":15000, "maxRecordPerFile":2 }, "string":["sensorFile"]} );
	
	console.log(args);

	if (!args.sensorFile)
	{
		throw "--sensorFile required";
	}

	if (!args.sensorId)
	{
		throw "--sensorId required";
	}
	args.outputLogFile = args.outputLogFile || "out{timestamp}.csv";

	return args;
}

function parseSensorData(args) {
	
	var match, value;
	var data = fs.readFileSync(args.sensorFile, { "encoding": "utf-8" });

	if (data.match(/crc=.* YES/)) {
		match = data.match(/t=(\d+)/);
		if (match) {
			value = parseFloat(match[1]) / 1000.0;
		} else
			throw "Invalid data";
	} else
		throw "CRC not OK";
	return value;
}

function extractAndStoreValue(args)
{
	try {
		var value = parseSensorData(args);
		console.log("Value read: " + value);
		sensorFile.addData([args.sensorId, value, new Date().toISOString()].join(";") + endOfLine);
	} catch (e) {
		console.error(e);
	}
}

var args = validateArgs();
var sensorFile = new SensorDataFile(args.outputLogFile, args.maxRecordPerFile);

extractAndStoreValue(args);
setInterval(function() {
	extractAndStoreValue(args);
}, args.interval);

