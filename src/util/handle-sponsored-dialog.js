import builder from 'botbuilder';

export default session => (result) => {
  if (!result.data) {
    return;
  }
  switch (session.message.address.channelId) {
    case 'sms': {
      const card = new builder.HeroCard(session)
        .text('Please checkout our sponsored content!')
        .images(
          result.data.content.MediaUrl.map(image => (
            builder.CardImage.create(session, image)
        )))
        .buttons([
          builder.CardAction.openUrl(session, result.data.content.Body, 'Check it out!'),
        ]);
      session.send(new builder.Message(session).addAttachment(card));
      break;
    }
    case 'facebook':
      session.send(
        new builder.Message(session).sourceEvent({
          facebook: {
            notification_type: 'REGULAR',
            attachment: result.data.content.message.attachment,
          },
        }),
      );
      break;
    case 'slack':
      session.send(
        new builder.Message(session).sourceEvent({
          slack: result.data.content,
        }),
      );
      break;
    default:
  }
};
