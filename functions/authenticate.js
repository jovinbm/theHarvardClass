/**
 * Created by jovinbm on 1/4/15.
 */
module.exports = {

    //authenticates requests
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            next()
        } else {
            res.redirect('login.html');
        }
    }
};