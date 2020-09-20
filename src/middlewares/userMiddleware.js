function userMiddleware(req, res, next) {
    if(req.session.user) {
        res.locals.localUser = req.session.user 
        next();              
    } else {
        res.redirect('/')
    }
}

module.exports = userMiddleware;