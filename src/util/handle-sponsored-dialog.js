import builder from 'botbuilder';

export default session => (result) => {
  if (!result.data) {
    return;
  }
  console.log(JSON.stringify(result, null, 2));
  switch (session.message.address.channelId) {
    case 'sms':
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
      // session.send(
      //   new builder.Message(session).sourceEvent({
      //     sms: {
      //       To: session.message.address.user.id,
      //       From: session.message.address.bot.id,
      //       Body: `Please Check out our sponsored content ${result.data.content.link}`,
      //       MediaURL: result.data.content.image,
      //     },
      //   }),
      // );
      break;
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
  }
};
