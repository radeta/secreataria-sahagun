var config = require('./package');
var express = require('express');
var routes = require('./routes');
var adminSession = require('./routes/adminSession');
var http = require('http');
var path = require('path');
var medicos = require('./routes/api/medicos');
var test = require('./routes/test/test1');
var fs = require('fs');
var models = require('./routes/models');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set("jsonp callback", true);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.bodyParser({uploadDir:'./public/uploads'}));
	app.use(express.cookieParser('1q2w3e4r'));
	app.use(express.session({secret:'1q2w3e4r'}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(function (req, res, next){
		res.render('404/404.jade', {title: config.name, pag:req.params});
	});
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Carga de template o wiews
app.get('/', routes.index);
app.get('/dashboard', routes.dashboard);
app.get('/admin', routes.registerAdmin)
app.get('/session/admin/error', routes.sessionError);
app.get('/medicos', routes.addMedico);
app.get('/medicos/busqueda', routes.busqueda);
app.get('/medicos/:id', medicos.getMedicoByIdent);

// Metodos Post
app.post('/session/admin', adminSession.NewSession);
app.post('/user/admin', adminSession.CreateAdmin);
app.post('/medicos', medicos.createMedico);
app.post('/medicos/busqueda', medicos.searchMedicoByIdent);

// Metodos Delete
app.delete('/session/admin', adminSession.destroySession);

// Peticion de autentificacion de datos
app.get('/api/medicos/identificacion', medicos.verifivarIdBynum);
app.get('/api/medicos/tarjeta', medicos.verifivarTarjetaBynum);
app.get('/api/lugarTrabajo/nit', medicos.getNitBynum);
app.get('/prueba', function (req, res){
	models.lugarTrabajo.findOne({nit:'10256'}).populate('ubicacion._municipio').exec(function (err, lugar){
		res.send(lugar);
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
