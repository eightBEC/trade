
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var mongoose = require('mongoose');



var app = express();

/**
 * Connect to MongoDB.
 */

var mongoUrl = "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PW+"@"+process.env.MONGO_URL;
//
console.log(mongoUrl);

mongoose.connect(mongoUrl);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});


/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

var shortController = require('./crawler');
var positionController = require('./positionController');

app.get('/positions/short/isin/:isin',positionController.getByIsin);
app.get('/positions/short/emitter/:emitter',positionController.getByEmitter);
app.get('/positions/short/holder/:holder',positionController.getByHolder);
app.get('/positions/short/date/:date',positionController.getByDate);
app.get('/crawl',shortController.getAllPositions);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'));
});

module.exports = app;
