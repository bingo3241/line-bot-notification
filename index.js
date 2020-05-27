const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World')
})
// register a webhook handler with middleware
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  if (event.message.text.toLowerCase().includes('scg')) {
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'The Siam Cement Group Public Company Limited is the largest and oldest cement and building material company in Thailand and Southeast Asia.'
    });
  }
  
    client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'The bot cannot answer that question. We have already notified the admin. Sorry for the inconvenience'
    })
    return client.pushMessage(process.env.ADMIN_USERID, {
    type: 'text',
    text: 'ALERT: A customer has asked questions that I cannot answer.',
    })
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});