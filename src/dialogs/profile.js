import builder from 'botbuilder';
import bot from '../controllers/bot';
import { getEmail } from '../util/regex';
import handleSponsoredDialog from '../util/handle-sponsored-dialog';

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
  // updates users information
  function (session) {
    session.message.utu.event('Update Profile Name');
    builder.Prompts.text(session, 'Okay great! let\'s update your name. What is your first name?');
  },
  // set the users firstName and asks for the last name
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setFirstName(results.response);
    }

    builder.Prompts.text(session, 'What is your last name?');
  },

  // set the lastName and updates the utu profile, but just the first and last name
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setLastName(results.response);
    }
    const { firstName, lastName } = session.message.ctx.user;

    session.message.utu.user({ values: { firstName, lastName } });

    session.send(`Alright, you should be good to go! I'll now call you ${firstName} ${lastName}`);
    session.endDialog();
  },
]).triggerAction({ matches: /(change|set|update).*name/i });

bot.dialog('/profile', [
  // starts the dialog letting the user know we need to collect some information
  function (session, args, next) {
    session.message.utu.event('Setup Profile');
    if (!session.message.ctx.user.email) {
      builder.Prompts.text(session, 'Hi, I just need to collect a few pieces of information from you since this is our first time talking! What is your email?');
      session.message.utu.intent('initial-setup').then(handleSponsoredDialog(session)).catch(e => console.log(e));
    } else {
      next();
    }
  },

  // checks for existing identities and will merge them
  // update utu and end the dialog, if we don't have an identity
  // then the user is new and we need to continue with the dialog
  async function (session, results, next) {
    if (results.response) {
      const emails = getEmail(results.response);
      const email = emails[0] && emails[0].toLowerCase();

      // if we didn't find an email do nothing so the bot will ask again
      if (!email) {
        return;
      }

      const restored = await session.message.ctx.user.restoreUserFromEmail(email);

      if (restored) {
        // let the user know we have identitied them from another platform
        session.send(`Oh, hi ${session.message.ctx.user.firstName}, Its good to see you again. I've synced your accounts now`);

        session.message.utu.intent('cross-channel-identified').then(handleSponsoredDialog(session)).catch(e => console.log(e));

        // update the users information in utu
        session.message.ctx.user.saveUTU();

        // end the dialog because we don't need to collect any other information from the user
        session.endDialog();
      } else {
        // set the users email
        session.message.ctx.user.setEmail(email);
      }
    }

    if (!session.message.ctx.user.firstName) {
      builder.Prompts.text(session, 'What is your first name?');
    } else {
      next();
    }
  },

  // sets the first name and asks for a last name
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

  // sets the last name and asks for a balance
  function (session, results, next) {
    if (results.response) {
      session.message.ctx.user.setLastName(results.response);
    }

    if (!session.message.ctx.user.balance) {
      builder.Prompts.number(session, 'What is your starting balance?');
    } else {
      next();
    }
  },

  // end of dialog this should finish the account setup
  // and update the utu profile
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setBalance(results.response);
      session.message.ctx.user.setSetup();
    }

    // update the users information in utu
    session.message.ctx.user.saveUTU();
    session.message.utu.event('Profile Setup');
    session.endDialog();
  },
]);

export default verifyUserProfile;
