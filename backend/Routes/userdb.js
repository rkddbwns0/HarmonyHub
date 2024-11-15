const express = require('express');
const db = require('../dbconnection');
const session = require('express-session');
const router = express.Router();

router.post('/signup', (req, res) => {
    const { id, password, name, phone, nickname } = req.body;

    const query = 'INSERT INTO userdb (id, password, name, phone, nickname) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id, password, name, phone, nickname], (error, result) => {
        if (error) {
            console.error(error);
        }
        res.status(201).json(result);
    });
});

router.post('/checkUser', (req, res) => {
    const { id, phone } = req.body;

    let query = '';
    let type = '';
    let value = '';

    if (id) {
        query = 'SELECT id FROM userdb WHERE id = ?';
        value = id;
        type = '아이디';
    } else if (phone) {
        query = 'SELECT phone FROM userdb WHERE Phone = ?';
        value = phone;
        type = '휴대폰 번호';
    }

    db.query(query, [value], (error, result) => {
        if (error) {
            console.error(error);
        }
        if (result.length > 0) {
            res.json({ message: `이미 가입된 ${type}입니다.`, exist: false });
        } else if (result) {
            res.json({ message: `사용 가능한 ${type}입니다.`, exist: true });
        }
    });
});

router.post('/login', (req, res) => {
    const { id, password } = req.body;

    const query = 'SELECT * FROM userdb WHERE id = ? AND password = ?';

    db.query(query, [id, password], (error, result) => {
        if (error) {
            console.error(error);
        }
        if (result.length > 0) {
            const user = result[0];
            req.session.user = { id: user.id, name: user.name, nickname: user.nickname };
            req.session.save((error) => {
                if (error) {
                    console.error(error);
                }
                res.json({ login: true, user: req.session.user });
            });
        } else {
            res.json({ message: '로그인 실패' });
        }
    });
});

router.post('/user', (req, res) => {
    if (req.session.user && req.session.user.id) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'error' });
    }
});

router.post('/logout', async (req, res) => {
    if (req.session.user && req.session.user.id) {
        await req.session.destroy(function (error) {
            if (error) {
                console.error(error);
            }
        });
    }
});

module.exports = router;
