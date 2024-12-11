const express = require('express');
const db = require('../dbconnection');
const router = express.Router();

router.get('/category', (req, res) => {
    const query = 'SELECT * FROM posts_category';
    db.query(query, (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

module.exports = router;
