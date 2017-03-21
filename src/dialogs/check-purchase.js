import builder from 'botbuilder';
import bot from '../controllers/bot';
import verifyUserProfile from './profile';

bot.dialog('/check-purchase', [
  verifyUserProfile,
  function (session) {
    session.message.utu.event('Check Purchase');
    builder.Prompts.number(session, 'How much does it cost?');
  },
  function (session, results) {
    if (results.response) {
      const b = session.message.ctx.user.balance;
      const r = b - results.response;
      if (r >= 0) {
        session.dialogData.remainingBalance = r;
        builder.Prompts.confirm(session, `Yes you can! and you'd still have $${r} left! Would you like me to update your balance?`);
        session.message.utu.event('Can Purchase');
        session.message.utu.intent('check-purchase-can-purchase')
          .then(e => console.log(e))
          .catch(e => console.log(e));
      } else {
        session.message.utu.event('Cannot Purchase');
        session.send(`No, sorry you are about $${Math.abs(r)} short of being able to make that purchase.`);
        session.endDialog();
      }
    }
  },
  function (session, results) {
    if (results.response) {
      session.message.ctx.user.setBalance(session.dialogData.remainingBalance);
    }
    session.send(`Will do! Your new account balance is $${session.message.ctx.user.balance}`);
    session.endDialog();
  },
])
.triggerAction({ matches: /(can i)/i })
.cancelAction('cancelItemAction', 'Okay, don\'t be afraid to ask again!', { matches: /(cancel|stop|nvm|quit)/i });
