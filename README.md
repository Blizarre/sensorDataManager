# sensorDataManager
Read sensor data on a client computer, send it to a server asynchronously, and view it on your browser

## SensorLogger

SensorLogger.js will poll the file containing sensor data and output it to cvs files.
   
   node sensorLogger.js --sensorFile dummySensorData.dat --interval 5000 --sensorId 123

needs node.js modules (npm install <moduleName>):
 - minimist
