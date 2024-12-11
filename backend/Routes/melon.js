const express = require('express');
const db = require('../dbconnection');
const router = express.Router();

router.get('/melon_top10', (req, res) => {
    const query = 'SELECT * FROM melon_chart LIMIT 10';

    db.query(query, (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

router.get('/melon_chart', (req, res) => {
    const query = 'SELECT * FROM melon_chart';

    db.query(query, (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

module.exports = router;
