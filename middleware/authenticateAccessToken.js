const jwt = require('jsonwebtoken');

const authenticateAccessToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    console.log(token);
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        // req.user = user;
        next();

    } catch (err) {
        res.status(400).send('Invalid token');
        // return res.status(403).json({ error: 'Invalid or expired token.' });

    }
};

module.exports = authenticateAccessToken;