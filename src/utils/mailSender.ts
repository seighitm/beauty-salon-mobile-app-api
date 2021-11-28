const nodemailer = require('nodemailer')
require('dotenv').config()

module.exports = async (mailPayload) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'Message <info@gmail.com>',
        to: mailPayload.to,
        subject: mailPayload.subject,
        html: mailPayload.html
    }

    return await transporter.sendMail(mailOptions);
}
