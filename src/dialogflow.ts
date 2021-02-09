import dialogflow from '@google-cloud/dialogflow'
import { v4 } from 'uuid'
import path = require('path')

export default class Dialogflow {
  public async runSample (message: string): Promise<string> {
    const sessionId = v4()

    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: path.resolve(__dirname, '../dialogflow.json')
    })
    // @ts-expect-error
    const sessionPath = sessionClient.projectAgentSessionPath(process.env.DF_PROJECT_ID, sessionId)

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'pl'
        }
      }
    }

    // Send request and log result
    const responses = await sessionClient.detectIntent(request)
    const result = responses[0].queryResult

    if (result === undefined || result === null) return ''

    // @ts-expect-error
    return result.fulfillmentText
  }
}
