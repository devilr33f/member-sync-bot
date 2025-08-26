import env from "@/env.js"
import { ChatJoinRequestUpdateContext, Dispatcher, filters } from "@mtcute/dispatcher"
import { html, tl } from "@mtcute/node"

const dp = Dispatcher.child()

dp.onBotChatJoinRequest(
  filters.chatId(env.telegram.chats.secondary),
  async (ctx: ChatJoinRequestUpdateContext) => {
    try {
      const isMainChatMember = await ctx.client.getChatMembers(env.telegram.chats.main, {
        type: 'all',
      }).then(members => members.some(member => member.user.id === ctx.user.id))

      if (!isMainChatMember) {
        await ctx.client.sendText(ctx.chat, html`${ctx.user.mention()} is not a member of the main chat, rejecting request.`)
        return ctx.decline()
      }

      return ctx.approve()
    }
    catch (error: any) {
      console.error(error)

      await ctx.client.sendText(ctx.chat, html`Something went wrong while processing user request for ${ctx.user.mention()}: <code>${tl.isAnyError(error) ? error.text : 'Unknown error'}</code>`)
    }
  },
)

export default dp