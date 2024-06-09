const jwt = require('jsonwebtoken');
const db = require('../dbConfig/db');

const auth = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        token = token.replace('Bearer ', '');
        const tokenData = jwt.verify(token, 'myuniqueauthkey');
        const userId = tokenData.id;

        const getUserQuery = `select * from users where id = $1;`;
        const userResult = await db.query(getUserQuery, [userId]);
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