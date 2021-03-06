const express = require('express'), morgan = require('morgan'), cookieParser = require('cookie-parser');
const app = express(), auth = require('./middlewares/auth');

const PORT = process.env.PORT || 8080;


//express middlewares
// app.use(morgan('combined'));
app.use(express.json({ extended: false }));
app.use(cookieParser());

//Register API
app.use('/api/register', require('./router/api/register/register'));

//Login API
app.use('/api/login', require('./router/api/login/login'));

//Set OTP API
app.use('/api/setotp', require('./router/api/otp/setotp'));

//Get OTP API
app.use('/api/verifyotp', require('./router/api/otp/verifyotp'));

//url-shortner apis
app.use('/api/shorten', auth, require('./router/api/url/shorten'));

//get all shortened url by user
app.use('/api/shorted', auth, require('./router/api/url/shorted'))

//get time series data
app.use('/api/admin', auth, require('./router/api/admin/admin'));

//Logout API
app.use('/api/logout', (req, res) => { res.clearCookie('auth-token'); return res.json({ success: 1, fail: 0, system: 0 }) });


// css file for all pages
app.use('/styles', require('./router/static/css/styles'));

// login page route
app.use('/login', auth, require('./router/static/html/login'));
app.use('/login.js', require('./router/static/js/login'));
app.use('/login/login.js', require('./router/static/js/login'));

//home page route
app.use('/home', auth, require('./router/static/html/home'));
app.use('/home.js', require('./router/static/js/home'));
app.use('/home/home.js', require('./router/static/js/home'));


//home page route
app.use('/admin', auth, require('./router/static/html/admin'));
app.use('/admin.js', require('./router/static/js/admin'));
app.use('/admin/admin.js', require('./router/static/js/admin'));


app.use('/*', require('./router/api/url/redirect'));

//handling all other requests
// app.use('*', auth, async (req, res) => {
//     if (!req.user) { await res.clearCookie(); return res.redirect('/login'); }
//     else { if (req.user.user.role == 0) return res.redirect('/home'); else return res.redirect('/admin'); }
// });
app.use('login/lost_cat.jpg', (req, res) => { res.sendFile(__dirname + '/public/404_page/lost_cat.jpg'); });



app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));