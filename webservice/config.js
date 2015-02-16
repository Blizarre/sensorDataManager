
exports.conf_database_connect_info=
{
host     : 'localhost',
user     : 'sensorLogger',
password : 'otter&42Loutre',
database : 'sensorLogger',
}

exports.request_encoding='utf8';

exports.answer_static_header= {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,UPDATE",
  "Access-Control-Allow-Credentials": true
};

exports.cors_sites={
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,UPDATE",
  "Access-Control-Max-Age": 60 * 60 * 24 * 1,
  "Access-Control-Allow-Headers": "authorization"
};
//{ 'Access-Control-Allow-Origin', 'example.com',
//  'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE',
//  'Access-Control-Allow-Headers', 'Content-Type' }
//
//  "Access-Control-Allow-Origin", "*"
//  "Access-Control-Allow-Headers", "X-Requested-With"
//
//  'Access-Control-Max-Age', 60 * 60 * 24 * 365

exports.get_data_max_entries = 1000;

