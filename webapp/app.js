var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const dgram = require('dgram');

var convert = require('color-convert');
var index = require('./routes/index');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

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
  res.render('error');
});


server.listen(4242, () => console.log("Listening for ghosts..."));

io.on('connection',function(client) {

  client.on('join',function(data) {

  })

  client.on('leds', function(data) {

    var port = 8888;
    var address = "192.168.0.101";
    //var address = "192.168.2.18";

		const buf1 = Buffer.from(data);
		const client= dgram.createSocket('udp4');


		client.send([buf1],port,address, (err) => {
      if(err) {
      }
			client.close();
		});

  })

  client.on('relays',function(data) {

    var port = 8888;
    var address = "192.168.2.28";

    const buf1 = Buffer.from(data);
    const client = dgram.createSocket('udp4');

    client.send([buf1],port,address, (err) => {
      client.close();
    });

  })

})



module.exports = app;
