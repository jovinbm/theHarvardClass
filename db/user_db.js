/**
 * Created by jovinbm on 1/18/15.
 */
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var HarvardUser = require("../database/harvardUsers/harvard_user_model.js");


module.exports = {

    //finds a specific Harvard User
    findHarvardUser: function (openId, error_neg_1, error_0, success) {
        HarvardUser.findOne({id: openId}).exec(
            function (err, theHarvardUser) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (theHarvardUser == null || theHarvardUser == undefined) {
                    error_0(0, err);
                } else {
                    success(theHarvardUser);
                }
            }
        );
    },


    saveHarvardUser: function (theUserObject, error_neg_1, error_0, success) {
        theUserObject.save(function (err, theSavedUser) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(theSavedUser);
            }
        });
    },

    updateCuCls: function (openId, customUsername, customLoggedInStatus, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
                $set: {
                    customUsername: customUsername,
                    customLoggedInStatus: customLoggedInStatus
                }
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    toggleCls: function (openId, newCustomLoggedInStatus, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {$set: {customLoggedInStatus: newCustomLoggedInStatus}}).exec(function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success();
            }
        });
    }


};