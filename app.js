var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , TemperatureProvider = require('./sensordata').TemperatureProvider;


var temperatureProvider= new TemperatureProvider('localhost', 27017);

app.configure(function(){
  
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'public')));

});

var port = process.env.PORT || 3000;
server.listen(port);

app.get('/', function(req, res){
    res.render('index', {
          title: 'Temperatures',
    });
});

app.get('/humidity', function(req, res){
    res.render('humidity', {
          title: 'Humidities',
    });
});

//call to retrieve collection from database
app.get('/getdata', function(req, res){
  temperatureProvider.findAll(function(error, temps){
  	res.json({sensor_data: temps});
  });

});

setInterval(function(){

	// YOU'LL NEED TO PUT YOUR ELECTRIC IMP URL HERE V
  //imp2
	request('https://agent.electricimp.com/EBdKJaclLMFh', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var temperatures = body;
      obj = JSON.parse(body);
      console.log(obj);

      temperatureProvider.save({
          temp1: obj.temperature1,
          temp2: obj.temperature2,
          humidity: obj.humidity,
          time1: obj.time1

      }, function( error, docs) {
    });

		}
	});


}, 10000);





