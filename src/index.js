import Bot from './bot'
import Messages from './messages'
//
// let bot = new Bot('secret', 'token')
// bot.on('msg', msg => console.log(msg))
// // console.log(bot)
// bot.on('webhook', w => console.log(`bot listens on port ${w}.`))
// bot.on('events', e => console.dir(e))
// bot.on('message', m => console.log(`incoming message: ${m}`))

// let arr = [{}]

// console.log(Array.isArray(arr[0]))
// console.log(Messages)
// let msg = new Messages()
// console.log(msg.text('hi').commit())
export { Messages }
export default Bot
