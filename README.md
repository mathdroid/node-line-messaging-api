# node-line-messaging-api

> Unofficial SDK for Line's Messaging API

```sh
npm install --save node-line-messaging-api
```

# Usage

Example live bot ([`proofreader-dog`](https://github.com/mathdroid/proofreader-dog))

```js
const LineBot = require('node-line-messaging-api')
const {secret, token} = require('../config')
const {lint} = require('./api')

const Messages = LineBot.Messages
const PORT = process.env.PORT || 5050

const dog = new LineBot({
    secret,
    token,
    options: {
        port: PORT,
        tunnel: false,
        verifySignature: true,
        endpoint: '/'
    }
})

dog.on('webhook', ({port, endpoint}) => {
    console.log(`dog is online on http://localhost:${port}${endpoint}`)
})

dog.on('tunnel', ({url}) => {
    console.log(`tunnel to local machine created at ${url}`)
})

dog.on('text', async event => {
    try {
        const {displayName} = await dog.getProfileFromEvent(event)
        const {replyToken, message: {text}} = event
        const {suggestions, typos} = await lint(text)
        const replyText = `Woof! Hi ${displayName}!\n\nI've read your message:\n\n${text}`
        const replyBalloon = new Messages().addText(replyText)
        const reasons = suggestions.length && suggestions.map(({reason}) => reason).join('\n\n')
        if (reasons) replyBalloon.addSticker({packageId: 1, stickerId: 15}).addText(`My dog-sense 🐕 has some suggestions:\n\n${reasons}`)
        const words = typos.length && typos.map(({word, suggestions}) => `Error on word "${word}". Did you mean ${suggestions.join('/')}?`).join('\n\n')
        if (words) replyBalloon.addSticker({packageId: 1, stickerId: 10}).addText(`🤔🔥 A bit of typographical errors:\n\n${words}`)
        if (!reasons && !words) replyBalloon.addSticker({packageId: 1, stickerId: 14}).addText('Woof woof! I can\'t find any errors! 🐶 Nice job!')
        dog.replyMessage(replyToken, replyBalloon.commit())
    } catch ({message}) {
        console.log(message)
    }
})

```

## Events

Listen-able events:

### `webhook`

Emitted when webhook listener is created successfully. Emits `{port, endpoint}`.

### `tunnel`

Emitted when local tunnel is created successfully for development. Emits `{url}`.

### `events`
Emitted on all events, returns an array of `event`s.


### `event`
Emitted on all events, returns an array of `event`s.

### `message`, `follow`, `unfollow`, `join`, `leave`, `postback`, `beacon`

Emitted on parsing event types, returns that specific event.

### `text`, `image`, `video`, `audio`, `location`, `sticker`, `non-text`, `message-with-content`

Emitted on parsing message types (more specific), returns that specific event. Can be made more specific according to source type. For example, `Bot.on('image:user', fn)` will run `fn` only if it receives an `image` message type from `user` source type (won't work in `group`s/`room`s).


## Webhook

By default, webhook will listen on port `5463`. You should change it if it interferes with something.

## Messages

`Messages` class is a helper in composing your messages.

# API

## LineBot


- `LineBot`

  - `new LineBot({secret, token, options})`

  - `.on(event, function callback (eventContent) {})` // Standard event listener. Events are shown above.

  - `.onText(regexp, function callback (event, match) {})` // Executes callback everytime a message.text matches regexp

  - `.multicast(channels, messages)` => Promise

  - `.replyMessage(replyToken, messages)` => Promise

  - `.pushMessage(channel, messages)` => Promise

  - `.getContent(messageId)` => Promise

  - `.getProfile(userId)` => Promise

  - `.getContentFromEvent(event)` => Promise

  - `.getProfileFromEvent(event)` => Promise

  - `.leaveChannel({groupId, roomId})` => Promise //pick one between groupId or roomId

- `Messages`

  - `new Messages()` // creates an empty array of messages. Maximum 5 messages following LINE's spec.

  - `.addRaw(message)` // message Object following LINE's spec

  - `.addText(message)` // message may be a string or an object with .text property. Chainable.

  - `.addImage({originalUrl, previewUrl})` // `originalUrl` and `previewUrl` must be a HTTPS link to a JPG or PNG image. (size < 1MB, width < 1024px)

  - `.addAudio({originalUrl, duration})` // `originalUrl` must be a HTTPS link to m4a audio. `duration` is in milliseconds.

  - `.addVideo({originalUrl, previewUrl})` // same as `.addImage` but mp4 < 10MB for the originalUrl.

  - `.addLocation({title = 'My Location', address = 'Here\'s the location.', latitude, longitude})` // lat and lon is of `number` type

  - `.addSticker({packageId, stickerId})` // both params are of number type. see https://devdocs.line.me/files/sticker_list.pdf

  - `.addButtons({thumbnailImageUrl, altText, title, text, actions})` // Buttons template message. `actions` must follow Action template. length of `actions` <=4

  - `.addConfirm({altText, text, actions})` // confirmation type. actions max length = 2

  - `.addVideo, etc` (WIP)

  - `.commit()` // returns the payload (array of messages)

# Installation

```
npm install --save node-line-messaging-api
```

or

```
yarn add node-line-messaging-api
```

# Deployment

1. Prepare your cloud host, note IP Address.

2. Provide HTTPS support for the webhook endpoint.

3. Register for an account in business.line.me, choose Messaging API and then dev-trial.

4. Open developers.line.me for your account, note the `APP_SECRET`.

5. Issue a `TOKEN` and note it.

6. Go to server whitelist, add your IP Address.

7. Create your bot, input your `APP_SECRET` and `TOKEN`.

8. Deploy to your cloud host, and wait for events to come in!

# Contributing

**PRs welcome**. Open Issues first. ;)


# License

The MIT License (MIT)

Copyright &copy; 2016 [Muhammad Mustadi](https://mustadi.xyz)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
