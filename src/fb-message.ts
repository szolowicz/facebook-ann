import ImageClassification from './image-classification'
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const delay = async ms => new Promise(resolve => setTimeout(resolve, ms))

export default class Message {
  private readonly image_classification = new ImageClassification()

  private readonly MESSAGE_TIMEOUT = 1500

  public listenForMessages (api): void {
    api.listenMqtt(async (error_, event) => {
      if (event.type !== 'message') return
      if (event.isGroup === true) return

      // mark as read
      await delay(this.MESSAGE_TIMEOUT)
      api.markAsRead(event.threadID)

      // fake typing indicator
      await delay(this.MESSAGE_TIMEOUT)
      api.sendTypingIndicator(event.threadID)

      // message
      await delay(this.MESSAGE_TIMEOUT)
      if (event.attachments[0]?.type === 'photo') {
        void await this.image_classification.start(event.attachments[0].previewUrl, api, event.threadID)
      } else {
        api.sendMessage(event.body, event.threadID)
      }
    })
  }
}
