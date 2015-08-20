var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz prueba', errors: [] });
});

//Autoload de comandos con :quizId
router.param('quizId',quizController.load);
router.param('commentId',commentController.load);

//Definicion de rutas de sesion
router.get('/login',sessionController.new);			//formulario login
router.post('/login',sessionController.create);		//crear sesion
router.get('/logout',sessionController.destroy);	//destruir sesion

//Definicion de rutas /quizes
router.get('/quizes', sessionController.check, quizController.index);
router.get('/quizes/:quizId(\\d+)', sessionController.check, quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', sessionController.check, quizController.answer);
router.get('/quizes/new', sessionController.check, sessionController.loginRequired ,quizController.new);
router.post('/quizes/create', sessionController.check, sessionController.loginRequired ,quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.check, sessionController.loginRequired ,quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.check, sessionController.loginRequired ,quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.check, sessionController.loginRequired ,quizController.destroy);

//Definicion de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.check, commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', sessionController.check, commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.check, sessionController.loginRequired, commentController.publish);

router.get('/author',function(req, res) {
	res.render('author',{ parametro: 'nada', errors: []});
});

module.exports = router;
