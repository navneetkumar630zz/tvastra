function checkLogin (req, res, next){
    if(!req.session.user){
        req.flash("msg", "You need to login first");
        return res.redirect("/login");
    }else{
        next();
    };
};
function onLogin (req, res, next){
    if(req.session.user){
        return res.redirect("/");
    }else{
        next();
    };
};

function maxFiles(n) {
    return function (req, res, next) {
        console.log(req.body);
        // console.log(req);
        if(req.files.length > n) res.status(400).send("Maximum 5 files are allowed");
        else next();
    };
};

// module exports
module.exports = {
    checkLogin,
    onLogin,
    maxFiles
}