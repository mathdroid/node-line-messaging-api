# node-line-messaging-api

> Unofficial SDK for Line's Messaging API

```sh
npm install --save node-line-messaging-api

```

# Usage

```js
import Bot, { Messages } from 'node-line-messaging-api'

const SECRET = 'YOURSECRETHERE' // Line@ APP SECRET

const TOKEN = 'YOURTOKENHERE' // Line@ issued TOKEN

const PORT = process.env.PORT || 3002

let bot = new Bot(SECRET, TOKEN, {port: PORT})

// bot webhook succesfully started
bot.on('webhook', w => console.log(`bot listens on port ${w}.`))

// on ANY events
bot.on('events', e => console.dir(e))

// on Message event
bot.on('message', m => console.log(`incoming message: ${m}`))

let msgs = new Messages()
msgs.addText('HELLO WORLD!').addText({text: 'harambe4lyf'})
bot.push('CHANNELXXXXXXXX', msgs.commit())

```

There are some other events from `examples/` (WIP).

## Events

Listen-able events (WIP):

```js
const _events = 'events' // all events, returns an array of events.

const _eventTypes = ['message', 'follow', 'unfollow', 'join', 'leave', 'postback', 'beacon'] // event types, returns that specific event.

const _messageTypes = ['text', 'image', 'video', 'audio', 'location', 'sticker'] // message types (more specific), returns that specific event (type === 'message').
```


## Webhook

By default, webhook will listen on port `5463`. You should change it if it interferes with something.

## Messages



# API

## LineBot


- `LineBot`

  - `new LineBot(secret, token, options)`

  - `.reply(replyToken, messages)` => Promise

  - `.push(channel, messages)` => Promise

  - `.getContent(messageId)` => Promise

  - `.getProfile(userId)` => Promise

  - `.leave({groupId, roomId})` => Promise //pick one between groupId or roomId

- `Messages`

  - `new Messages()` // creates an empty array of messages. Maximum 5 messages following LINE's spec.

  - `.addText(message)` // message may be a string or an object with .text property. Chainable.

  - `.addImage, .addVideo, etc` (WIP)

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

6. Go to whitelist, add your IP Address.

7. Create your bot, input your `APP_SECRET` and `TOKEN`.

8. Deploy to your cloud host, and wait for events to come in!

# Contributing

**PRs welcome**. Open Issues first. ;)


# License

MIT &copy; 2016 Muhammad Mustadi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.RESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
