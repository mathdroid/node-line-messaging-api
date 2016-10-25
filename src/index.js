import Bot from './bot'
import Messages from './messages'
//
// let bot = new Bot('secret', 'token')
// bot.on('webhook', w => console.log(`bot listens on port ${w}.`))
// bot.on('message', m => console.log(m))

// let arr = [{}]

// console.log(Array.isArray(arr[0]))
// console.log(Messages)
// let msg = new Messages()
// console.log(msg.addText('hi').addText('lol').addText({text: 'harambe'}).commit())
export { Messages }
export default Bot
