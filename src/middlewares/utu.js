import { uTu, constants } from 'utu';

const { UTU_SECRET } = process.env;

const platformMatrix = {
  sms: constants.SMS,
  facebook: constants.MESSENGER,
  kik: constants.kik,
};

const mapPlatformToUTUNames = platform => platformMatrix[platform] || platformMatrix.kik;

// create our utu client
export const utu = new uTu(UTU_SECRET);

export default {
  receive: (session, next) => {
    const ctx = utu.withContext(
      {
        platform: mapPlatformToUTUNames(session.address.channelId),
        platformId: session.user.id,
      },
    );

    ctx.message({
      values: {
        message: session.text,
        rawMessage: session.sourceEvent || session,
        botMessage: false,
      },
    }).catch(e => console.log('UTU MSG Receive ERROR:', e));

    Object.assign(session, { utu: ctx });

    next();
  },
  send: (session, next) => {
    utu.message({
      platform: mapPlatformToUTUNames(session.address.channelId),
      platformId: session.address.id,
      values: {
        message: session.text || '',
        rawMessage: session,
        botMessage: true,
      },
    }).catch(e => console.log(e));
    next();
  },
};

export const send = (bot, message) => {
  utu.message({
    platform: constants.MESSENGER,
    platformId: message.channel,
    sessionId: message.channel,
    values: {
      message: message.text || '',
      rawMessage: {
        text: message.text,
      },
      botMessage: true,
    },
  }).catch(e => console.log(e));
};
