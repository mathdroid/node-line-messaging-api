import EventEmitter from 'eventemitter3'
import axios from 'axios'

import Webhook from './webhook'

const _eventTypes = ['message', 'follow', 'unfollow', 'join', 'leave', 'postback', 'beacon']
const _messageTypes = ['text', 'image', 'video', 'audio', 'location', 'sticker']
const _sourceTypes = ['user', 'group', 'room']

const _baseUrl = 'https://api.line.me'
const _baseUrlContent = 'https://api-data.line.me'

export default class LineBot extends EventEmitter {
  static get eventTypes () {
    return _eventTypes
  }

  static get messageTypes () {
    return _messageTypes
  }

  static get sourceTypes () {
    return _sourceTypes
  }

  constructor ({secret, token, options = {}}) {
    super()
    if (!secret) throw new Error('Please supply a LINE Secret.')
    if (!token) throw new Error('Please supply a LINE Token.')
    this.secret = secret
    this.token = token
    this.options = options
    this._Webhook = new Webhook({
      secret,
      token,
      options,
      onEvents: this.processEvents.bind(this),
      onWebhook: (webhook) => {
        this.emit('webhook', webhook)
      },
      onTunnel: (args) => {
        this.emit('tunnel', args)
      }
    })
    this._regexpCallback = []
    this.getContentFromEvent = this.getContentFromEvent.bind(this)
    this.getProfileFromEvent = this.getProfileFromEvent.bind(this)
    this._request = this._request.bind(this)
  }

  onText (regexp, callback) {
    this._regexpCallback.push({regexp, callback})
  }

  _request (method, path, payload, type) {
    const url = (type === 'content') ? _baseUrlContent + path : _baseUrl + path
    const opts = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      url: url,
      data: payload || {}
    }
    if (type === 'content') opts.responseType = 'arraybuffer'
    return axios(opts).then(({data}) => data).catch(({response: {data}}) => Promise.reject(data))
  }

  processEvents (events, req) {
    this.emit('events', events, req)
    // `events` is a Webhook Event Object -- https://devdocs.line.me/en/#webhook-event-object
    events.forEach(this.parseOneEvent.bind(this))
  }

  parseOneEvent (event) {
    const { source: { type } } = event
    this.emit('event', event)
    this.emit(`event:${type}`, event)
    event.type = event.type || ''
    switch (event.type) {
      case 'message':
        this.emit('message', event)
        this.emit(`message:${type}`, event)
        if (event.message.type === 'text' && event.message.text) {
          this.emit('text', event)
          this.emit(`text:${type}`, event)
          this._regexpCallback.forEach(rgx => {
            const result = rgx.regexp.exec(event.message.text)
            if (result) rgx.callback(event, result)
          })
        } else {
          if (event.message.type === 'audio' || event.message.type === 'video' || event.message.type === 'image') {
            this.emit('message-with-content')
            this.emit(`message-with-content:${type}`, event)
          }
          this.emit('non-text', event)
          this.emit(`non-text:${type}`, event)
          this.emit(event.message.type, event)
        }
        break
      case 'follow':
        this.emit('follow', event)
        this.emit(`follow:${type}`, event)
        break
      case 'unfollow':
        this.emit('unfollow', event)
        this.emit(`unfollow:${type}`, event)
        break
      case 'join':
        this.emit('join', event)
        this.emit(`join:${type}`, event)
        break
      case 'leave':
        this.emit('leave', event)
        this.emit(`leave:${type}`, event)
        break
      case 'postback':
        this.emit('postback', event)
        this.emit(`postback:${type}`, event)
        break
      case 'beacon':
        this.emit('beacon', event)
        this.emit(`beacon:${type}`, event)
        break
      default:
        break
    }
  }

  pushMessage (channel, messages) {
    const pushEndpoint = '/v2/bot/message/push'
    messages = Array.isArray(messages) ? messages : [messages]
    if (messages.length < 1 || messages.length > 5) return Promise.reject(Error(`Invalid messages length. (1 - 5), the message was ${messages.length}`))
    let payload = {
      to: channel,
      messages: messages
    }
    return this._request('post', pushEndpoint, payload)
  }

  multicast (channels, messages) {
    const multicastEndpoint = '/v2/bot/message/multicast'
    if (!channels) return Promise.reject(Error('you must supply valid channels'))
    if (!messages) return Promise.reject(Error('you must supply messages to push'))
    messages = Array.isArray(messages) ? messages : [messages]
    channels = Array.isArray(channels) ? channels : [channels]
    if (messages.length < 1 || messages.length > 5) return Promise.reject(Error(`Invalid messages length. (1 - 5), the message was ${messages.length}`))
    if (channels.length < 1 || channels.length > 150) return Promise.reject(Error(`Invalid channels length. (1 - 150), the recipients were too many (${channels.length})`))
    let payload = {
      to: channels,
      messages: messages
    }
    return this._request('post', multicastEndpoint, payload)
  }

  replyMessage (replyToken, messages) {
    const replyEndpoint = '/v2/bot/message/reply'
    messages = Array.isArray(messages) ? messages : [messages]
    if (messages.length < 1 || messages.length > 5) return Promise.reject(Error(`Invalid messages length. (1 - 5), the message was ${messages.length}`))
    let payload = {
      replyToken: replyToken,
      messages: messages
    }
    return this._request('post', replyEndpoint, payload)
  }

  getContent (messageId) {
    if (!messageId || typeof messageId !== 'string') return Promise.reject(Error('No message Id.'))
    const contentEndpoint = `/v2/bot/message/${messageId}/content`
    return this._request('get', contentEndpoint, null, 'content')
  }

  getContentFromEvent ({message: {id}}) {
    return this.getContent(id)
  }

  getProfile (userId) {
    if (!userId || typeof userId !== 'string') return Promise.reject(Error('No user Id.'))
    const profileEndpoint = `/v2/bot/profile/${userId}`
    return this._request('get', profileEndpoint, null)
  }

  getProfileFromEvent ({source, source: {type}}) {
    return this.getProfile(source[`${type}Id`])
  }

  leaveChannel (channel) {
    let channelId = channel && (channel.groupId || channel.roomId)
    if (!channelId) return Promise.reject(Error('No channel Id.'))
    const leaveEndpoint = channel.groupId ? `/v2/bot/group/${channel}/leave` : `/v2/bot/room/${channel}/leave`
    return this._request('post', leaveEndpoint, null)
  }
}
