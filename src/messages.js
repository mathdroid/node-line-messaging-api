class Messages {
  constructor () {
    this._payload = []
    this.text = this.text.bind(this)
  }

  addText (message) {
    if (this._payload.length === 5) {
      console.error('Maximum payload length is 5.')
      return this
    }
    if (!message) return this
    this._payload.push({
      type: 'text',
      text: message.text || message || ''
    })
    return this
  }

  commit () {
    return this._payload
  }
}

export default Messages
