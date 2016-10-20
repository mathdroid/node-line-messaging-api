import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

const DEFAULT_PORT = 5463 // LINE

class Webhook {
  constructor (token, opts = {}, callback, whCallback) {
    this.token = token
    this.callback = callback

    const app = express()
    app.use(morgan('dev'))
    app.use(bodyParser.json())
    app.post('/', this._parseBody.bind(this))
    app.use((err, req, res, next) => {
      res.status(500).send(err)
    })
    this._webserver = app
    const APP_PORT = opts.port || DEFAULT_PORT
    this._webserver.listen(APP_PORT, (err) => {
      if (!err) whCallback(APP_PORT)
    }).on('error', (err) => {
      console.error(err)
    })
  }

  _parseBody (req, res, next) {
    const events = req.body && req.body.events
    if (events) {
      // console.log(this)
      res.send('OK')
      return this.callback(events)
    } else {
      next('no events found')
      return null
    }
  }
}

export default Webhook
