/**
 * Created by jovinbm on 1/12/15.
 */
//harvard openId config
var returnURL = ""; //your passport return URL here;
var realmURL = "";//your website real URL here;

var cuid = require('cuid');
var basic = require('../functions/basic.js');
var userDB = require('../db/user_db.js');
var HarvardUser = require("../database/harvardUsers/harvard_user_model.js");

module.exports = function (passport, OpenIDStrategy, LocalStrategy) {
    passport.use(new OpenIDStrategy({
            returnURL: returnURL,
            realm: realmURL,

            profile: true
        },
        function (identifier, profile, done) {
            var id = identifier;
            var uniqueCuid = cuid();
            var socketRoom = cuid();
            var displayName = profile.displayName || "Harvard Member";
            var email = profile.emails[0].value || cuid() + "@harvardclass.com";

            //defining all callbacks
            function error(status, err) {
                basic.consoleLogger("**** Passport.use err = " + err);
                if (status == -1 || status == 0) {
                    var user = new HarvardUser({
                        id: id,
                        uniqueCuid: uniqueCuid,
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

                    userDB.saveHarvardUser(user, saveError, saveError, saveSuccess);
                }
            }

            function success(theHarvardUser) {
                done(null, theHarvardUser);
            }

            userDB.findHarvardUser(id, error, error, success);

        }
    ));

    passport.use(new LocalStrategy(
        function (username, password, done) {
            if (username == password) {
                var id = cuid();
                var uniqueCuid = cuid();
                var socketRoom = cuid();
                var displayName = username;
                var email = cuid() + '@harvardclass.com';

                var user = new HarvardUser({
                    id: id,
                    uniqueCuid: uniqueCuid,
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

                userDB.saveHarvardUser(user, saveError, saveError, saveSuccess);

            } else {
                done(new Error("ERROR: app.js: passport.use: Incorrect Password"));
            }
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

        userDB.findHarvardUser(id, error, error, success);
    });
};