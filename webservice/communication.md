# Communication protocol for sensor merge

## General dispositions
All URLs are relative to a baseURL. This base URL depends on the project.
All data are sent through an HTTPS tunnel except for debug puposes. 
All Requests that need authorization must add the following header:
Authorization : login:password
UserID: userid (if known)
Incorrect auth data will result in a 401 error. Later a cookie style auth can be adder for sending data. Example: headders "Cookie: MD5(timestamp+sensorID+seedprovided) userid: userid" can be used to authentificate.
Server error not presents in the following response HTTP codes.

## Create user
POST {baseUrl}/create_user

| | Request  |  Header |
| - |--------- | ------------- |
| HTTP code |  | 201 : Created |
|   |  | 409 : Already existant |
| - |--------- | ------------- |
| Headers | Headers	Default Auth header	  |  |
| - |--------- | ------------- |
| Body |  | { |
|  |  | "UserID" : 69 |
|  |  | } |
|  |  | On HTTP code 4XX : no body |
| - |--------- | ------------- |

## Delete user
POST {baseUrl}/delete_user

| | Request  |  Header |
| - |--------- | ------------- |
| HTTP code |  | 200 : OK |
| - |--------- | ------------- |
| Headers | Headers	Default Auth header	  |  |
| - |--------- | ------------- |
| Body |  |  |
| - |--------- | ------------- |

## Update user 
POST {baseUrl}/update_user

| | Request  |  Header |
| - |--------- | ------------- |
| HTTP code |  | 200 : OK |
|  |  | 409 : Name already exists |
| - |--------- | ------------- |
| Headers | Headers	Default Auth header	(the previous set)  |  |
| - |--------- | ------------- |
| Body | { | { |
|  | "Login": "Plop", | "UserID" : 69 |
|  | "Password": "Kwain" | } |
|  | } | On HTTP code 4XX : no body |
| - |--------- | ------------- |


## Get user id
POST {baseUrl}/get_userid

| | Request  |  Header |
| - |--------- | ------------- |
| HTTP code |  | 200 : OK |
| - |--------- | ------------- |
| Headers | Headers	Default Auth header	  |  |
| - |--------- | ------------- |
| Body |  | { |
|  |  | "UserID" : 69 |
|  |  | } |
|  |  | On HTTP code 4XX : no body |
| - |--------- | ------------- |


## Register sensor 
POST {baseUrl}/add_sensor
	Request	Response
HTTP Code		201 : Created
406 : Unknow unit
409 : Already existant
Headers	Default Auth header	
Body	{
"Name": "Temperature",
"Unit": "°C"
}
	{
"SensorID" : 12
} 
On HTTP code 4XX : no body
Units should be registered directly on code  (°F and °C) or stored in data base a prescaler/offset should be stored on the server. Some predefined values are "AU" (arbitrary unit) and "None" (for ratio).

## Edit sensor 
POST {baseUrl}/edit_sensor
	Request	Response
HTTP Code		200 : OK
406 : Unknow unit
409 : Already existant
Headers	Default Auth header	
Body	{
"SensorID" : 12,
"Name": "Temp. Garage",
"Unit": "°C"
}
	{
"SensorID" : 12
} 
On HTTP code 4XX : no body

## List sensors 
POST {baseUrl}/list_sensor
	Request	Response
HTTP Code		200 : Created
Headers	Default Auth header	
Body		[{
"SensorID" : 12,
"Name": "Temp. Garage",
"Unit": "°C"
},
{
"SensorID" : 12,
"Name": "Luminosity",
"Unit": "AU"
}]

## Delete sensor and data 
POST {baseUrl}/delete_sensor
	Request	Response
HTTP Code		200 : OK
406 : Unknow sensor
Headers	Default Auth header	
Body	{
"SensorID" : 12
} 	

## Post sensor data
POST {baseUrl}/post_data
	Request	Response
Headers	Default Auth header	200 : OK
406 : Unknow sensor
409 : Timestamp too close
Body	[{
"Timestamp" : 231443252364
"SensorID" : 12,
"Value": 3.14159
},
{
"Timestamp" : 231443252364
"SensorID" : 12,
"Value": 3.14159
}]	

## Get sensor data
POST {baseUrl}/get_data
	Request	Response
Headers	Default Auth header	200 : OK
406 : Unknow sensor
412 : Invalid range
416 : Too many data in range
418 : Max element too large
Body	{
"StartTimestamp" : 231443252364
"EndTimestamp" : 231443290954
"SensorID" : 12,
"MaxElements" : 200
}
	{
"Timestamp": [231443252364, 231443280954] ,
"Value": [3.14159, 5.042]
} 
On HTTP code 4XX : no body
If the number of sample is higher than "MaxElements", sample are averaged within timestamp intervals.
