const nodemailer = require('nodemailer')
require('dotenv').config()

async function mailService(mailPayload) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'Message <info@gmail.com>',
        to: mailPayload.to,
        subject: mailPayload.subject,
        html:
            `
                    <div>
                        <h1>Activation code: ${mailPayload.secretKey}</h1>
                    </div>
                `
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
}

module.exports = mailService
