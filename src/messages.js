class Messages {
  constructor () {
    this._payload = []
    this.addText = this.addText.bind(this)
    this.addRaw = this.addRaw.bind(this)
    // this._checkErrors = this._checkErrors.bind(this)
  }

  // checkErrors (messages, type, payload) {
  //   if (messages._payload.length === 5) {
  //     console.error('Maximum payload length is 5.')
  //     return true
  //   }
  //   switch (type) {
  //     case 'raw':
  //
  //
  //     case 'text':
  //
  //     case 'image':
  //
  //     default:
  //   }
  //   return false
  // }

  addRaw (message) {
    if (this._payload.length === 5) {
      console.error('Maximum payload length is 5.')
      return this
    }
    if (!message || typeof message !== 'object') return this
    this._payload.push(message)
    return this
  }

  // message: {
  //   text: String
  // }
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

  addImage ({originalUrl, previewUrl}) {
    if (this._payload.length === 5) {
      console.error('Maximum payload length is 5.')
      return this
    }
    if (typeof originalUrl !== 'string' || typeof previewUrl !== 'string') {
      console.error('Mismatch type.')
      return this
    }
    this._payload.push({
      type: 'image',
      originalContentUrl: originalUrl,
      previewImageUrl: previewUrl
    })
    return this
  }

  addAudio ({originalUrl, duration}) {
    if (this._payload.length === 5) {
      console.error('Maximum payload length is 5.')
      return this
    }
    if (typeof originalUrl !== 'string' || typeof duration !== 'number') {
      console.error('Mismatch type.')
      return this
    }
    this._payload.push({
      type: 'audio',
      originalContentUrl: originalUrl,
      duration: duration
    })
    return this
  }

  commit () {
    return this._payload
  }
}

export default Messages
