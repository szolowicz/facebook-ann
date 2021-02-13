import * as mobilenet from '@tensorflow-models/mobilenet'
import * as tfnode from '@tensorflow/tfjs-node'
import * as translate from '@vitalets/google-translate-api'
import * as fs from 'fs'
import * as fetch from 'node-fetch'
import path = require('path')

export default class ImageClassification {
  private readonly IMAGES_DIRECTORY = path.resolve(__dirname, '../images/')

  public async start (url, api, threadID): Promise<void> {
    await this.downloadPhoto(url, api, threadID)
  }

  private async downloadPhoto (url, api, threadID): Promise<void> {
    const RANDOM_HASH = Math.random().toString(36).slice(7) + '.jpg'
    const IMAGE_PATH = path.resolve(this.IMAGES_DIRECTORY + '/' + RANDOM_HASH)

    // @ts-expect-error
    const response = await fetch(url)
    const buffer = await response.buffer()

    this.createFolder()

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

      this.removeFolder()
    })
  }

  private async prepareResponse (message: string, threadID, api): Promise<void> {
    return translate(message, { to: 'pl' })
      .then((response) => ImageClassification.sendResponse(response.text, threadID, api))
      .catch(error => console.error(error))
  }

  private static sendResponse (message, threadID, api): void {
    api.sendMessage(message, threadID)
  }

  private createFolder (): void {
    fs.mkdirSync(this.IMAGES_DIRECTORY, { recursive: true })
  }

  private removeFolder (): void {
    fs.rmdirSync(this.IMAGES_DIRECTORY, { recursive: true })
  }
}
