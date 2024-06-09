const db = require('../dbConfig/db');

//create task
const createNewTask = async (req, res) => {
    try {
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
        const { id: userId } = req.user;

        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'id',
            order = 'asc',
            startDate,
            endDate
        } = req.query;

        let fetchQuery = `SELECT id, title, description FROM tasks WHERE user_id = $1`;
        const values = [userId];
        let index = 2;

        // Add search filter
        if (search) {
            fetchQuery += ` AND (title ILIKE $${index} OR description ILIKE $${index})`;
            values.push(`%${search}%`);
            index++;
        }

        // Add sorting
        fetchQuery += ` ORDER BY ${sortBy} ${order}`;

        // Add pagination
        fetchQuery += ` LIMIT $${index} OFFSET $${index + 1}`;
        values.push(limit, (page - 1) * limit);
        const result = await db.query(fetchQuery, values);

        res.send(result.rows);
    } catch (err) {
        console.log(err);
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
                                and id = $2 returning *;`;
        const result = await db.query(updateQuery, [...values]);

        res.send(result.rows);
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