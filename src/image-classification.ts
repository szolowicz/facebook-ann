import * as mobilenet from '@tensorflow-models/mobilenet'
import * as tf from '@tensorflow/tfjs'
import * as tfnode from '@tensorflow/tfjs-node'
import * as translate from '@vitalets/google-translate-api'
import * as fs from 'fs'
import * as fetch from 'node-fetch'

import path = require('path')

const IMAGES_DIRECTORY = '../images/'

export async function download (url, api, threadID): Promise<void> {
  const RANDOM_HASH = Math.random().toString(36).slice(7) + '.jpg'
  const IMAGE_PATH = path.resolve(__dirname, IMAGES_DIRECTORY + RANDOM_HASH)

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

    translate(message, { to: 'pl' }).then(response => {
      api.sendMessage(response.text, threadID)
    }).catch(error => {
      console.error(error)
    })

    await fs.unlinkSync(IMAGE_PATH)
  })
}
