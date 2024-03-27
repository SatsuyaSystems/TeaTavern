console.log('[INFO] Loading...')
const port = 25567
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash')
require('dotenv/config');
var useragent = require('./useragent');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();


app.use(bodyParser.json());
app.use(cookieParser());
app.use(useragent.express());

//ASSETS
app.use('/assets', express.static(__dirname + '/assets'))

//CONNECT FLASH
app.use(flash())

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const OAuthConfig = require('./config/oauth');
const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${OAuthConfig.client_id}&redirect_uri=${encodeURIComponent(OAuthConfig.redirect_uri)}&response_type=code&scope=identify+guilds`;

app.use((req, res, next) => {
    if (req.path === '/oauth2/callback') {
        return next(); // Ensure this is the only operation performed in this condition
    }

    const token = req.cookies.auth;

    if (!token) {
        return res.redirect(discordAuthUrl); // Terminate the middleware chain here
    }

    jwt.verify(token, OAuthConfig.jwt_secret, (err, decoded) => {
        if (err) {
            return res.redirect(discordAuthUrl); // Terminate the middleware chain here
        }
        
        req.user = decoded;
        next(); // Proceed only if verification is successful
    });
});

app.get('/oauth2/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: OAuthConfig.client_id,
            client_secret: OAuthConfig.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: OAuthConfig.redirect_uri,
            scope: 'identify+guilds',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = tokenResponse.data.access_token;
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        isOnServer = false

        guildsResponse['data'].forEach(element => {
            if(element['id'] == "1098656771595313182") {
                isOnServer = true
            }
        });
        
        if (isOnServer == true) {
            const jwtToken = jwt.sign(userResponse.data, OAuthConfig.jwt_secret, { expiresIn: '1d' });
            res.cookie('auth', jwtToken, { httpOnly: !OAuthConfig.dev, secure: !OAuthConfig.dev });
            res.redirect('/');
        } else {
            res.send("NO PERMISSION!")
        }
        
    } catch (error) {
        console.error('Discord OAuth Error:', error.response ? error.response.data : error.message);
        // Extract the Discord error message if available, or use a generic error message
        const errorMessage = error.response && error.response.data ? error.response.data.error_description : "An unexpected error occurred during the authentication process.";
        res.status(500).render('500', { message: errorMessage });
    }
});

//ROUTES
app.use('/', require('./routes/index.js'));
app.use('/api', require("./routes/api.js"));
app.get('/403', async(req, res) => {
    res.render('403')
})
app.get('*', async(req, res) => {
    res.render('404')
})
app.post('*', async(req, res) => {
    res.render('404')
})


//TEMPLATING ENGINE
app.set('views', './views')
app.set('view engine', 'ejs')

//DB CONNECT
mongoose.set('strictQuery', false);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("[INFO] Mongo loaded"))

//PORT
app.listen(port, '0.0.0.0');
console.log('[INFO] API Online!')
console.log("hello world")

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    mongoose.connection.close()
    process.exit();
});