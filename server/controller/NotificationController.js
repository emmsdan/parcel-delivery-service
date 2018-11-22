import EmailSenderController from './EmailSenderController';
import DatabaseManager from '../db_manager/DatabaseManager';
/**
 * NotificationController: Handles notifications
 * @author EmmsDan <ecomje@gmail.com>
 */
class NotificationController {
  /**
   * create SMTP account for sending the Main
   */
  constructor() {
    this.get = false;
  }

  /**
   *
   * @param {string} message
   * @param {object} userInfo
   */
  static addNotification(message, userInfo) {
    const mailOption = {
      to: userInfo.to,
      subject: userInfo.subject,
      text: message, // plain text body
      html: `<h6>${message}</h6>` // html body
    };
    DatabaseManager.newNotification({ userId: userInfo.userId, notify: message });
    EmailSenderController.sendMail(mailOption);
  }
}

export default NotificationController;
