import bot from '../controllers/bot';
import verifyUserProfile from './profile';
import handleSponsoredDialog from '../util/handle-sponsored-dialog';

bot.dialog('/get-balance', [
  verifyUserProfile,
  function (session) {
    session.send('Your current balance is $%s!', session.message.ctx.user.balance);
    session.message.utu.intent('get-balance').then(handleSponsoredDialog(session)).catch(e => console.log(e));
  },
]).triggerAction({ matches: /(get|see|view|show).*balance/i });
