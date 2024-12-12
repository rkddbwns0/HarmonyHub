const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const access_token = req.cookies.accessToken;

    if (access_token) {
        try {
            const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('토큰 없어용');
    }
};

module.exports = checkToken;
