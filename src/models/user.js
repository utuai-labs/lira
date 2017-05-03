import { find } from 'lodash';
import { users } from '../collections';
import { utu } from '../middlewares/utu';

export default class User {
  constructor(platform, platformId) {
    this.platformId = platformId;
    this.platform = platform;
    this.identity = [this.getActiveIdentity()];
  }

  /**
   * Gets a users identity key pair
   * @return {Object} identity key pair
   */
  getActiveIdentity() {
    return { platform: this.platform, platformId: this.platformId };
  }

  /**
   * Fetches a user from the database and loads the users information
   */
  async fetchUser() {
    try {
      const identity = this.getActiveIdentity();
      const user = await users.findOne({ identity }) || {};
      const isNew = !user.identity;
      this._id = user._id;
      this.identity = user.identity || [identity];
      this.balance = user.balance || 0.00;
      this.firstName = user.firstName || '';
      this.lastName = user.lastName || '';
      this.email = user.email || '';
      this.setup = !!user.setup;

      // if we have a new user save them to the db
      if (isNew) {
        await this.saveUserRecord();
      }

      return user;
    } catch (e) {
      console.log(e);
    }

    return false;
  }

  /**
   * Saves a users complete record to the database
   * @return {Promise}
   */
  async saveUserRecord(query) {
    const identity = this.getActiveIdentity();
    try {
      return users.update(query || { identity }, {
        $set: {
          identity: this.identity,
          firstName: this.firstName,
          lastName: this.lastName,
          balance: this.balance,
          email: this.email,
          setup: this.setup,
        },
      }, { upsert: true });
    } catch (e) {
      console.log('save user record error: ', e);
      return false;
    }
  }

  /**
   * Merges to records into one by identifying a user from
   * another platform using their email
   * @param  {String}  email the users email
   * @return {Promise}
   */
  async restoreUserFromEmail(email) {
    try {
      const identity = this.getActiveIdentity();
      const user = await users.findOne({ email, identity: { $ne: identity } });
      if (user) {
        // remove the old records so we can create a new one
        users.remove({ _id: user._id });
        users.remove({ _id: this._id });

        // check if the current user already had an identity record for this platform
        const currentExist = !!find(user ? user.identity : [], identity);

        // merge identities the user found doesn't already have this current
        // active identity record
        this.identity = currentExist ? user.identity : [...(user.identity || []), identity];
        this.balance = user.balance;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.setup = !!user.setup;

        // update the users record so that the next request we will have all identity
        // profiles saved for the user, normally we would only update the keys
        // that are updated, but in this case we want to ensure everything is updated
        await this.saveUserRecord({ email });

        return true;
      }

      // if we didn't find any matching records move on
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * Updates a users information
   * @param  {Object}  $set values to be set
   * @return {Promise}
   */
  async update($set) {
    const identity = this.getActiveIdentity();
    try {
      await users.update({ identity }, { $set }, { upsert: true });
    } catch (e) {
      console.log('save error: ', e);
    }
  }

  /**
   * Updates a users balance
   * @param {String} balance the new balance
   */
  setBalance(balance) {
    this.balance = parseFloat(balance);
    // update utu
    this.saveUTU({ balance: this.balance });
    return this.update({ balance });
  }

  /**
   * Sets a users firstname
   * @param {String} firstName the users firstName
   */
  setFirstName(firstName) {
    this.firstName = firstName;
    return this.update({ firstName });
  }

  /**
   * Sets a users lastName
   * @param {String} lastName the users lastName
   */
  setLastName(lastName) {
    this.lastName = lastName;
    return this.update({ lastName });
  }

  /**
   * Sets a users email
   * @param {String} email the users email
   */
  setEmail(email) {
    this.email = email;
    return this.update({ email });
  }

  /**
   * Sets the setup flag to true
   */
  setSetup() {
    this.setup = true;
    return this.update({ setup: this.setup });
  }

  /**
   * Pushes a users information to utu
   * @return {[type]} [description]
   */
  saveUTU(values) {
    utu.user({
      platform: this.platform,
      platformId: this.platformId,
      values: values || {
        firstName: this.firstName,
        lastName: this.lastName,
        balance: this.balance,
        email: this.email,
      },
    }).catch(e => console.log(e));
  }

  /**
   * Checks if a user is setup
   * @return {Boolean} is the users account complete or not
   */
  isSetup() {
    return this.setup;
  }
}
