const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth;
const MAILING_SERVICE_CLIENT_ID = '720561311023-ngl368f9dc8q09eomupnfh51ck7kg3nr.apps.googleusercontent.com'
const MAILING_SERVICE_CLIENT_SERECT = 'ZhHByfB4UzJju6c5hWA7jm_f'
const MAILING_SERVICE_REFRESH_TOKEN = '1//04hAlGqLl6gaUCgYIARAAGAQSNwF-L9IrfmKo9XIdh_KtYteyj3MxOKrZ0_Z_pKNBkVAEc9ncVh4U4PM3vwMHiPgJRn4wUd8bIY0'
const SENDER_EMAIL_ADDRESS = 'cuhuy124@gmail.com'
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'



const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SERECT,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

// send mail
const sendEmail = (to, url, txt) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SERECT,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "Verify your email",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: black;">Welcome to qhdev's website.</h2>
            <p>
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: black; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if (err) {
            console.log('Mail couldn\'t be sent because: ' + err);
        } else {
            console.log('Mail sent');
            return infor;
        }
    })
}

module.exports = sendEmail