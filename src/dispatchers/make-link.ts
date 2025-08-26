import { Dispatcher, filters } from "@mtcute/dispatcher"
import env from "../env.js"
import { html, tl } from "@mtcute/node"

const dp = Dispatcher.child()

dp.onNewMessage(
  filters.and(
    filters.chatId(env.telegram.chats.secondary),
    filters.command('make_link', { prefixes: ['/'] }),
  ),
  async (ctx) => {
    try {
      const isAdmin = await ctx.client.getChatMembers(ctx.chat, {
        type: 'admins',
      }).then(admins => admins.some(admin => admin.user.id === ctx.sender.id))

      if (!isAdmin) {
        await ctx.replyText('You are not an admin')
        return
      }

      const link = await ctx.client.createInviteLink(ctx.chat, {
        withApproval: true,
      })
      await ctx.replyText(html`Link: <code>${link.link}</code>`)
    }
    catch (error: any) {
      console.error(error)

      await ctx.replyText(html`Something went wrong while creating link for chat: <code>${tl.isAnyError(error) ? error.text : 'Unknown error'}</code>`)
    }
  },
)

export default dp