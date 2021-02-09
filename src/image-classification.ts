import * as mobilenet from '@tensorflow-models/mobilenet'
import * as tfnode from '@tensorflow/tfjs-node'
import * as translate from '@vitalets/google-translate-api'
import * as fs from 'fs'
import * as fetch from 'node-fetch'
import path = require('path')
import googleTranslateApi = require('@vitalets/google-translate-api')

export default class ImageClassification {
  private readonly IMAGES_DIRECTORY = '../images/'

  public async start (url, api, threadID): Promise<void> {
    const RANDOM_HASH = Math.random().toString(36).slice(7) + '.jpg'
    const IMAGE_PATH = path.resolve(__dirname, this.IMAGES_DIRECTORY + RANDOM_HASH)

    // @ts-expect-error
    const response = await fetch(url)
    const buffer = await response.buffer()

    /* eslint-disable @typescript-eslint/no-misused-promises */
    await fs.writeFile(IMAGE_PATH, buffer, async (): Promise<void> => {
      const originalImage = fs.readFileSync(IMAGE_PATH)
      const image = tfnode.node.decodeImage(originalImage)

      const MobileNetModel = await mobilenet.load()
      // @ts-expect-error
      const prediction = await MobileNetModel.classify(image)

      let message = ''
      for (const element of prediction) {
        message += `• ${element.className} -> ${element.probability.toPrecision(2)}%\n\n`
      }

      await this.prepareResponse(message, threadID, api)

      await fs.unlinkSync(IMAGE_PATH)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  private async prepareResponse (message: string, threadID, api): Promise<googleTranslateApi.ITranslateResponse | void> {
    return translate(message, { to: 'pl' })
      .then((response) => {
        this.sendResponse(response.text, threadID, api)
      })
      .catch(error => {
        console.error(error)
      })
  }

  private sendResponse (message, threadID, api): void {
    api.sendMessage(message, threadID)
  }
}
