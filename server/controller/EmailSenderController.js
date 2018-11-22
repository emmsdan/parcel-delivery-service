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
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'account.user', // generated ethereal user
        pass: 'account.pass' // generated ethereal password
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
