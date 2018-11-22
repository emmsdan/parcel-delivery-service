import validator from 'validator';
import moment from 'moment';
import bcrypt from 'bcrypt';

import { inArray, generateID, isEmpty } from '../helpers/helper';
import ResponseController from './ResponseController';
import DatabaseManager from '../db_manager/DatabaseManager';
import NotificationController from './NotificationController';

const validateRegister = Symbol('validateRegister');
const validateLogin = Symbol('validateLogin');
/**
 * UserController extends ResponseController
 * use to manage users account and parcels
 */
class UserController extends ResponseController {
  /**
   *  constructor
   * @param {array} parcel
   * @param {array} users
   */
  constructor(parcel, users) {
    super(parcel);
    this.parcels = parcel;
    this.usersDatabase = users;
  }

  /**
   *
   * @returns {object/array}
   */
  getAllUsers() {
    if (this.usersDatabase.length === 0) {
      return { message: 'no user available in database' };
    }
    return (this.usersDatabase);
  }

  /**
   *  get a Specific user info
   * @param {number} id
   * @returns {array}
   */
  getSingleUser(id) {
    return inArray(this.usersDatabase, 'userid', id);
  }

  /**
   *
   * @param {object} user
   * @returns {boolean}
   */
  loginUser(user) {
    if (isEmpty(user)) {
      this.setResponse('You need to supply necessary Credentials');
      this.setStatus(200);
      return false;
    }

    if (!this[validateLogin](user)) {
      return false;
    }

    return DatabaseManager.query('SELECT * FROM USERS WHERE email=$1 LIMIT 1', [user.email])
      .then((response) => {
        if (response.rowCount > 0) {
          if (bcrypt.compareSync(user.pass, response.rows[0].password)) {
            this.setResponse({ success: 'Login successful' });
            this.setStatus(200);
            return true;
          }
          this.setResponse('Password is not valid');
          this.setStatus(200);
        } else {
          this.setResponse('Email Does not Exist In Our Database');
          this.setStatus(200);
        }
        return true;
      })
      .catch((error) => {
        this.setResponse(error.detail);
        this.setStatus(200);
        return true;
      });
  }

  /**
   *  Create Users Account
   * @param {object} user
   * @returns {object}
   */
  registerUser(user) {
    if (isEmpty(user)) {
      this.setResponse('You need to supply necessary Credentials');
      this.setStatus(200);
      return false;
    }
    if (!this[validateRegister](user)) {
      return false;
    }
    const userID = (user.email.split('@')[0] + (generateID(2).toString()));
    const password = bcrypt.hashSync(user.pass, process.env.BCRYPTSALT);

    DatabaseManager.query('INSERT INTO USERS (userid, fullname, email, sex, password, registered, isadmin) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
      userID,
      user.name,
      user.email,
      'unspecified',
      password,
      moment(),
      'user'
    ])
      .then((response) => {
        if (response.rowCount > 0) {
          this.setResponse({ success: 'Account created Successfully' });
          this.setStatus(200);
          /*
          NotificationController.setNotification(`Hi, ${user.name} \r\n
           Welcome to SendIt. We are Glad to have you here.`, {
            userId: userID,
            subject: 'New Account Created with SendIt.',
            to: user.email
          });
          */
        } else {
          this.setResponse('could not create an account, server error');
          this.setStatus(200);
        }
        return true;
      })
      .catch((error) => {
        if (error.detail.endsWith('already exists.')) {
          this.setResponse(`${error.constraint.split('_')[1]} ${(error.detail.split('=')[1])}`);
          this.setStatus(200);
        }
        return true;
      });

    this.setStatus(201);
    return { message: 'new user added' };
  }

  /**
   *  Checks if Specific user exist
   * @param {number} id : parcel id
   * @returns {boolean}
   */
  userExist(id) {
    try {
      if (this.usersDatabase.find(users => users.userid === id).length > 0) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  /**
   * validate Login inputs
   * @param {string} input
   * @returns {boolean}
   */
  [validateLogin](input) {
    if (!validator.isEmail(input.email || ')*#23*#&')) {
      this.setResponse('Please Check Email, (Invalid Credentials)');
      this.setStatus(200);
      return false;
    }
    if (input.pass === undefined) {
      this.setResponse('Please Check Password, (Invalid Credentials)');
      this.setStatus(200);
      return false;
    }
    if ((input.pass.length < 6)) {
      this.setResponse('Please Check Password, (At least 6 char.)');
      this.setStatus(200);
      return false;
    }
    return true;
  }

  /**
   * validate Registration inputs
   * @param {string} input
   * @returns {boolean}
   */
  [validateRegister](input) {
    if (!validator.isAlpha(input.name || '23*#&')) {
      const name = input.name.split(' ');
      const nameF = name.filter((n) => {
        if (!validator.isAlpha(n)) {
          return 0;
        }
        return n;
      });
      if (nameF.length < name.length) {
        this.setResponse('Please Check Name, (Invalid Credentials)');
        this.setStatus(200);
        return false;
      }
    }
    if (!validator.isEmail(input.email || ')*#23*#&')) {
      this.setResponse('Please Check Email, (Invalid Credentials)');
      this.setStatus(200);
      return false;
    }
    if (!validator.isMobilePhone(input.phone || ')*#23*#&')) {
      this.setResponse('Please Check Phone, (Invalid Credentials)');
      this.setStatus(200);
      return false;
    }
    if ((input.pass.length < 6)) {
      this.setResponse('Please Check Password, (At least 6 char.)');
      this.setStatus(200);
      return false;
    }
    return true;
  }
}

const userDb = new UserController([], []);
export default userDb;
