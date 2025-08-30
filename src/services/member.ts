import type { TelegramClient, User } from '@mtcute/node'
import env from '@/env.js'

export class MemberService {
  static async isMainChatsMember(tg: TelegramClient, member: User) {
    const chats = env.telegram.chats.main

    for (const chat of chats) {
      const chatMember = await tg.getChatMember({ chatId: chat, userId: member })
      if (chatMember && !['left', 'banned'].includes(chatMember.status)) {
        return true
      }
    }

    return false
  }
}
