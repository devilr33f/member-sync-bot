import { Dispatcher, filters } from '@mtcute/dispatcher'
import { html, tl } from '@mtcute/node'
import env from '@/env.js'

const dp = Dispatcher.child()

dp.onNewMessage(
  filters.and(
    filters.chatId(env.telegram.chats.main),
    filters.command('sync_all', { prefixes: ['/'] }),
  ),
  async (ctx) => {
    const isAdmin = await ctx.client.getChatMembers(ctx.chat, {
      type: 'admins',
    }).then(admins => admins.some(admin => admin.user.id === ctx.sender.id))

    if (!isAdmin) {
      await ctx.replyText('You are not an admin')
      return
    }

    const promises = env.telegram.chats.secondary.map(async (chat) => {
      try {
        const members = await ctx.client.getChatMembers(chat, {
          type: 'all',
        })

        const promises = members.map(async (member) => {
          try {
            await ctx.client.kickChatMember({ chatId: chat, userId: member.user.id })
              .then(() => ctx.client.sendText(chat, html`${member.user.mention()} is not a member of the main chat, kicked.`))
          }
          catch (error: any) {
            console.error(error)
            await ctx.client.sendText(chat, html`Failed to kick ${member.user.mention()} from the chat: <code>${tl.isAnyError(error) ? error.text : 'Unknown error'}</code>`)
          }
        })

        await Promise.all(promises)
      }
      catch (error: any) {
        console.error(error)
        await ctx.client.sendText(chat, html`Failed to sync members of the chats: <code>${tl.isAnyError(error) ? error.text : 'Unknown error'}</code>`)
      }
    })

    await Promise.all(promises)
  },
)

export default dp
