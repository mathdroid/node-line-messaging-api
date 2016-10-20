import EventEmitter from 'eventemitter3'
import axios from 'axios'

import Webhook from './webhook'

const _eventTypes = ['message', 'follow', 'unfollow', 'join', 'leave', 'postback', 'beacon']
const _messageTypes = ['text', 'image', 'video', 'audio', 'location', 'sticker']
const _sourceTypes = ['user', 'group', 'room']

const _baseUrl = 'https://api.line.me'

class LineBot extends EventEmitter {

  static get eventTypes () {
    return _eventTypes
  }

  static get messageTypes () {
    return _messageTypes
  }

  static get sourceTypes () {
    return _sourceTypes
  }

  constructor (secret, token, options = {}) {
    super()
    this.secret = secret
    this.token = token
    this.options = options
    this._Webhook = new Webhook(this.token, this.options.webhook, this.processEvents.bind(this), (webhookStarted) => {
      this.emit('webhook', webhookStarted)
    })
    this._regexpCallback = []
  }

  onText (regexp, callback) {
    this._regexpCallback.push({regexp, callback})
  }

  _request (method, path, payload) {
    return axios({
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      url: _baseUrl + path,
      data: payload || {}
    })
  }

  processEvents (events) {
    this.emit('events', events)
    // `events` is a Webhook Event Object -- https://devdocs.line.me/en/#webhook-event-object
    events.forEach(this.parseOneEvent.bind(this))
  }

  parseOneEvent (event) {
    this.emit('event', event)
    event.type = event.type || ''
    switch (event.type) {
      case 'message':
        this.emit('message', event)
        this.emit(event.message.type, event)
        if (event.message.type === 'text' && event.message.text) {
          this._regexpCallback.forEach(rgx => {
            const result = rgx.regexp.exec(event.message.text)
            if (result) rgx.callback(event, result)
          })
        }
        break
      case 'follow':
        this.emit('follow', event)
        break
      case 'unfollow':
        this.emit('unfollow', event)
        break
      case 'join':
        this.emit('join', event)
        break
      case 'leave':
        this.emit('leave', event)
        break
      case 'postback':
        this.emit('postback', event)
        break
      case 'beacon':
        this.emit('beacon', event)
        break
      default:
        break
    }
  }

  pushMessage (channel, messages) {
    const pushEndpoint = '/v2/bot/message/push'
    messages = Array.isArray(messages) ? messages : [messages]
    if (messages.length < 1 || messages.length > 5) return Promise.reject('Invalid messages length. (1 - 5)')
    let payload = {
      'to': `${channel}`,
      'messages': `${messages}`
    }
    return this._request('post', pushEndpoint, payload).bind(this)
  }

  replyMessage (replyToken, messages) {
    const replyEndpoint = '/v2/bot/message/reply'
    messages = Array.isArray(messages) ? messages : [messages]
    if (messages.length < 1 || messages.length > 5) return Promise.reject('Invalid messages length. (1 - 5)')
    let payload = {
      'replyToken': `${replyToken}`,
      'messages': `${messages}`
    }
    return this._request('post', replyEndpoint, payload).bind(this)
  }

  getContent (messageId) {
    if (!messageId || typeof messageId !== 'string') return Promise.reject('No message Id.')
    const contentEndpoint = `/v2/bot/message/${messageId}/content`
    return this._request('get', contentEndpoint, null).bind(this)
  }

  getProfile (userId) {
    if (!userId || typeof userId !== 'string') return Promise.reject('No user Id.')
    const profileEndpoint = `/v2/bot/profile/${userId}`
    return this._request('get', profileEndpoint, null).bind(this)
  }

  leaveChannel (channel) {
    let channelId = channel && (channel.groupId || channel.roomId)
    if (!channelId) return Promise.reject('No channel Id.')
    const leaveEndpoint = channel.groupId ? `/v2/bot/group/${channel}/leave` : `/v2/bot/room/${channel}/leave`
    return this._request('post', leaveEndpoint, null).bind(this)
  }
}

export default LineBot
