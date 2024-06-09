const jwt = require('jsonwebtoken');
const db = require('../dbConfig/db');

const auth = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        token = token.replace('Bearer ', '');
        console.log('auth token----', token)
        const tokenData = jwt.verify(token, 'myuniqueauthkey');
        const userId = tokenData.id;

        const getUserQuery = `select * from users where id = $1 and token= $2;`;
        console.log('getUserQuery----', getUserQuery)
        const userResult = await db.query(getUserQuery, [userId, token]);
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