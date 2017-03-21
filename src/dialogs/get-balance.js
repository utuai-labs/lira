import bot from '../controllers/bot';
import verifyUserProfile from './profile';

bot.dialog('/get-balance', [
  verifyUserProfile,
  function (session) {
    session.message.utu.event('Get Balance');
    session.send('Your current balance is $%s!', session.message.ctx.user.balance);
  },
]).triggerAction({ matches: /(get|see|view|show).*balance/i });
