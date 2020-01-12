const bcrypt = require('bcrypt');

bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash('1234567', salt, (err, pass) => {
        console.log(pass);
    });
})
// password = await bcrypt.hash(password, salt);