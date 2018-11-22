import nodemailer from 'nodemailer';

/**
 * @author EmmsDan <>
 */
class EmailSenderController {
/**
 *
 * @param {object} mailOptions
 */
  static sendMail(mailOptions) {
    // SMTP service account for sending mail.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 25,
      secure: false,
      auth: {
        user: 'ecomje@gmail.com',
        pass: '08036459847emmsdance123'
      }
    });
    mailOptions.from = '"SendIt.io" <ecomje@gmail.com>';
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      return info.response;
    });
  }
}

export default EmailSenderController;
