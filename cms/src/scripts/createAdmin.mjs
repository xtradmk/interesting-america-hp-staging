import { getPayloadClient } from '../lib/payloadClient.mjs'
import { upsertAdminUser } from '../lib/seeding.mjs'

const payload = await getPayloadClient()
const adminUser = await upsertAdminUser(payload)

if (!adminUser) {
  console.error('Missing PAYLOAD_ADMIN_EMAIL or PAYLOAD_ADMIN_PASSWORD.')
  process.exit(1)
}

console.log(`Admin user ready: ${adminUser.email}`)
