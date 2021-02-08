import * as dotenv from 'dotenv'
import * as fb from 'facebook-chat-api'

dotenv.config()

export default class Login {
  constructor () {
    try {
      this.login()
    } catch (error) {
      console.error(error)
    }
  }

  private login (): void {
    fb({ email: process.env.FB_EMAIL, password: process.env.FB_PASSWORD }, (error, api) => {
      if (error !== null) return console.error(error)

      this.listenForMessages(api)
    })
  }

  private listenForMessages (api): void {
    api.listenMqtt((error_, message) => {
      if (message.isGroup === true) return

      api.sendMessage(message.body, message.threadID)
    })
  }
}
