const express = require('express');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const userdb = require('./Routes/userdb');
const postdb = require('./Routes/postdb');
const posts_category = require('./Routes/post_category');
const comments = require('./Routes/comments');
const melon = require('./Routes/melon');
const genie = require('./Routes/genie');
const bugs = require('./Routes/bugs');
const router = require('./Routes/melon');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 60 * 60 * 24 * 1000 },
    })
);
app.use(cookieParse());

app.use('/userdb', userdb);

app.use('/postdb', postdb);

app.use('/posts_category', posts_category);

app.use('/comments', comments);

app.use('/melon_chart', melon);

app.use('/genie_chart', genie);

app.use('/bugs_chart', bugs);

app.use(express.static(path.join(__dirname, '../community/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../community/build/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../community/build/index.html'));
});

app.listen(8080, function () {
    console.log(`listen on 8080`);
});
