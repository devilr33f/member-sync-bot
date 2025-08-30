import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'
import env from 'env-var'

if (existsSync('.env'))
  loadEnvFile('.env')

export default {
  mode: env.get('NODE_ENV').default('production').asString(),
  telegram: {
    apiId: env.get('TELEGRAM_API_ID').required().asInt(),
    apiHash: env.get('TELEGRAM_API_HASH').required().asString(),
    botToken: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    chats: {
      main: env.get('TELEGRAM_MAIN_CHAT_ID').required().asArray(',').map(id => id.trim()).filter(id => id.length > 0).map(id => Number(id)),
      secondary: env.get('TELEGRAM_SECONDARY_CHAT_IDS').required().asArray(',').map(id => id.trim()).filter(id => id.length > 0).map(id => Number(id)),
    },
  },
}
