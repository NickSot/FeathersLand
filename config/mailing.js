const nodeMailer = require('nodemailer');
const fs = require('fs');

var transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  //true for 465 port, false for other ports
    auth: {
        user: JSON.parse(fs.readFileSync(__dirname + '/password.json')).email.username,
        pass: JSON.parse(fs.readFileSync(__dirname + '/password.json')).email.password
    }
});

module.exports = transporter;