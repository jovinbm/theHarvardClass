/*Define authentication functions*/
module.exports = {

    //authenticates requests
    ensureAuthenticated: function(req, res, next){
        if (req.isAuthenticated()) {
            next()
        } else {
            res.redirect('login.html');
        }
    }
};