import builder from 'botbuilder';
import bot from '../controllers/bot';
import verifyUserProfile from './profile';

bot.dialog('/set-balance', [
  verifyUserProfile,
  function (session) {
    session.message.utu.event('Set Balance');
    builder.Prompts.number(session, 'What is your new balance?');
  },
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setBalance(results.response);
    }
    session.send('Your current balance is $%s!', session.message.ctx.user.balance);
    session.endDialog();
  },
])
.triggerAction({ matches: /(set).*balance/i })
.cancelAction('cancelItemAction', 'Okay, don\'t be afraid to ask again!', { matches: /(cancel|stop|nvm|quit)/i });
