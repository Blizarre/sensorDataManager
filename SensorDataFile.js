"use strict";

var fs = require('fs');


var SensorDataFile = function(fileNameTemplate, maxRowBeforeFlush) {
	this.fileNameTemplate = fileNameTemplate;
	this.maxRowBeforeFlush = maxRowBeforeFlush;
	this.reset();
};


/**
 * Reset the object to a clean state, ready to handle data after a file flush
 */
SensorDataFile.prototype.reset = function() {
	this.isAvailable = true;
	this.fd = null;
	this.currentFileName = null;
	this.currentTmpFileName = null;
	this.currentRowNumber = 0;
};

/**
 * This create a new temporary file in the same directory as the output file, but with extension .tmp,
 * open for writing. May throw (string) if the previous file has not been properly closed.
 **/
SensorDataFile.prototype.openNewFile = function() {
	if (this.currentFileName || this.currentTmpFileName)
		throw "previous file not finished";

	this.currentFileName = this.fileNameTemplate.replace("{timestamp}", Date.now());
	this.currentTmpFileName = this.currentFileName + ".tmp";
	this.fd = fs.createWriteStream(this.currentTmpFileName, "w");
};

/**
 * Flush the current logging file. Note: no new data can be added until all the data is securely written to disk.
 * (isAvailable is set to false)
 **/
SensorDataFile.prototype.flushCurrentLog = function() {
	this.fd.end();
	this.isAvailable = false;
	var theObj = this;
	this.fd.on('finish', function() {
		console.log("File writing complete, moving temp file " + theObj.currentTmpFileName + " to " + theObj.currentFileName);
		fs.renameSync(theObj.currentTmpFileName, theObj.currentFileName);
		theObj.reset();
	});
};

/**
 * Add the data to the current file.
 **/
SensorDataFile.prototype.addData = function(data) {
	// If there was a flush at the last call of this function, check that is is finished
	if (!this.isAvailable)
		throw "Couldn't flush the previous file in time";

	// If the current file is not defined (or if the flush occured at the last call), create a new one
	if (!this.fd)
		this.openNewFile();

	// write the data to the stream
	this.fd.write(data, "utf-8");
	this.currentRowNumber++;

	// Flush the file if needed
	if (this.currentRowNumber >= this.maxRowBeforeFlush)
		this.flushCurrentLog();
};


module.exports = SensorDataFile;