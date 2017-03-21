import User from '../models/user';

export default {
  receive: (message, next) => {
    // create a new user object
    const user = new User(message.user.id);

    // assign a new user object to the message
    Object.assign(message, { ctx: { user } });

    // move on to the next middleware
    next();
  },
};
