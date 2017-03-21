import builder from 'botbuilder';
import bot from '../controllers/bot';

/**
 * A waterfall dialog function that will verify if a users profile
 * is setup or not. if it is not then it will trigger the `/profile`
 * dialog to kick in before continuing on the original dialog
 * @param  {Object}   session botbuilder session
 * @param  {Object}   args    context passed into the dialog
 * @param  {Function} next    middleware like next function to continue to the next waterfall
 */
const verifyUserProfile = (session, args, next) => {
  if (!session.message.ctx.user.isSetup()) {
    session.beginDialog('/profile');
  } else {
    next();
  }
};

bot.dialog('/', [
  verifyUserProfile,
  function (session) {
    session.send(
      `
        Hello, ${session.message.ctx.user.firstName},
        There a few commands that you can ask me:
        - can i buy (something)
        - get balance
        - set balance
        - update name
      `,
    );
  },
]);

bot.dialog('/profile/name', [
  function (session) {
    session.message.utu.event('Update Profile Name');
    builder.Prompts.text(session, 'Okay great! let\'s update your name. What is your first name?');
  },
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setFirstName(results.response);
    }

    builder.Prompts.text(session, 'What is your last name?');
  },
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setLastName(results.response);
    }
    session.endDialog();
  },
]).triggerAction({ matches: /(change|set|update).*name/i });

bot.dialog('/profile', [
  function (session, args, next) {
    session.message.utu.event('Setup Profile');
    if (!session.message.ctx.user.firstName) {
      builder.Prompts.text(session, 'Hi, I just need to collect a few pieces of information from you since this is our first time talking! What is your first name?');
    } else {
      next();
    }
  },
  function (session, results, next) {
    if (results.response) {
      session.message.ctx.user.setFirstName(results.response);
    }

    if (!session.message.ctx.user.lastName) {
      builder.Prompts.text(session, 'What is your last name?');
    } else {
      next();
    }
  },
  function (session, results, next) {
    if (results.response) {
      session.message.ctx.user.setLastName(results.response);
    }

    if (!session.message.ctx.user.email) {
      builder.Prompts.text(session, 'What is your email?');
    } else {
      next();
    }
  },
  function (session, results, next) {
    if (results.response) {
      session.message.ctx.user.setEmail(results.response);
    }

    if (!session.message.ctx.user.balance) {
      builder.Prompts.number(session, 'What is your starting balance?');
    } else {
      next();
    }
  },
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setBalance(results.response);
      session.message.ctx.user.setSetup();
    }

    // update the users information in utu
    session.message.utu.user({ values: session.message.ctx.user });
    session.message.utu.event('Profile Setup');
    session.endDialog();
  },
]);

export default verifyUserProfile;
