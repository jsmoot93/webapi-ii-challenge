const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send("Server setup in progress...");
});

server.post('/api/posts', (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db
        .insert(newPost)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        });
});

server.get('/api/posts', (req, res) => {
    db
        .find()
        .then(posts => {
            res.status(200).json({posts});
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        });
});

server.get('/api/posts/:id', (req, res) => {
    postId = req.params.id
    db
     .findById(postId)
     .then(post => {
         if (post.length === 0) {
             res.status(404).json({ message: "The post with the specified ID does not exist." });
             return;
         }
         res.status(200).json(post);
     })
     .catch(err => {
         res.status(500).json({ error: "The post information could not be retrieved." })
     });
});

server.delete('/api/posts/:id', (req, res) => {
    const postId = req.params.id
    db
        .remove(postId)
        .then(postId => {
            if (postId === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
                return;
            }
            res.status(200).json(postId);
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
        });
});

server.put('/api/posts/:id', (req, res) => {
    const updateId = req.params.id
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db
        .update(updateId, req.body)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
                return;
            }
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        });
});

server.listen (5000, () => {
    console.log('\n*** API running on port 5000 ***\n');
});