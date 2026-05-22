import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import { importMap } from '../importMap'

export const generateMetadata = ({ params, searchParams }) =>
  generatePageMetadata({ config, params, searchParams })

export default function PayloadAdminPage({ params, searchParams }) {
  return RootPage({ config, params, searchParams, importMap })
}

