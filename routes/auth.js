// routes/auth.js
const router = require('express').Router();
const passport = require('passport');


router.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) { // Check if the user is authenticated
        res.redirect('/home'); // Redirect to home if logged in
    } else {
        res.render('login');
    }
});

router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/auth/login',
    failureFlash: false
}), function(req, res, next) {
    res.redirect('/home'); // Redirect to home after successful login
});

router.get('/logout',function(req,res){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect('login')
    })
})

module.exports = router;
