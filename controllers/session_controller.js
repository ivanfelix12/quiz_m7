//MiddleWare de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req,res,next){
	if(req.session.user){
		next();
	} else {
		res.redirect('/login');
	}
};

//MiddleWare de autologout pasado un tiempo
exports.check = function(req,res,next){
	var now = new Date();
	var stamp = req.session.time ? new Date(req.session.time) : new Date();
	var maxTime = 120000; //Dos minutos = 120000 milisegundos

	if(req.session.user && now.getTime() > stamp.getTime() + maxTime){
	 	var cont = require('./session_controller');
	 	cont.destroy(req,res);
	 	req.session.errors = new Error("Sesión caducada");
	 	var errors = req.session.errors;
	 	req.session.errors = {};
	 } else {
	 	req.session.time = new Date();
	 	next();
	}
};

//GET /login -- Fromulario de login
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors ={};
	res.render('sessions/new',{errors: errors});
};

//POST /login -- Crear la sesion
exports.create = function(req,res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password,function(error,user){
		if(error){
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}

		//Crear req.session.user y guardar campos id y username
		//La sesion se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username:user.username};

		res.redirect(req.session.redir.toString());
	});
};

//DELETE /logout -- Destruir sesion
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString());
}