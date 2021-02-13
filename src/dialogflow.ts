import dialogflow from '@google-cloud/dialogflow'
import { v4 } from 'uuid'
import path = require('path')

export default class Dialogflow {
  private sessionClient
  private sessionPath

  public async start (message: string, api, threadID): Promise<void> {
    this.getSession()
    void await this.getResponse(message, api, threadID)
  }

  private async getResponse (message: string, api, threadID): Promise<void> {
    const request = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'pl'
        }
      }
    }

    const responses = await this.sessionClient.detectIntent(request)
    const result = responses[0].queryResult

    if (result === undefined || result === null) return

    Dialogflow.sendResponse(result.fulfillmentText, threadID, api)
  }

  private getSession (): void {
    const sessionId = v4()

    this.sessionClient = new dialogflow.SessionsClient({
      keyFilename: path.resolve(__dirname, '../dialogflow.json')
    })

    this.sessionPath = this.sessionClient.projectAgentSessionPath(process.env.DF_PROJECT_ID, sessionId)
  }

  private static sendResponse (message, threadID, api): void {
    api.sendMessage(message, threadID)
  }
}
