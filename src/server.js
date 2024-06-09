const express = require('express');
const db = require('./dbConfig/db');
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use('/tasks', taskRouter);


// app.get('/', async (req, res) => {
//     try {
//         const result = await db.query('SELECT NOW()');
//         console.log("result.rows---", result.rows)
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
