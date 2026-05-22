import { seedPayloadContent } from '../lib/seeding.mjs'

const result = await seedPayloadContent()

console.log(`Seeded ${result.pageCount} pages and ${result.mediaCount} media items.`)

if (result.adminEmail) {
  console.log(`Admin user ready: ${result.adminEmail}`)
} else {
  console.log('No admin user created. Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD to create one.')
}
