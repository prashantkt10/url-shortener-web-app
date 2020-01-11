const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json({ extended: false }));

//Register API
app.use('/api/register', require('./router/api/register/register'));

//Login API
app.use('/api/login', require('./router/api/login/login'));

//Set OTP API
app.use('/api/setotp', require('./router/api/otp/setotp'));

//Get OTP API
app.use('/api/verifyotp', require('./router/api/otp/verifyotp'));

//Single css file for all
app.use('/styles', require('./router/static/css/styles'));

// login page route
app.use('/login', require('./router/static/html/login'));
app.use('/login.js', require('./router/static/js/login'));
app.use('/login/login.js', require('./router/static/js/login'));


//Setting 404 page
app.use('*', (req, res) => { res.sendFile(__dirname + '/public/404_page/index.html'); });
app.use('login/lost_cat.jpg', (req, res) => { res.sendFile(__dirname + '/public/404_page/lost_cat.jpg'); });



app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));