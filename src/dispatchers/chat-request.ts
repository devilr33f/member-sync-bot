import type { ChatJoinRequestUpdateContext } from '@mtcute/dispatcher'
import type { TelegramClient } from '@mtcute/node'
import { Dispatcher, filters } from '@mtcute/dispatcher'
import { html, tl } from '@mtcute/node'
import env from '@/env.js'
import { MemberService } from '@/services/member.js'

const dp = Dispatcher.child()

dp.onBotChatJoinRequest(
  filters.chatId(env.telegram.chats.secondary),
  async (ctx: ChatJoinRequestUpdateContext) => {
    try {
      const isMainChatMember = await MemberService.isMainChatsMember(ctx.client as TelegramClient, ctx.user)

      if (!isMainChatMember) {
        await ctx.client.sendText(ctx.chat, html`${ctx.user.mention()} is not a member of the main chats, rejecting request.`)
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
