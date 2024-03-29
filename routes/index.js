var express = require('express');
var router = express.Router();

const quizController = require('../controllers/quiz');
const userController = require('../controllers/user');
const sessionController = require('../controllers/session');


// ---------------------- Routes for /login resource -----------------------
// autologout
router.all('*', sessionController.checkLoginExpires);

// login form
router.get('/login', sessionController.new);

// create login session
router.post('/login',
  sessionController.create,
  sessionController.createLoginExpires);

// Authenticate with OAuth 2.0 at Github
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get('/auth/github',
      sessionController.authGitHub);
  router.get('/auth/github/callback',
      sessionController.authGitHubCB,
      sessionController.createLoginExpires);
}

// Authenticate with OAuth 1.0 at Twitter
if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
  router.get('/auth/twitter',
      sessionController.authTwitter);
  router.get('/auth/twitter/callback',
      sessionController.authTwitterCB,
      sessionController.createLoginExpires);
}

// Authenticate with OAuth 2.0 at Twitter
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/auth/google',
      sessionController.authGoogle);
  router.get('/auth/google/callback',
      sessionController.authGoogleCB,
      sessionController.createLoginExpires);
}

// Authenticate with OAuth 2.0 at Linkedin
if (process.env.LINKEDIN_API_KEY && process.env.LINKEDIN_SECRET_KEY) {
  router.get('/auth/linkedin',
      sessionController.authLinkedin);
  router.get('/auth/linkedin/callback',
      sessionController.authLinkedinCB,
      sessionController.createLoginExpires);
}

// logout - close login session
router.delete('/login', sessionController.destroy);
// ----------------------- end /login resource --------------------------

// -------------------- History: restoration routes ---------------------

// Redirection to the saved restoration route.
function redirectBack(req, res, next) {
  const url = req.session.backURL || "/";
  delete req.session.backURL;
  res.redirect(url);
}

router.get('/goback', redirectBack);

// Save the route that will be the current restoration route
function saveBack(req, res, next) {
  req.session.backURL = req.url;
  next();
}

// Restoration routes are GET route that do not end in:
// /new, /edit, /play, /check, /login or /:id
router.get(
  [
    '/',
    '/author',
    '/users',
    '/quizzes'
  ],
  saveBack
);

// -------------------- end restoration routes --------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Author page
router.get('/author', (req, res, next) => {
  res.render('author');
});

// Autoload for routes using :quizId or :userId
router.param('quizId', quizController.load);
router.param('userId', userController.load);

// Routes for /users resource
router.get('/users',                    sessionController.loginRequired, userController.index);
router.get('/users/:userId(\\d+)',      sessionController.loginRequired, userController.show);

if (!!process.env.QUIZ_OPEN_REGISTER) {
  router.get('/users/new',                userController.new);
  router.post('/users',                   userController.create);
} else {
  router.get('/users/new',                sessionController.loginRequired, sessionController.adminRequired, userController.new);
  router.post('/users',                   sessionController.loginRequired, sessionController.adminRequired, userController.create);
}

router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, userController.isLocalRequired, sessionController.adminOrMyselfRequired, userController.edit);
router.put('/users/:userId(\\d+)',      sessionController.loginRequired, userController.isLocalRequired, sessionController.adminOrMyselfRequired, userController.update);
router.delete('/users/:userId(\\d+)',   sessionController.loginRequired, sessionController.adminOrMyselfRequired, userController.destroy);

// Routes for /quizzes resource
router.get('/quizzes',                     quizController.index);
router.get('/quizzes/:quizId(\\d+)',       sessionController.loginRequired, quizController.show);
router.get('/quizzes/new',                 sessionController.loginRequired, quizController.new);
router.post('/quizzes',                    sessionController.loginRequired, quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',  sessionController.loginRequired, quizController.edit);
router.put('/quizzes/:quizId(\\d+)',       sessionController.loginRequired, quizController.update);
router.delete('/quizzes/:quizId(\\d+)',    sessionController.loginRequired, quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play',  quizController.play);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);

module.exports = router;
