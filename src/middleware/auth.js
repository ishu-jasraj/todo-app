const jwt = require('jsonwebtoken');
const db = require('../dbConfig/db');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        token = token.replace('Bearer ', '');
        const tokenData = jwt.verify(token, process.env.UNIQUE_KEY);
        const userEmail = tokenData.email;

        const getUserQuery = `select * from users where email = $1 and token= $2;`;
        const userResult = await db.query(getUserQuery, [userEmail, token]);
        if (userResult.rows.length <= 0) {
            throw new Error();
        }
        req.user = userResult.rows[0];
        next();
    } catch (err) {
        res.status(401).send('Unauthorized');
    }
}

module.exports = auth;