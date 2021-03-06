"use strict";

var fs = require('fs');
var minimist = require('minimist');
var endOfLine = require('os').EOL;
var SensorDataFile = require('./SensorDataFile.js');

function validateArgs() {
	var args = minimist(process.argv.slice(2), {
		"default": {
			"interval": 15000,
			"maxRecordPerFile": 2
		},
		"string": ["sensorFile"]
	});

	if (args.help || args._.length !== 0) {
		console.error( "Usage: node " + process.argv[1] + " --sensorFile <fileName> --sensorId <string> [ --interval <sampling interval in s.> --maxRecordPerFile <int> ]");
		process.exit();
		}

	if (!args.sensorFile) {
		throw "--sensorFile required";
	}

	if (!args.sensorId) {
		throw "--sensorId required";
	}
	args.outputLogFile = args.outputLogFile || "out{timestamp}.csv";

	return args;
}

function parseSensorData(args, callback) {
	var value;
	fs.readFile(args.sensorFile, {
		"encoding": "utf-8"
	}, function(err, data) {
		if (err)
			throw err;

		if (data.match(/crc=.* YES/)) {
			var strValue = data.match(/t=(\d+)/);
			if (strValue) {
				value = parseFloat(strValue[1]) / 1000.0;
				callback(value);
			} else
				throw "Invalid data";
		} else
			throw "CRC Error";
	});
}

function showError(message) 
{
	console.error(message);
}

function extractAndStoreValue(args, sensorFile) {
	try {
		parseSensorData(args, function(value)
			{
				console.log("Value read: " + value);
				sensorFile.addData([args.sensorId, value, new Date().toISOString()].join(";") + endOfLine);
			}
		);
	} catch (e) {
		console.error(e);
	}
}

var args = validateArgs();
var sensorFile = new SensorDataFile(args.outputLogFile, args.maxRecordPerFile, showError);

extractAndStoreValue(args, sensorFile);
setInterval(
	function() {
		extractAndStoreValue(args, sensorFile);
	},
	args.interval
);