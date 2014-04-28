var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

TemperatureProvider = function(host, port) {
  this.db= new Db('node-mongo-temperature', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


TemperatureProvider.prototype.getCollection= function(callback) {
  this.db.collection('temperatures', function(error, temperature_collection) {
    if( error ) callback(error);
    else callback(null, temperature_collection);
  });
};

//find all temperatures
TemperatureProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, temperature_collection) {
      if( error ) callback(error)
      else {
        temperature_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new employee
TemperatureProvider.prototype.save = function(temperatures, callback) {
    this.getCollection(function(error, temperature_collection) {
      if( error ) callback(error)
      else {

        //add date
        if( typeof(temperatures.length)=="undefined")
          temperatures = [temperatures];
        for( var i =0;i< temperatures.length;i++ ) {
          temperature = temperatures[i];
          temperature.created_at = new Date();
        }

        //save parameters
        temperature_collection.insert(temperatures, function() {
          callback(null, temperatures);
        });
      }
    });
};

exports.TemperatureProvider = TemperatureProvider;




