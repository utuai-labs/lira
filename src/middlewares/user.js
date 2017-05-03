import User from '../models/user';
import { mapPlatformToUTUNames } from './utu';

export default {
  receive: (session, next) => {
    // create a new user object
    const user = new User(mapPlatformToUTUNames(session.address.channelId), session.user.id);

    user.fetchUser().then(() => {
      // assign a new user object to the message
      Object.assign(session, { ctx: { user } });
      // move on to the next middleware
      next();
    });
  },
};
