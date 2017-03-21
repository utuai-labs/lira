import builder from 'botbuilder';
import connector from './connector';
import utuMiddleware from '../middlewares/utu';
import userMiddleware from '../middlewares/user';

const bot = new builder.UniversalBot(connector);

bot.use(utuMiddleware);
bot.use(userMiddleware);

export default bot;
