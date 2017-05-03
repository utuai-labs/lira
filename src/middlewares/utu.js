import { uTu, constants } from 'utu';

const { UTU_SECRET } = process.env;

const platformMatrix = {
  sms: constants.SMS,
  facebook: constants.MESSENGER,
  kik: constants.KIK,
  slack: constants.SLACK,
};

export const mapPlatformToUTUNames = platform => platformMatrix[platform] || platformMatrix.kik;

// create our utu client
export const utu = new uTu(UTU_SECRET);

export default {
  receive: (session, next) => {
    // console.log('RECIEVE: ', JSON.stringify(session, null, 2));
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
    // console.log('SEND: ', JSON.stringify(session, null, 2));
    utu.message({
      platform: mapPlatformToUTUNames(session.address.channelId),
      platformId: session.address.user.id,
      values: {
        message: session.text || '',
        rawMessage: session.sourceEvent || session,
        botMessage: true,
      },
    }).catch(e => console.log('UTU MSG Send ERROR:', e));
    next();
  },
};
