const express = require('express');
const router = express.Router();
const db = require('../dbConfig/db');
const jwt = require('jsonwebtoken');


const generateAuthToken = (user) => {
    const token = jwt.sign(user, 'myuniqueauthkey');
    console.log('token---', token);
    return token;
}

//signup 
const signup = async (req, res) => {
    try {
        console.log("signing uppppp")
        console.log('right ghere----')
        const { email, password } = req.body;

        const checkEmailQuery = `select id from users where email = $1;`;
        const checkEmailResult = await db.query(checkEmailQuery, [email]);

        if (checkEmailResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const token = generateAuthToken({ email });

        const magicLink = `http://localhost:3000/users/magic?token=${token}&email=${email}`;

        // Insert the new user into the database
        const insertUserQuery = 'INSERT INTO users (email, token) VALUES ($1, $2) RETURNING *';
        const insertUserResult = await db.query(insertUserQuery, [email, token]);
        const output = {
            Msg: "Registered Successfully",
            Login: magicLink
        }
        res.status(201).json(output);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
}

//login
const login = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const checkEmailQuery = `select * from users where email = $1;`;
            const checkEmailResult = await db.query(checkEmailQuery, [email]);
            if (checkEmailResult.rows.length <= 0) {
                return res.status(400).send('Please enter valid email ID')
            }
            else {
                const userId = checkEmailResult.rows[0].id;
                const token = generateAuthToken({ email });

                const magicLink = `http://localhost:3000/users/magic?token=${token}&email=${email}`;

                const updateQuery = `update users set token = $1 where id = $2;`;
                await db.query(updateQuery, [token, userId]);
                return res.send(magicLink);
            }
        }
        res.status(400).send('Please enter valid email ID');
    } catch (err) {
        res.status(400).send(err);
    }
}
const verifyLogin = async (req, res) => {
    try {
        // console.log('fvdshdhjdfhjdhj---', req.query)
        const { email, token } = req.query;
        if (email && token) {
            const checkQuery = `select * from users where email = $1 and token = $2;`;
            // console.log('check query---', checkQuery)
            const checkResult = await db.query(checkQuery, [email, token]);
            // console.log("checkResult----", checkResult)
            if (checkResult.rows.length <= 0) {
                return res.status(400).send('Invalid login');
            }
            else {
                const userId = checkResult.rows[0].id;

                const updateQuery = `update users set isvalidate = true where id = $1 returning *;`;
                const updateResult = await db.query(updateQuery, [userId]);
                res.send("Logged In successfullly ");
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }
}


const logout = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const query = `update users set token = null, isvalidate = false where id = $1;`;
        await db.query(query, [userId]);

        res.send('Logged out successfully.');

    }
    catch (err) {
        res.status(400).send(err);
    }
}

module.exports = {
    userSignup: signup,
    userLogin: login,
    userLogout: logout,
    verifyLogin
};
