import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

const DEFAULT_PORT = 5463 // LINE
const DEFAULT_ENDPOINT = '/'

class Webhook {
  constructor (token, opts = {}, callback, whCallback) {
    this.token = token
    this.callback = callback

    const app = express()
    const APP_PORT = opts.port || DEFAULT_PORT
    const APP_ENDPOINT = opts.endpoint || DEFAULT_ENDPOINT

    app.use(morgan('dev'))
    app.use(bodyParser.json())
    app.get(APP_ENDPOINT, (req, res) => {
      res.send('listening on port ' + APP_PORT)
    })
    app.post(APP_ENDPOINT, this._parseBody.bind(this))
    app.use((err, req, res, next) => {
      res.status(500).send(err)
    })
    this._webserver = app
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
      this.callback(events)
      res.send('OK')
    } else {
      next('no events found')
      // return null
    }
  }
}

export default Webhook
