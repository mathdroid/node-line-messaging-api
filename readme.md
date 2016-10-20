# node-line-messaging-api

> Unofficial SDK for Line's Messaging API

```sh
npm install --save node-line-messaging-api

```

# Usage

```js
import Bot from 'node-line-messaging-api'

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

```

There are some other events from `examples/` (WIP).

## Events

WIP:

```js
const _eventTypes = ['message', 'follow', 'unfollow', 'join', 'leave', 'postback', 'beacon']

const _messageTypes = ['text', 'image', 'video', 'audio', 'location', 'sticker']
```


## Webhook

By default, webhook will listen on port `5463`. You should change it if it interferes with something.

## Messages

WIP docs.

# API

## LineBot


- `LineBot`

  - `new LineBot(secret, token, options)`

  - `.reply(replyToken, messages)` => Promise (WIP)

  - `.push(channel, messages)` => Promise (WIP)

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

MIT &copy; Muhammad Mustadi 2016
