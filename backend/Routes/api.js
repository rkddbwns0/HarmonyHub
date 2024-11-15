const express = require('express');
const db = require('../dbconnection');
const router = express.Router();
const querystring = require('querystring');
const { SPOTIFY_CLIENT_ID, SCOPE, REDIRECT_URI, SPOFIFY_CLENT_SECRET } = require('../config');

const getSpotifyRefreshToken = async (code) => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const data = querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOFIFY_CLENT_SECRET,
    });
};

router.get('/login', (req, res) => {
    res.redirect(
        `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`
    );
});

router.get('/callback', async (req, res) => {
    const searchParams = new URLSearchParams(req.query);
    const code = searchParams.get('code');

    const tokenResponse = await getSpotifyRefreshToken(code);

    if (tokenResponse) {
        res.cookie('refresh_token', tokenResponse.refresh_token, {
            httpOnly: true,
        });
    }
    console.log(tokenResponse);
    res.redirect('http://localhost:8080');
});

module.exports = router;
