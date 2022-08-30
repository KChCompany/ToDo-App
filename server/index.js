const connection = require('./db')
const cors = require('cors')
const express = require('express')
const app = express()
const Task = require("./models/task");
const User = require('./models/user');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

connection()

app.use(cors())
app.use(express.json())

const ITEMS_PER_PAGE = 3;

app.get('/', async(req, res) => {
    const currentPage = req.query.page || 1
    const sort = req.query.sort || '-_id'
    const query = {};
    try {
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const countPromise = Task.estimatedDocumentCount(query);
        const itemsPromise = Task.find(query).sort(sort).limit(ITEMS_PER_PAGE).skip(skip);
        const [count, items] = await Promise.all([countPromise, itemsPromise]);
        const pageCount = count / ITEMS_PER_PAGE;

        res.send({
            pagination: {
                count,
                pageCount,
                currentPage
            },
            items,
        });
    } catch (error) {
        res.send(error);
    }
})

app.post("/", async (req, res) => {
    try {
        const task = await new Task(req.body).save();
        res.send(task);
    } catch (error) {
        res.send(error);
    }
});

app.put("/:id", async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const login = decoded.login
        const user = await User.findOne({ login })
        if (user.login === 'admin') {
            const task = await Task.findOneAndUpdate(
                { _id: req.params.id },
                req.body
            );
            res.send(task);
        } else {
            res.json({ status: 'error', error: 'Access is denied' })
        }
    } catch (error) {
        res.json({ status: 'error', error: 'Access is denied' })
    }
});

app.delete("/:id", async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const login = decoded.login
        const user = await User.findOne({ login })
        if (user.login === 'admin') {
            const task = await Task.findByIdAndDelete(req.params.id);
            res.send(task);
        } else {
            res.json({ status: 'error', error: 'Access is denied' })
        }
    } catch (error) {
        res.json({ status: 'error', error: 'Access is denied' })
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        login: req.body.login,
    })
    if (!user) {
        return res.json({ status: 'error', error: 'Invalid login' })
    }
    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if (isPasswordValid) {
        const token = jwt.sign(
            {
                login: user.login,
            },
            'secret123'
        )
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
})

const port = process.env.PORT || 8080
app.listen(port)
