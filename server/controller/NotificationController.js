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
  static setNotification(message, userInfo) {
    const mailOption = {
      to: userInfo.to,
      subject: userInfo.subject,
      text: message, // plain text body
      html: `<h6>${message}</h6>` // html body
    };
    DatabaseManager.setNotification({ userId: userInfo.userId, notify: message });
    EmailSenderController.sendMail(mailOption);
  }

  /**
   *
   * @param {string} userId
   * @returns {array}
   */
  static getNotification(userId) {
    return DatabaseManager.getNotification(userId);
  }
}

export default NotificationController;
