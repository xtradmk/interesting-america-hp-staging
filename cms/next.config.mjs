import path from 'path'
import { fileURLToPath } from 'url'

import { withPayload } from '@payloadcms/next/withPayload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const nextConfig = {
  typedRoutes: true,
  turbopack: {
    root: dirname,
  },
  webpack: (config, { dev }) => {
    if (!dev && config.optimization) {
      config.optimization.minimize = false
    }

    return config
  },
}

export default withPayload(nextConfig)
