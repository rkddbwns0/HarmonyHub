const express = require('express');
const db = require('../dbconnection');
const router = express.Router();

const postViewTimeStamp = new Map();

router.post('/insert', (req, res) => {
    if (req.session.user && req.session.user.id) {
        const { category_no, writer, title, content, image } = req.body;
        const userId = req.session.user.id;
        const regDate = new Date();
        const kstOffset = 9 * 60;
        const kstDate = new Date(regDate.getTime() + kstOffset * 60 * 1000);
        const dateString = kstDate.toISOString();
        const formatDate = dateString.slice(0, 19);

        const query =
            'INSERT INTO postdb (user_id, category_no, writer, title, content, image, regDate) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [userId, category_no, writer, title, content, image, formatDate], (error, result) => {
            if (error) {
                console.error(error);
            }
            res.json({ success: true });
        });
    }
});

router.get('/select', (req, res) => {
    const { category_no } = req.query;
    const query =
        'SELECT ROW_NUMBER() OVER (PARTITION BY category_no) AS row_num, no, title, writer, title, regDate, hits, liked FROM postdb WHERE category_no = ? ORDER BY regDate DESC';

    db.query(query, [category_no], (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

router.get('/view', (req, res) => {
    const { post_no, category_no } = req.query;

    const viewQuery = `SELECT * FROM postdb WHERE no = ? AND category_no = ?`;
    const updateQuery = `UPDATE postdb SET hits = hits + 1 where no = ? AND category_no = ?`;

    const VIEW_EXPIRATION_TIME = 60 * 60 * 1000;

    const lastViewedTime = postViewTimeStamp.get(post_no);

    if (lastViewedTime) {
        const currentTime = Date.now();

        if (currentTime - lastViewedTime < VIEW_EXPIRATION_TIME) {
            db.query(viewQuery, [post_no, category_no], (error, result) => {
                if (error) {
                    console.error(error);
                }
                res.json(result[0]);
            });
            return;
        }
    }

    db.query(viewQuery, [post_no, category_no], (error, result) => {
        if (error) {
            console.error(error);
        }

        db.query(updateQuery, [post_no, category_no], (error, updateResult) => {
            if (error) {
                console.error(error);
            }

            postViewTimeStamp.set(post_no, Date.now());

            setTimeout(() => {
                postViewTimeStamp.delete(post_no);
            }, VIEW_EXPIRATION_TIME);

            res.json(result[0]);
        });
    });
});

router.post('/checkLiked', async (req, res) => {
    if (req.session.user && req.session.user.id) {
        const userId = req.session.user.id;
        const { post_no, category_no } = req.body;

        try {
            const [result] = await db
                .promise()
                .query('SELECT * FROM check_liked WHERE user_id = ? AND post_no = ? AND category_no = ?', [
                    userId,
                    post_no,
                    category_no,
                ]);
            if (result.length > 0) {
                res.json({ liked: true });
            } else {
                res.json({ liked: false });
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        res.status(401).json({ error: 'error' });
    }
});

router.post('/liked', async (req, res) => {
    if (req.session.user && req.session.user.id) {
        const userId = req.session.user.id;
        const { post_no, category_no } = req.body;
        try {
            const [result] = await db
                .promise()
                .query('SELECT liked FROM check_liked WHERE user_id = ? AND post_no = ? AND category_no = ?', [
                    userId,
                    post_no,
                    category_no,
                ]);
            if (result.length === 0) {
                await db
                    .promise()
                    .query(`INSERT INTO check_liked (user_id, post_no, category_no, liked) VALUES (?, ?, ?, 'yes')`, [
                        userId,
                        post_no,
                        category_no,
                    ]);
                await db
                    .promise()
                    .query(`UPDATE postdb SET liked = liked + 1 WHERE no = ? AND category_no`, [post_no, category_no]);
                res.json({ success: true });
            } else {
                await db
                    .promise()
                    .query(`DELETE FROM check_liked WHERE user_id = ? AND post_no = ? AND category_no = ?`, [
                        userId,
                        post_no,
                        category_no,
                    ]);
                await db
                    .promise()
                    .query(`UPDATE postdb SET liked = liked - 1 WHERE no = ? AND category_no = ?`, [
                        post_no,
                        category_no,
                    ]);
                res.json({ success: true });
            }
        } catch (error) {
            console.error(error);
        }
    }
});

router.get('/popular_hits', (req, res) => {
    const query = `
    SELECT postdb.no, postdb.category_no, postdb.title, postdb.writer, postdb.regDate, postdb.hits, postdb.liked, posts_category.category 
    FROM postdb
    JOIN posts_category ON postdb.category_no = posts_category.no
    ORDER BY hits DESC
    LIMIT 10;
    `;
    db.query(query, (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

router.get('/popular_liked', (req, res) => {
    const query = `
    SELECT postdb.no, postdb.category_no, postdb.title, postdb.writer, postdb.regDate, postdb.hits, postdb.liked, posts_category.category
    FROM postdb
    JOIN posts_category ON postdb.category_no = posts_category.no
    ORDER BY liked DESC
    LIMIT 10    
    `;
    db.query(query, (error, result) => {
        if (error) {
            console.error(error);
        }
        res.json(result);
    });
});

module.exports = router;
