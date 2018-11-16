import {inArray, removeArray, generateID} from '../helpers/helper';
import ParcelOrder from './parcel'
class UserDB extends ParcelOrder{
  constructor (parcel, users) {
    super(parcel)
    this.parcels = parcel;
    this.usersDatabase = users;
  }
  getAllUsers () {
    if (this.usersDatabase.length === 0) {
      return {'message' : 'no user available in database'};
    }
  return (this.usersDatabase);
  }

  getSingleUser (id) {
    return inArray(this.usersDatabase, 'userid', id);
  }

  getUserParcels (userid) {
    const parcel = this.parcels.filter( parcels => parcels.userid == userid);
    if(parcel){
      return parcel;
    }else{
      return {'message': 'no parcel for this user'};
    }
  }

  createUser (user) {
    let userid = generateID(999);
    if (this.userExist(userid)){
      userid = (this.usersDatabase - 1) + (userid * 2);
    }

    this.usersDatabase.push ({
      userid: userid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password
    });
    this.setStatus (201);
    return {'message' : 'new user added'}
  }
  userExist (id) {
    try {
      if(this.usersDatabase.find( users => users.userid == id).length > 0 ){
        return true;
      }
      return false;
    }catch(err){
      return false;
    }
  }
}

const userDb = new UserDB([], []);
export default userDb;