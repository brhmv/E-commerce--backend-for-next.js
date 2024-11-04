const isAdmin = (req, res, next) => {
    console.log(req.user.isAdmin);
    console.log(req.user)
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
};

module.exports = isAdmin;