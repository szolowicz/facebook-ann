import Dialogflow from './dialogflow'
import ImageClassification from './image-classification'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const delay = async ms => new Promise(resolve => setTimeout(resolve, ms))

export default class Message {
  private readonly image_classification = new ImageClassification()

  private readonly dialogflow = new Dialogflow()

  private readonly MESSAGE_TIMEOUT = 1500

  public listenForMessages (api): void {
    api.listenMqtt(async (error_, event) => {
      if (event.type !== 'message') return
      if (event.isGroup === true) return

      await this.markMessageAsRead(api, event.threadID)

      await this.fakeTypingIndicator(api, event.threadID)

      await this.sendResponse(api, event.threadID, event.attachments, event.body)
    })
  }

  private async markMessageAsRead (api, threadID): Promise<void> {
    await delay(this.MESSAGE_TIMEOUT)

    api.markAsRead(threadID)
  }

  private async fakeTypingIndicator (api, threadID): Promise<void> {
    await delay(this.MESSAGE_TIMEOUT)

    api.sendTypingIndicator(threadID)
  }

  private async sendResponse (api, threadID, attachments, body): Promise<void> {
    await delay(this.MESSAGE_TIMEOUT)

    if (attachments[0]?.type === 'photo') {
      void await this.image_classification.start(attachments[0].previewUrl, api, threadID)
    } else {
      void await this.dialogflow.start(body, api, threadID)
    }
  }
}
