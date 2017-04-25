import bot from '../controllers/bot';
import verifyUserProfile from './profile';
import handleSponsoredDialog from '../util/handle-sponsored-dialog';

bot.dialog('/hello', [
  verifyUserProfile,
  function (session) {
    session.beginDialog('/');
    session.message.utu.intent('help').then(handleSponsoredDialog(session)).catch(e => console.log(e));
  },
]).triggerAction({ matches: /(hello|help)/i });
