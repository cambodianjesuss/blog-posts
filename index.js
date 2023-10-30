const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/', (req, res)=>{
    res.send("Hello Posts!")
})

app.get('/posts', (req, res)=>{
    res.send(posts);
});

app.post('/posts', async (req, res)=>{
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id,
        title
    }

    // Events to emmit
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    });

    res.status(201).send(posts[id]);
});

// Event Handler
app.post('/events', (req, res)=>{
    console.log('Recieved Event:', req.body.type);
});

app.listen(4000, ()=>{
    console.log('Posts Service on 4000')
});