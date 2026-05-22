import { getPayload } from 'payload'

import configPromise from '../payload.config.mjs'

let payloadPromise

export async function getPayloadClient() {
  if (!payloadPromise) {
    payloadPromise = getPayload({
      config: configPromise,
    })
  }

  return payloadPromise
}
