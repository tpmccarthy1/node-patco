var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

//transit feed 
const gtfs = require('gtfs');
const config = require('./config.json');

//init mongo 
const mongoUrl = process.env.MONGODB_URL;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(mongoUrl)
	.then(() => console.log('connection successful'))
	.catch((err) => console.error(err));

// gtfs.import(config)
// .then(() => {
//   console.log('Import Successful');
// })
// .catch(err => {
//   console.error(err);
// });

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use express router
const router = require('./routes/routes');
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(app.get('port'));

module.exports = app;
