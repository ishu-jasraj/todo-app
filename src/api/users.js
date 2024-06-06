const express = require('express');
const router = express.Router();
const db = require('../dbConfig/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const onEncryptPassword = async (plainPassword) => {
    const encryptedPassword = await bcrypt.hash(plainPassword, 8);
    return encryptedPassword;
}

const generateAuthToken = (user) => {
    const token = jwt.sign(user, 'myuniqueauthkey');
    console.log('token---', token);
    return token;
}

//signup 
router.post('/signup', async (req, res) => {
    try {
        console.log("signing uppppp")
        console.log('right ghere----')
        const { email, password } = req.body;

        const checkEmailQuery = `select id from users where email = $1;`;
        const checkEmailResult = await db.query(checkEmailQuery, [email]);

        if (checkEmailResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }


        //hash the password
        const encryptedPassword = await onEncryptPassword(password);

        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
        const insertUserResult = await db.query(insertUserQuery, [email, encryptedPassword]);
        res.status(201).json(insertUserResult.rows[0]);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
})

//login
router.post('/login', async (req, res) => {
    try {
        console.log('right ghere----')
        const { email, password } = req.body;

        const checkEmailQuery = `select * from users where email = $1;`;
        const checkEmailResult = await db.query(checkEmailQuery, [email]);

        if (checkEmailResult.rows.length <= 0) {
            return res.status(400).send('Please enter valid email ID or password')
        }
        else {
            const checkPasswordQuery = `select id from users where password = $1;`;
            const checkPasswordResult = await db.query(checkPasswordQuery, [password]);

            if (checkPasswordResult.rows.length <= 0) {
                return res.status(400).send('Please enter valid email ID or password');
            }

        }

        console.log('checkEmailResult.rows[0]--', checkEmailResult)
        const userId = checkEmailResult.rows[0].id;
        console.log('user id----', userId)
        const token = generateAuthToken({ id: userId });

        const updateUserToken = `update users set token = $1 where id = $2 returning *;`;
        const updateUserResult = await db.query(updateUserToken, [token, userId]);

        res.status(200).json(updateUserResult.rows[0]);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;
