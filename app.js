/**
 * Created by jovinbm on 12/25/14.
 */

var dbURL = //your mongoDB url here
//harvard openId config
var returnURL = //your passport return URL here; 
var realmURL= //your website real URL here;


// THE APP
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cuid = require('cuid');
var port = process.env.PORT || 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var email = require("emailjs");
var mailServer = email.server.connect({
    user: "jovinbeda@gmail.com",
    password: "uxccpufouacqxrzm",
    host: "smtp.gmail.com",
    ssl: true
});
var passport = require('passport');
var OpenIDStrategy = require('passport-openid').Strategy;
var routes = require('./routes/router.js');
var basic = require('./functions/basic.js');
var ioJs = require('./functions/io.js');
var dbJs = require('./functions/db.js');
var online = require('./functions/online.js');
var authenticate = require('./functions/authenticate.js');
var event_handlers = require('./event_handlers/event_handlers.js');
var Question = require("./database/questions/question_model.js");
var HarvardUser = require("./database/harvardUsers/harvard_user_model.js");

var checkOnlineInterval = 120000;

var mongoose = require('mongoose');
mongoose.connect(dbURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    basic.consoleLogger("Successfully connected to server");
});

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    key: 'your.sid-key',
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: null},
    secret: '1234567890QWERTY',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

//configure passport
passport.use(new OpenIDStrategy({
        returnURL: returnURL,
        realm: realmURL,

        profile: true
    },
    function (identifier, profile, done) {
        var id = identifier;
        var socketRoom = cuid();
        var displayName = profile.displayName;
        var email = profile.emails[0].value;

        //defining all callbacks
        function error(status, err) {
            basic.consoleLogger("**** Passport.use err = " + err);
            if (status == -1 || status == 0) {
                var user = new HarvardUser({
                    id: id,
                    socketRoom: socketRoom,
                    displayName: displayName,
                    email: email
                });

                function saveError(status, err) {
                    if (status == -1) {
                        basic.consoleLogger("**** Passport.use: saveError = " + err);
                        done(new Error("ERROR: app.js: passport.use: Error saving/ retrieving info"));
                    }
                }

                function saveSuccess(theSavedUser) {
                    done(null, theSavedUser)
                }

                dbJs.saveHarvardUser(user, saveError, saveError, saveSuccess);
            }
        }

        function success(theHarvardUser) {
            done(null, theHarvardUser);
        }

        dbJs.findHarvardUser(id, error, error, success);

    }
));

passport.serializeUser(function (user, done) {
    //only save the userId into the session to keep the data stored low
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    //deserialize the saved id in session and find the user with the userId
    function error(status) {
        if (status == -1 || status == 0) {
            done(new Error("ERROR: app.js: passport.deserializeUser: Error retrieving info"));
        }
    }

    function success(theHarvardUser) {
        done(null, theHarvardUser);
    }

    dbJs.findHarvardUser(id, error, error, success);
});

app.post('/harvardId/login', passport.authenticate('openid'));
app.get('/harvardId',
    passport.authenticate('openid', {
        successRedirect: '/login1.html',
        failureRedirect: '/login.html'
    }));


//handling requests;
app.get('/', routes.loginHtml);
app.get('/login.html', routes.loginHtml);
app.get('/login1.html', authenticate.ensureAuthenticated, routes.login_1_Html);
app.get('/chat.html', authenticate.ensureAuthenticated, routes.chatHtml);
app.post('/studentLogin', routes.studentLoginPost);
app.get('/socket.io/socket.io.js', function (req, res) {
    res.sendfile("socket.io/socket.io.js");
});


//insert any new client into a unique room = to his socketID
io.on('connection', function (socket) {

    socket.on('joinRoom', function (room) {
        socket.join(room);

        //emit event to continue execution on client
        socket.emit('joined');
    });

});

app.post('/sendEmail', function (req, res) {
    res.redirect('login.html');
    var message = {
        text: "Name: " + req.body.name + ", Email: " + req.body.email + ", Message: " + req.body.message,
        from: req.body.email,
        to: "jovinbeda@gmail.com",
        subject: "HARVARDCLASS WEBSITE"
    };
    mailServer.send(message, function (err) {
        basic.consoleLogger(err || "EMAIL: Message sent to jovinbeda@gmail.com");
    });
});


app.post('/iAmOnline', function (req, res) {
    //retrieve the customUsername and socketRoom
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: app.post: iAmOnline: user retrieval: " + err);
        }
    }

    function success(theHarvardUser) {
        event_handlers.iAmOnline(req, res, theHarvardUser.customUsername, theHarvardUser.socketRoom);
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});


app.post('/getMyRoom', function (req, res) {
    //retrieve the socketRoom
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: socket.on: getMyRoom: user retrieval: " + err);
        }
    }

    function success(theHarvardUser) {
        res.contentType('json');
        res.send(JSON.stringify({"socketRoom": theHarvardUser.socketRoom}));
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});


app.post('/readyToChat', function (req, res) {
    basic.consoleLogger('READY_TO_CHAT event received');
    //retrieve the customUsername
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: socket.on: readyToChat: user retrieval: " + err);
        }
    }

    function success(theHarvardUser) {
        event_handlers.readyToChat(req, res, io, theHarvardUser);
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});

app.post('/getHistory', function (req, res) {
    basic.consoleLogger('GET_HISTORY event received');
    var currentQuestionIndex = req.body.currentQuestionIndex;
    //complete the ajax request first to avoid multiple ajax requests
    res.contentType('json');
    res.send({status: JSON.stringify({response: 'success'})});
    //retrieve the customUsername
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: socket.on: getHistory: user retrieval: " + err);
        }
    }

    function success(theHarvardUser) {
        event_handlers.getHistory(req, res, io, theHarvardUser, currentQuestionIndex);
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});


app.post('/clientQuestion', function (req, res) {
    basic.consoleLogger('CLIENT_QUESTION event received');
    var theQuestion = req.body;
    //complete the ajax request first to avoid multiple ajax requests
    res.contentType('json');
    res.send({status: JSON.stringify({response: 'success'})});
    //get the Harvard User
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: socket.on: clientQuestion: user retrieval: " + err);
        }
    }

    function success(theHarvardUser) {
        event_handlers.clientQuestion(req, res, io, theHarvardUser, theQuestion);
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});


app.post('/upvote', function (req, res) {
    basic.consoleLogger('UPVOTE event received');
    //complete the ajax request first to avoid multiple ajax requests
    res.contentType('json');
    res.send({status: JSON.stringify({response: 'success'})});
    //retrieve the upvoted index
    var upvotedIndex = req.body.index;
    //retrieve the user
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: socket.on: upvote: user retrieval: " + err);
        }
    }

    function success(theHarvardUser) {
        event_handlers.upvote(req, res, io, theHarvardUser, upvotedIndex);
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});


app.post('/logoutHarvardLogin', function (req, res) {
    basic.consoleLogger('LOGOUT HARVARD LOGIN event received');
    event_handlers.logoutHarvardLogin(req, res);
});


app.post('/logoutCustomChat', function (req, res) {
    basic.consoleLogger('LOGOUT CUSTOM CHAT event received');
    /*no need to complete the ajax request -- user will be redirected to login which has it's
     own js file*/
    //retrieve the user
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: socket.on: logoutCustomChat: " + err);
        }
    }

    function success(theHarvardUser) {
        //toggle the user's customLoggedInStatus
        function toggled() {
            event_handlers.logoutCustomChat(req, res, theHarvardUser, io);
        }

        dbJs.toggleCls(req.user.id, 0, error, error, toggled);
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});


app.post('/logoutHarvardChat', function (req, res) {
    basic.consoleLogger('LOGOUT HARVARD CHAT event received');
    /*no need to complete the ajax request -- user will be redirected to login which has it's
     own js file*/
    //retrieve the user
    function error(status, err) {
        if (status == -1 || status == 0) {
            basic.consoleLogger("ERROR: socket.on: logoutCustomChat: " + err);
        }
    }

    function success(theHarvardUser) {
        //toggle the user's customLoggedInStatus
        function toggled() {
            event_handlers.logoutHarvardChat(req, res, theHarvardUser, io);
        }

        dbJs.toggleCls(req.user.id, 0, error, error, toggled);
    }

    dbJs.findHarvardUser(req.user.id, error, error, success);
});


//redirect every other request to home
app.get('*', routes.loginHtml);


//functions that will operate continuously
function checkOnline() {
    event_handlers.checkOnlineUsers(io);
}

//function to check and usersOnline at regular intervals
setInterval(checkOnline, checkOnlineInterval);

//start server
server.listen(port);