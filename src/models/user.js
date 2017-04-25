import { users } from '../collections';
import { utu } from '../middlewares/utu';

export default class User {
  constructor(platformId) {
    this.platformId = platformId;
    this.fetchUser();
  }

  async fetchUser() {
    try {
      const user = await users.findOne({ _id: this.platformId }) || {};
      this.balance = user.balance || 0.00;
      this.firstName = user.firstName || '';
      this.lastName = user.lastName || '';
      this.email = user.email || '';
      this.setup = !!user.setup;
    } catch (e) {
      console.log(e);
    }
  }

  async update($set) {
    const saved = await users.update({ _id: this.platformId }, { $set }, { upsert: true });
    return saved;
  }

  setBalance(balance) {
    this.balance = parseFloat(balance);
    return this.update({ balance });
  }

  setFirstName(firstName) {
    this.firstName = firstName;
    return this.update({ firstName });
  }

  setLastName(lastName) {
    this.lastName = lastName;
    return this.update({ lastName });
  }

  setEmail(email) {
    this.email = email;
    return this.update({ email });
  }

  setSetup() {
    this.setup = true;
    return this.update({ setup: this.setup });
  }

  saveUTU() {
    utu.user({
      platform: 'messenger',
      platformId: this.platformId,
      values: {
        firstName: this.firstName,
        lastName: this.lastName,
        balance: this.balance,
        email: this.email,
      },
    }).catch(e => console.log(e));
  }

  isSetup() {
    return this.setup;
  }
}
