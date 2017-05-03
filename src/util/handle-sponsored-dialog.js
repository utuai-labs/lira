import builder from 'botbuilder';

export default session => (result) => {
  if (!result.data) {
    return;
  }
  switch (session.message.address.channelId) {
    case 'sms': {
      const card = new builder.HeroCard(session);

      // if there is a text body add it
      if (result.data.content.Body && result.data.content.Body.length > 0) {
        card.text(result.data.content.Body);
      }

      // if there are images attach them
      if (result.data.content.MediaUrl && result.data.content.MediaUrl.length > 0) {
        card.images(
          result.data.content.MediaUrl.map(image => (
            builder.CardImage.create(session, image)
          ),
        ));
      }

      session.send(new builder.Message(session).addAttachment(card));
      break;
    }
    case 'facebook':
      session.send(
        new builder.Message(session).sourceEvent({
          facebook: {
            notification_type: 'REGULAR',
            ...result.data.content.message,
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
