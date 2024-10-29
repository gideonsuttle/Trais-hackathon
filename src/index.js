const postgres = require('postgres')
const express = require('express')

const path = require('path')


const sql = postgres({
    host : 'localhost',
    port : 5432,
    database : 'activity',
    username : 'postgres',
    password : '1411gideon'
})

const app = express()
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add.html'));
})

app.get('/add', async(req, res) => {
    try{
        
        if(!req.query.name){
            return res.send({
                error: "Invalid name"
            })
        }
        else if (!req.query.task){
            return res.send({
                error: "Invalid task"
            })
        }
        else if (!req.query.status){
            return res.send({
                error: "Invalid status"
            })
        }
        const name = req.query.name
        const task = req.query.task
        const status = req.query.status
        const result = await sql`INSERT INTO task_manager (name, task, status) VALUES (${name}, ${task}, ${status})`
        res.status(200).send("Suceess")
    }
    catch(error){
        res.status(500).send('Error')
    }
})

app.get('/readall', async (req, res) => {
    try{
        const results = await sql`SELECT * FROM task_manager`;
        console.log(results)
        res.status(200).send(results)
    }catch(error){
        res.status(500).send('Internal Server Error')
    }
})

app.get('/update', async(req, res) => {
    try{
        if(!req.query.name){
            return res.send({
                error : "Invalid name"
            })
        }
        else if(!req.query.task){
            return res.send({
                error: "Invalid task"
            })
        }
        const update = req.query.status
        const name = req.query.name
        const task = req.query.task
        const results = await sql`Update task_manager set status = ${update} where name = ${name} and task = ${task}`
        if (results.count === 0) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.status(200).send("Sucess")
    }
    catch(error){
        res.status(500).send("error")
    }
})

app.listen(3000, () => {
    console.log("Server up on port 3000!")
})