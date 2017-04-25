import bot from '../controllers/bot';
import verifyUserProfile from './profile';

bot.dialog('/get-balance', [
  verifyUserProfile,
  function (session) {
    session.message.utu.event('Get Balance');
    session.send('Your current balance is $%s!', session.message.ctx.user.balance);
    session.message.utu.intent('get-balance').catch(e => console.log(e));
  },
]).triggerAction({ matches: /(get|see|view|show).*balance/i });
