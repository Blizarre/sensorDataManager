"use strict";

var fs = require('fs');

/**
 * onError is called with an error message as argument
 */
var SensorDataFile = function(fileNameTemplate, maxRowBeforeFlush, onError) {
	this.fileNameTemplate = fileNameTemplate;
	this.maxRowBeforeFlush = maxRowBeforeFlush;
	this.onError = onError;

	this.currentFileName = null;
	this.currentTmpFileName = null;
	this.reset();
};


/**
 * Reset the object to a clean state
 */
SensorDataFile.prototype.reset = function() {
	this.isFlushing = false;
	this.fd = null;
	this.currentRowNumber = 0;
};

/**
 * Call the error callback if provided
 */
SensorDataFile.prototype.callErrorCallback = function(message) {
	if(this.onError)
		this.onError(message);
};

/**
 * This create a new temporary file in the same directory as the output file, but with extension .tmp,
 * open for writing. May throw (string) if the previous file has not been properly closed.
 **/
SensorDataFile.prototype.openNewFile = function() {
	if (this.isFlushing)
		throw "previous file not finished";

	this.currentFileName = this.fileNameTemplate.replace("{timestamp}", Date.now());
	this.currentTmpFileName = this.currentFileName + ".tmp";
	this.fd = fs.createWriteStream(this.currentTmpFileName, "w");
};

/**
 * Flush the current logging file. Note: no new data can be added until all the data is securely written to disk.
 * (isFlushing is set to true  until data written and then is set false)
 **/
SensorDataFile.prototype.flushCurrentLog = function() {
	this.isFlushing = true;
	this.fd.end();
	var theObj = this;
	this.fd.on('finish', function() {
		console.log("File writing complete, moving temp file " + theObj.currentTmpFileName + " to " + theObj.currentFileName);

		fs.rename(theObj.currentTmpFileName, theObj.currentFileName, function(error) {
			theObj.reset();
			if (error)
				theObj.callErrorCallback(error);
		});
	});
};

/**
 * Add the data to the current file
 **/
SensorDataFile.prototype.addData = function(data) {
	try {
		// If there was a flush at the last call of this function, check that is is finished
		if (this.isFlushing)
			this.callErrorCallback("Couldn't flush the previous file in time");
		else {
			// If the current file is not defined (or if the flush occured at the last call), create a new one
			if (!this.fd)
				this.openNewFile();

			// write the data to the stream
			this.fd.write(data, "utf-8");
			this.currentRowNumber++;

			// Flush the file if needed
			if (this.currentRowNumber >= this.maxRowBeforeFlush)
				this.flushCurrentLog();
		}
	} catch (e) {
		this.callErrorCallback(e);
	}
};


module.exports = SensorDataFile;