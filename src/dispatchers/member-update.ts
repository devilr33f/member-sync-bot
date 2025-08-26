import env from "@/env.js"
import { Dispatcher, filters } from "@mtcute/dispatcher"
import { html, tl } from "@mtcute/node"

const dp = Dispatcher.child()

dp.onChatMemberUpdate(
  filters.and(
    filters.chatId(env.telegram.chats.main),
    filters.or(
      filters.chatMember('left'),
      filters.chatMember('kicked'),
    ),
  ),
  async (ctx) => {
    const promises = env.telegram.chats.secondary.map(async (chat) => {
      try {
        await ctx.client.kickChatMember({ chatId: chat, userId: ctx.user.id })
          .then(() => ctx.client.sendText(chat, html`${ctx.user.mention()} left the main chat, kicked.`))
      }
      catch (error: any) {
        console.error(error)
        await ctx.client.sendText(chat, html`Failed to kick ${ctx.user.mention(ctx.user.displayName)} from the chat: <code>${tl.isAnyError(error) ? error.text : 'Unknown error'}</code>`)
      }
    })

    await Promise.all(promises)
  },
)

export default dp