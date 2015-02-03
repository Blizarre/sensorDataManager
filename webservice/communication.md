# Communication protocol for sensor merge

## General dispositions
All URLs are relative to a baseURL. This base URL depends on the project. <br/> 
All data are sent through an HTTPS tunnel except for debug puposes. <br/> 
All Requests that need authorization must add the following header: <br/> 
Authorization : login:password <br/> 
UserID: userid (if known) <br/> 
Incorrect auth data will result in a 401 error. _Later_ a cookie style auth can be adder for sending data. Example: headders "Cookie: MD5(timestamp+sensorID+seedprovided) userid: userid" can be used to authentificate. <br/> 
Server error are not presents in the following response HTTP codes but can occur.

## Create user
(not implemented yet, todo)
POST {baseUrl}/create_user

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 201 : Created <br/> 409 : Already existant |
| Headers | Default Auth header |  |
| Body |  | { <br/> "UserID" : 69 <br/> } <br/> On HTTP code 4XX/5XX : no body |

## Delete user
(not implemented yet, todo)
POST {baseUrl}/delete_user

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK  |
| Headers | Default Auth header |  |
| Body |  |  |

## Update user 
(not implemented yet, todo)
POST {baseUrl}/update_user

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK <br/> 409 : Name already exists |
| Headers | Default Auth header (the previous set) |  |
| Body | { <br/> "Login": "Plop", <br/> "Password": "Kwain" <br/> } | { <br/> "UserID" : 69 <br/> } <br/> On HTTP code 4XX/5XX : no body |

## Get user id
POST {baseUrl}/get_userid

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK |
| Headers | Default Auth header |  |
| Body |  | { <br/> "UserID" : 69 <br/> } <br/> On HTTP code 4XX/5XX : no body |

## Register sensor 
(not implemented yet, todo)
POST {baseUrl}/add_sensor

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 201 : Created <br/> 406 : Unknow unit <br/> 409 : Already existant |
| Headers | Default Auth header |  |
| Body | { <br/> "Name": "Temperature", <br/> "Unit": "°C" <br/> }  | { <br/> "SensorID" : 12 <br/> } <br/> On HTTP code 4XX/5XX : no body |
Units should be registered directly on code  (°F and °C) or stored in data base a prescaler/offset should be stored on the server. Some predefined values are "AU" (arbitrary unit) and "None" (for ratio).

## Edit sensor 
(not implemented yet, todo)
POST {baseUrl}/edit_sensor

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK <br/> 406 : Unknow unit <br/> 409 : Already existant |
| Headers | Default Auth header |  |
| Body | { <br/> "SensorID" : 12, <br/> "Name": "Temp. Garage", <br/> "Unit": "°C" <br/> } | { <br/> "SensorID" : 12 <br/> } <br/> On HTTP code 4XX/5XX : no body |

## List sensors 
(not implemented yet, todo)
POST {baseUrl}/list_sensor

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK  |
| Headers | Default Auth header |  |
| Body |  | [{ <br/> "SensorID" : 12, <br/> "Name": "Temp. Garage", <br/> "Unit": "°C" <br/> }, <br/> { <br/> "SensorID" : 14, <br/> "Name": "Luminosity", <br/> "Unit": "AU" <br/> }] <br/> On HTTP code 4XX/5XX : no body |

## Delete sensor and data 
(not implemented yet, todo)
POST {baseUrl}/delete_sensor

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK <br/> 406 : Unknow sensor |
| Headers | Default Auth header |  |
| Body | { <br/> "SensorID" : 12 <br/>} |  |

## Post sensor data
(not implemented yet, todo)
POST {baseUrl}/post_data

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK <br/> 409 : Duplicate sensorID/Time <br/> 406 : Unknow sensor <br/>400: some fields are missing <br/> (500: if misformated (ex: Value as text)) |
| Headers | Default Auth header |  |
| Body | [{ <br/> "Timestamp" : 231443252364, <br/> "SensorID" : 12, <br/> "Value": 3.14159 <br/> }, <br/> { <br/> "Timestamp" : 231443232464,  <br/> "SensorID" : 12, <br/> "Value": 3.14159 <br/> }] |  |

## Get sensor data
(not implemented yet, todo)
POST {baseUrl}/get_data

|  | Request          | Header          |
| ------------- | ----------- | ----------- |
| HTTP code      |  | 200 : OK <br/> 406 : Unknow sensor <br/> 416 : Too many data in range <br/> 418 : Max element too large |
| Headers | Default Auth header |  |
| Body | { <br/> "StartTimestamp" : 231443252364 <br/> "EndTimestamp" : 231443290954 <br/> "SensorID" : 12, <br/> "MaxElements" : 200 <br/> } | { <br/> "Timestamp": [231443252364, 231443280954], <br/> "Value": [3.14159, 5.042] <br/> }  <br/> On HTTP code 4XX/5XX : no body  |
If the number of sample is higher than "MaxElements", sample are averaged within timestamp intervals.
