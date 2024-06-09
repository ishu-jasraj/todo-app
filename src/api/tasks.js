const db = require('../dbConfig/db');

//create task
const createNewTask = async (req, res) => {
    try {
        console.log('req user----', req.user)
        const { id: userId } = req.user;
        let { title, description } = req.body;

        //keeping title and description both mandatory
        title = title?.trim();
        description = description?.trim();

        if (!title || title == '' || !description || description == '') {
            return res.status(400).send('please enter valid title and description');
        }

        const createQuery = `insert into tasks(user_id, title, description) values($1, $2, $3) returning *;`;
        const result = await db.query(createQuery, [userId, title, description]);
        res.status(201).send(result.rows);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
}

//fetch all tasks of user
const fetchAllTasks = async (req, res) => {
    try {
        console.log(req.params)
        const { id: userId } = req.user;

        const fetchQuery = `select id,title,description from tasks where user_id = $1;`;
        const result = await db.query(fetchQuery, [userId]);

        res.send(result.rows);
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
}

//update task by task ID
const updateTask = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id } = req.body;
        console.log(req.body)
        const values = [userId, id];
        let updateCase = '';
        Object.entries(req.body).forEach(([key, value]) => {
            if (key != 'id') {
                values.push(value);
                if (updateCase) updateCase += ',';
                updateCase += ` ${key} = $${values.length}`;
            }
        });
        if (updateCase.length <= 0) {
            return res.status(400).send('Invalid Update');
        }

        const updateQuery = `update tasks
                                set ${updateCase}
                                where user_id = $1
                                and id = $2;`;
        const result = await db.query(updateQuery, [...values]);

        res.send('Task updated successfully.');
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
}

//delete task by task ID
const deleteTask = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id: taskId } = req.body;

        const deleteQuery = `Delete from tasks where id = $1 and user_id = $2;`;
        await db.query(deleteQuery, [taskId, userId]);

        res.send('Task deleted successfully.');
    } catch (err) {
        console.log(err)
        res.status(400).send(err);
    }
}



module.exports = {
    createNewTask,
    fetchAllTasks,
    updateTask,
    deleteTask
}