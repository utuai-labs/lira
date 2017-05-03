import builder from 'botbuilder';
import bot from '../controllers/bot';
import verifyUserProfile from './profile';
import handleSponsoredDialog from '../util/handle-sponsored-dialog';

bot.dialog('/set-balance', [
  verifyUserProfile,
  function (session) {
    builder.Prompts.number(session, 'What is your new balance?');
  },
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setBalance(results.response);
    }
    session.send('Your current balance is $%s!', session.message.ctx.user.balance);
    session.message.utu.intent('get-balance').then(handleSponsoredDialog(session)).catch(e => console.log(e));
    session.endDialog();
  },
])
.triggerAction({ matches: /(set).*balance/i })
.cancelAction('cancelItemAction', 'Okay, don\'t be afraid to ask again!', { matches: /(cancel|stop|nvm|quit)/i });
