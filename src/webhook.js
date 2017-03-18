import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import localtunnel from 'localtunnel'

import crypto from 'crypto'

const DEFAULT_PORT = 5463 // LINE
const DEFAULT_ENDPOINT = '/'
const DEFAULT_TUNNEL = false

class Webhook {
  constructor ({secret, token, options = {}, onEvents, onWebhook, onTunnel}) {
    this.secret = secret
    this.token = token
    this.onEvents = onEvents
    this.events = 0

    this._parseBody = this._parseBody.bind(this)
    this._getSignature = this._getSignature.bind(this)
    this._verifyRequest = this._verifyRequest.bind(this)
    this._createTunnel = this._createTunnel.bind(this)

    const app = express()
    const APP_PORT = options.port || DEFAULT_PORT
    const APP_ENDPOINT = options.endpoint || DEFAULT_ENDPOINT
    const APP_TUNNEL = options.tunnel || options.ngrok || DEFAULT_TUNNEL
    const IS_VERIFY_SIGNATURE = options.verifySignature || false

    app.use(morgan('dev'))
    if (IS_VERIFY_SIGNATURE) {
      app.use(bodyParser.json({verify: this._verifyRequest}))
      app.use(this._abortOnError)
    } else {
      app.use(bodyParser.json())
    }
    app.get(APP_ENDPOINT, (req, res) => {
      res.send('listening on port ' + APP_PORT + `, handled ${this.events} events.`)
    })
    app.post(APP_ENDPOINT, this._parseBody.bind(this))
    app.use((err, req, res, next) => {
      console.log(err)
      res.status(500).send(err)
    })
    this._webserver = app
    this._webserver.listen(APP_PORT, (err) => {
      if (!err) {
        onWebhook({port: APP_PORT, endpoint: APP_ENDPOINT})
        if (APP_TUNNEL) {
          this._createTunnel(APP_PORT).then(onTunnel).catch(onTunnel)
        }
      }
    }).on('error', (err) => {
      console.error(err)
    })
  }

  _createTunnel (port) {
    return new Promise((resolve, reject) => {
      const tunnel = localtunnel(port, (err, {url}) => {
        if (err) {
          reject({err})
        }
        resolve({url})
      })
      this.tunnel = tunnel
    })
  }

  _parseBody (req, res, next) {
    const events = req.body && req.body.events
    if (events) {
      // console.log(this)
      res.send('OK')
      this.onEvents(events, req)
      this.events++
    } else {
      next('no events found')
      // return null
    }
  }

  _getSignature (buf) {
    const hmac = crypto.createHmac('sha256', this.secret).update(buf, 'utf-8').digest('base64')
    return hmac
  }

  _verifyRequest (req, res, buf, encoding) {
    const lineHeaderName = 'X-Line-Signature'
    const lineHeader = lineHeaderName.toLowerCase()
    const expected = req.headers[lineHeader]
    const calculated = this._getSignature(buf)
    // console.log(`X-Line-Signature: ${expected}\nBody: ${buf.toString('utf8')}`)
    if (expected !== calculated) {
      throw new Error('Invalid signature.')
    // } else {
      // console.log('Valid Signature.')
    }
  }

  _abortOnError (err, req, res, next) {
    if (err) {
      console.log(err)
      res.status(400).send({error: 'Invalid signature.'})
    } else {
      next()
    }
  }
}

export default Webhook
