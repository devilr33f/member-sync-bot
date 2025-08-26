import { Dispatcher } from '@mtcute/dispatcher'
import { TelegramClient } from '@mtcute/node'
import env from './env.js'
import dispatchers from './dispatchers/index.js'

const tg = new TelegramClient({
  apiId: env.telegram.apiId,
  apiHash: env.telegram.apiHash,
  storage: 'bot-data/storage',
})
const dp = Dispatcher.for(tg)

for (const childDp of dispatchers) {
  dp.extend(childDp)
}

await tg.start({
  botToken: env.telegram.botToken,
}).then((me) => {
  console.log(`Logged in as @${me.username}`)
})
