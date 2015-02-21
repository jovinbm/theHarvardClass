/**
 * Created by jovinbm on 12/25/14.
 */
var dbURL = "";//your mongoDB url here

//THE APP
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');


var routes = require('./routes/router.js');
var basicAPI = require('./routes/basic_api.js');
var questionAPI = require('./routes/question_api.js');
var commentAPI = require('./routes/comment_api.js');
var logoutAPI = require('./routes/logout_api.js');
var basic = require('./functions/basic.js');
var online = require('./functions/online.js');
var authenticate = require('./functions/authenticate.js');


mongoose.connect(dbURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    basic.consoleLogger("Successfully connected to server");
});

app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, '/public')));
app.use("/bower_components", express.static(path.join(__dirname, '/bower_components')));
app.use(cookieParser());
app.use(session({
    key: 'hstatickey',
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: 604800000000},
    secret: 'hssjbm12234bsidh)))^Hjdsb',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

//configure passport
require('./passport/passport.js')(passport, OpenIDStrategy, LocalStrategy);

//insert any new client into a unique room = to his socketID
io.on('connection', function (socket) {
    socket.on('joinRoom', function (data) {
        var room = data.room;

        function success() {
            //emit event to continue execution on client
            socket.emit('joined');
        }

        socket.join(room);
        var user = {
            socketId: [socket.id],
            customUsername: data.customUsername
        };
        online.addUser(room, user, success);
    });

    socket.on('disconnect', function () {
        online.removeUser(socket.id);
    });

});


app.post('/harvardId/login', passport.authenticate('openid'));
app.post('/loginNew',
    passport.authenticate('local', {
        successRedirect: '/login1.html',
        failureRedirect: '/loginNew.html'
    }));
app.get('/harvardId',
    passport.authenticate('openid', {
        successRedirect: '/login1.html',
        failureRedirect: '/login.html'
    }));


app.get('/', routes.loginHtml);
app.get('/login.html', routes.loginHtml);
app.get('/loginNew.html', routes.loginNewHtml);
app.get('/login1.html', authenticate.ensureAuthenticated, routes.login_1_Html);
app.get('/chat.html', authenticate.ensureAuthenticated, routes.chatHtml);
app.post('/studentLogin', routes.studentLogin);
app.get('/socket.io/socket.io.js', function (req, res) {
    res.sendfile("socket.io/socket.io.js");
});
app.get('/error500.html', function (req, res) {
    res.sendfile("public/error/error500.html");
});

app.post('/sendEmail', basicAPI.sendEmail);
app.get('/api/getMyRoom', authenticate.ensureAuthenticated, basicAPI.getSocketRoom);
app.post('/api/startUp', authenticate.ensureAuthenticated, basicAPI.startUp);
app.post('/api/reconnect', authenticate.ensureAuthenticated, basicAPI.reconnect);

app.post('/api/getQuestions', authenticate.ensureAuthenticated, questionAPI.getQuestions);
app.post('/api/retrieveQuestion', authenticate.ensureAuthenticated, questionAPI.retrieveQuestion);
app.post('/api/newQuestion', authenticate.ensureAuthenticated, questionAPI.newQuestion);
app.post('/api/updateQuestion', authenticate.ensureAuthenticated, questionAPI.updateQuestion);
app.post('/api/upvote', authenticate.ensureAuthenticated, questionAPI.upvote);

app.post('/api/getComments', authenticate.ensureAuthenticated, commentAPI.getComments);
app.post('/api/newComment', authenticate.ensureAuthenticated, commentAPI.newComment);
app.post('/api/updateComment', authenticate.ensureAuthenticated, commentAPI.updateComment);
app.post('/api/promote', authenticate.ensureAuthenticated, commentAPI.promote);

app.post('/api/logoutHarvardLogin', authenticate.ensureAuthenticated, logoutAPI.logoutHarvardLogin);
app.post('/api/logoutCustomChat', authenticate.ensureAuthenticated, logoutAPI.logoutCustomChat);
app.post('/api/logoutHarvardChat', authenticate.ensureAuthenticated, logoutAPI.logoutHarvardChat);

server.listen(port);
exports.io = io;