import { inArray, generateID } from '../helpers/helper';
import ParcelOrderController from './ParcelOrderController';

/**
 * UserController extends ParcelOrderController
 * use to manage users account and parcels
 */
class UserController extends ParcelOrderController {
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
   *  Create Users Account
   * @param {object} user
   * @returns {object}
   */
  createUser(user) {
    let userid = generateID(999);
    if (this.userExist(userid)) {
      userid = (this.usersDatabase - 1) + (userid * 2);
    }

    this.usersDatabase.push({
      userid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password
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
}

const userDb = new UserController([], []);
export default userDb;
