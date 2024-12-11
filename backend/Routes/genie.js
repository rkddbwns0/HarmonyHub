const express = require('express');
const db = require('../dbconnection');
const router = express.Router();

router.get('/genie_top10', (req, res) => {
    const query = 'SELECT * FROM genie_chart LIMIT 10';

    db.query(query, (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

router.get('/genie_chart', (req, res) => {
    const query = 'SELECT * FROM genie_chart';

    db.query(query, (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

module.exports = router;
