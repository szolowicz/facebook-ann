import * as dotenv from 'dotenv'
import * as fb from 'facebook-chat-api'

import Message from './fb-message'

dotenv.config()

class Thread {
  private readonly message = new Message()

  constructor () {
    try {
      this.start()
    } catch (error) {
      console.error(error)
    }
  }

  private start (): void {
    fb({ email: process.env.FB_EMAIL, password: process.env.FB_PASSWORD }, (error, api) => {
      if (error !== null) return console.error(error)

      this.message.listenForMessages(api)
    })
  }
}

export default new Thread()
